'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionToken } from '@/lib/utils/session'

export default function MigratePage() {
  const router = useRouter()

  useEffect(() => {
    async function migrate() {
      const sessionToken = getSessionToken()

      if (sessionToken) {
        try {
          const res = await fetch('/api/session/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken }),
          })
          const data = await res.json()
          console.log('[migrate] status:', res.status, 'body:', data)
        } catch (err) {
          console.error('[migrate] fetch error:', err)
        }
      } else {
        console.warn('[migrate] no session token in localStorage')
      }

      router.replace('/dashboard')
    }

    migrate()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b1326]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#4fdbc8] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#918fa1]">Setting up your profile…</p>
      </div>
    </main>
  )
}
