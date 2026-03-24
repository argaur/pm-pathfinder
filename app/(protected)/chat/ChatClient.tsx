'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import BlurGate from '@/components/ui/BlurGate'

interface Message {
  role: 'user' | 'model'
  text: string
}

interface GeminiPart { text: string }
interface GeminiMessage { role: 'user' | 'model'; parts: GeminiPart[] }

interface Props {
  archetype: string | null
  isPro: boolean
}

const STARTERS = [
  'How do I prioritize features when stakeholders disagree?',
  'Walk me through a good product strategy framework',
  'How should I approach a guesstimate question?',
  'What makes a strong PM metrics answer?',
]

export default function ChatClient({ archetype, isPro }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function buildHistory(): GeminiMessage[] {
    return messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }))
  }

  async function send(userText: string) {
    const text = userText.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setStreaming(true)

    const history = buildHistory()
    const modelMsg: Message = { role: 'model', text: '' }
    setMessages((prev) => [...prev, modelMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, archetype }),
      })

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => '')
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'model', text: `Error ${res.status}: ${errText || 'Something went wrong. Please try again.'}` },
        ])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'model', text: accumulated },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'model', text: 'Network error. Please try again.' },
      ])
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-0.5">
            AI Guide
          </p>
          <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
            Navigator
          </h1>
          <p className="text-sm text-[#918fa1] mt-1">
            Ask anything PM — grounded in your learning content
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#918fa1] bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Gemini Flash · RAG
        </div>
      </div>

      <BlurGate locked={!isPro} label="Navigator is a Pro feature">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Message area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#c7c4d8] font-medium mb-1">
                    Hi, I'm Navigator
                  </p>
                  <p className="text-xs text-[#918fa1]">
                    Ask me anything about product management
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs text-[#918fa1] bg-[#171f33] border border-white/[0.06] hover:border-indigo-500/30 hover:text-[#c7c4d8] rounded-xl px-3 py-2.5 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'model' && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-indigo-500/10 border border-indigo-500/20 text-[#c3c0ff]'
                        : 'bg-[#171f33] border border-white/[0.06] text-[#c7c4d8]'
                    }`}
                  >
                    {m.text || (
                      <span className="inline-flex gap-1 items-center text-[#3d4a60]">
                        <span className="animate-pulse">▋</span>
                      </span>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-[#171f33] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[#918fa1]" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex gap-2 items-end bg-[#171f33] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-indigo-500/40 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a PM question… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#c7c4d8] placeholder:text-[#3d4a60] resize-none focus:outline-none max-h-32"
                style={{ lineHeight: '1.5' }}
                disabled={streaming}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || streaming}
                className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center hover:bg-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-[#3d4a60] mt-1.5 text-center">
              Grounded in your archetype content + The Builder's Bible
            </p>
          </div>
        </div>
      </BlurGate>
    </div>
  )
}
