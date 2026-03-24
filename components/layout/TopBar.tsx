'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MobileNav from './MobileNav'

interface TopBarProps {
  displayName: string
  avatarUrl: string | null
  archetype?: string | null
}

export default function TopBar({ displayName, avatarUrl, archetype = null }: TopBarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0b1326]/80 backdrop-blur-xl flex-shrink-0">
      <MobileNav displayName={displayName} archetype={archetype} />

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-[#c7c4d8] hidden sm:block">{displayName}</span>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full ring-1 ring-white/10"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-500/15 ring-1 ring-indigo-500/30 flex items-center justify-center text-xs font-medium text-[#c3c0ff]">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="text-[#918fa1] hover:text-[#c7c4d8] transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
