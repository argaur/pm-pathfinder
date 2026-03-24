import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

const genai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

export async function POST(req: NextRequest) {
  try {
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

  // ── Retrieve relevant chunks ─────────────────────────────────────────────
  const embeddingModel = genai.getGenerativeModel({ model: 'gemini-embedding-001' })
  const embeddingResult = await embeddingModel.embedContent(message)
  const queryEmbedding = embeddingResult.embedding.values

  const { data: chunks } = await supabaseAdmin.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_count: 4,
    filter: archetype ? { archetype } : {},
  })

  const contextBlock = chunks && chunks.length > 0
    ? `\n\n---\nRelevant context from PM Pathfinder learning content:\n\n${
        chunks.map((c: { content: string; source: string }, i: number) =>
          `[${i + 1}] (source: ${c.source})\n${c.content}`
        ).join('\n\n')
      }\n---`
    : ''

  // ── Stream Gemini response ───────────────────────────────────────────────
  const model = genai.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT + contextBlock,
  })

  const chat = model.startChat({ history })

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await chat.sendMessageStream(message)
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(new TextEncoder().encode(text))
        }
      } catch (e) {
        controller.error(e)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[/api/chat]', msg)
    return new Response(`Server error: ${msg}`, { status: 500 })
  }
}
