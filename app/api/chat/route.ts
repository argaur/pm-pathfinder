import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const maxDuration = 60

const SYSTEM_PROMPT = `You are Navigator, the AI guide inside PM Pathfinder — a learning platform that helps aspiring and transitioning product managers build job-ready skills.

Your role:
- Answer product management questions clearly and practically
- Draw on the provided context chunks when they are relevant
- When the context covers the topic, ground your answer in it
- When the context is insufficient, answer from general PM knowledge but say so briefly
- Keep answers focused and actionable — no filler, no padding
- Use concrete examples and frameworks where useful

Tone: direct, warm, knowledgeable — like a senior PM mentor, not a textbook.

Do NOT:
- Pretend you don't have knowledge outside the context
- Refuse to answer general PM questions
- Add disclaimers about being an AI in every response`

// ── Google AI REST helpers (no SDK — avoids Vercel runtime incompatibility) ──

const GOOGLE_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options)
    if (res.status !== 429 || attempt === maxRetries) return res
    // Exponential backoff: 1s, 2s, 4s
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
  }
  // Unreachable, but TypeScript needs this
  return fetch(url, options)
}

async function embedText(text: string, apiKey: string): Promise<number[]> {
  const res = await fetchWithRetry(
    `${GOOGLE_API_BASE}/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
      }),
    }
  )
  if (!res.ok) {
    const body = await res.text()
    console.error('[embed] status:', res.status, body)
    throw new Error(`Embed failed: ${res.status} ${body}`)
  }
  const data = await res.json()
  return data.embedding.values
}

async function* streamGemini(
  apiKey: string,
  systemInstruction: string,
  history: { role: string; parts: { text: string }[] }[],
  message: string
): AsyncGenerator<string> {
  const res = await fetchWithRetry(
    `${GOOGLE_API_BASE}/models/gemini-2.5-flash-exp:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: { temperature: 0.7 },
      }),
    }
  )

  if (res.status === 429) {
    const body = await res.text()
    console.error('[generate] 429 body:', body)
    throw new Error('Rate limit reached — please wait a moment and try again')
  }
  if (!res.ok || !res.body) {
    console.error('[generate] status:', res.status)
    throw new Error(`Gemini failed: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const json = line.slice(6).trim()
      if (!json || json === '[DONE]') continue
      try {
        const parsed = JSON.parse(json)
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) yield text
      } catch { /* skip malformed */ }
    }
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) return new Response('Missing GOOGLE_AI_API_KEY', { status: 500 })
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return new Response('Missing SUPABASE_SERVICE_ROLE_KEY', { status: 500 })

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Auth check
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const { message, history, archetype } = await req.json() as {
      message: string
      history: { role: 'user' | 'model'; parts: { text: string }[] }[]
      archetype: string | null
    }
    if (!message?.trim()) return new Response('Empty message', { status: 400 })

    // ── Retrieve relevant chunks ───────────────────────────────────────────
    const queryEmbedding = await embedText(message, apiKey)

    const { data: chunks } = await supabaseAdmin.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_count: 4,
      filter: archetype ? { archetype } : {},
    })

    const contextBlock = chunks && chunks.length > 0
      ? `\n\n---\nRelevant context:\n\n${
          chunks.map((c: { content: string; source: string }, i: number) =>
            `[${i + 1}] (${c.source})\n${c.content}`
          ).join('\n\n')
        }\n---`
      : ''

    const systemInstruction = SYSTEM_PROMPT + contextBlock

    // ── Stream response ────────────────────────────────────────────────────
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamGemini(apiKey, systemInstruction, history, message)) {
            controller.enqueue(new TextEncoder().encode(chunk))
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e)
          controller.enqueue(new TextEncoder().encode(`\n[Error: ${msg}]`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[/api/chat]', msg)
    return new Response(`Server error: ${msg}`, { status: 500 })
  }
}
