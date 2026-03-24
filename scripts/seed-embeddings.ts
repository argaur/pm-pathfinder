/**
 * Seed script — embeds all RAG content and upserts to Supabase pgvector.
 *
 * Run: npx tsx scripts/seed-embeddings.ts
 *
 * Sources:
 *  1. archetype-content.ts — concept + framework per learning step (60 chunks)
 *  2. The-Builders-Bible.pdf — chunked at ~500 words with 50-word overlap
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import { ARCHETYPE_CHAPTERS } from '../lib/data/archetype-content'

// ── Config ──────────────────────────────────────────────────────────────────

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const PDF_PATH = 'C:/Users/Gaurav Gupta/Documents/Professional/Learning/The-Builders-Bible.pdf'
const CHUNK_WORDS = 500
const CHUNK_OVERLAP_WORDS = 50
const BATCH_SIZE = 5 // embed N chunks at a time to avoid rate limits

// ── Clients ─────────────────────────────────────────────────────────────────

const genai = new GoogleGenerativeAI(GOOGLE_AI_API_KEY)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Helpers ──────────────────────────────────────────────────────────────────

async function embed(text: string, retries = 4): Promise<number[]> {
  const model = genai.getGenerativeModel({ model: 'gemini-embedding-001' })
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.embedContent(text)
      return result.embedding.values
    } catch (e) {
      if (attempt === retries) throw e
      const wait = 1000 * 2 ** attempt // 1s, 2s, 4s, 8s
      console.warn(`  ⚠ embed failed (attempt ${attempt + 1}), retrying in ${wait}ms…`)
      await sleep(wait)
    }
  }
  throw new Error('embed: unreachable')
}

function chunkText(text: string, chunkWords: number, overlapWords: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  let i = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkWords).join(' ')
    if (chunk.trim().length > 50) chunks.push(chunk)
    i += chunkWords - overlapWords
  }
  return chunks
}

async function upsertChunk(chunk: {
  content: string
  source: string
  metadata: Record<string, unknown>
  embedding: number[]
}) {
  const { error } = await supabase.from('document_chunks').insert({
    content: chunk.content,
    source: chunk.source,
    metadata: chunk.metadata,
    embedding: JSON.stringify(chunk.embedding),
  })
  if (error) throw new Error(`Supabase insert error: ${error.message}`)
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// ── Source 1: Archetype content ──────────────────────────────────────────────

async function seedArchetypeContent() {
  console.log('\n📚 Seeding archetype-content chunks...')
  let count = 0

  for (const [archetype, chapters] of Object.entries(ARCHETYPE_CHAPTERS)) {
    for (const chapter of chapters) {
      for (const step of chapter.steps) {
        const content = [
          `Topic: ${step.title}`,
          `Dimension: ${chapter.dimension}`,
          `Concept: ${step.concept}`,
          `Framework: ${step.framework}`,
        ].join('\n\n')

        const embedding = await embed(content)
        await upsertChunk({
          content,
          source: 'archetype-content',
          metadata: {
            archetype,
            dimension: chapter.dimension,
            step_id: step.id,
            step_title: step.title,
          },
          embedding,
        })

        count++
        console.log(`  ✓ [${archetype}] ${step.title}`)
        await sleep(400) // stay under rate limit
      }
    }
  }

  console.log(`✅ Archetype content: ${count} chunks seeded.`)
}

// ── Source 2: Builder's Bible PDF ────────────────────────────────────────────

async function seedBuildersBible() {
  console.log("\n📖 Seeding The Builder's Bible...")

  const buffer = fs.readFileSync(PDF_PATH)
  const parsed = await pdfParse(buffer)
  const rawText = parsed.text

  const chunks = chunkText(rawText, CHUNK_WORDS, CHUNK_OVERLAP_WORDS)
  console.log(`  Found ${chunks.length} chunks from PDF`)

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    for (let j = 0; j < batch.length; j++) {
      const content = batch[j]
      const embedding = await embed(content)
      await upsertChunk({
        content,
        source: 'builders-bible',
        metadata: { chunk_index: i + j, total_chunks: chunks.length },
        embedding,
      })
      console.log(`  ✓ chunk ${i + j + 1}/${chunks.length}`)
      await sleep(400)
    }
  }

  console.log(`✅ Builder's Bible: ${chunks.length} chunks seeded.`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting RAG seed...')
  console.log('   Clearing existing chunks...')

  const { error } = await supabase
    .from('document_chunks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all

  if (error) {
    console.error('Failed to clear table:', error.message)
    process.exit(1)
  }

  await seedArchetypeContent()
  await seedBuildersBible()

  console.log('\n🎉 All done! RAG content is ready.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
