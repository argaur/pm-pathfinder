'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface TopBarProps {
  displayName: string
  avatarUrl: string | null
}

export default function TopBar({ displayName, avatarUrl }: TopBarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-sm font-bold text-indigo-400">PM Pathfinder</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-slate-400 hidden sm:block">{displayName}</span>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full border border-slate-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-xs font-medium text-indigo-400">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="text-slate-600 hover:text-slate-400 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
