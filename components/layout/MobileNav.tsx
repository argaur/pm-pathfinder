'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LayoutDashboard, FileText, Map, Microscope, Target, UserCircle, LogOut, Dumbbell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/report', label: 'My Report', icon: FileText },
  { href: '/roadmap', label: 'Learning Path', icon: Map },
  { href: '/practice', label: 'Practice', icon: Dumbbell },
  { href: '/deep-dive', label: 'Deep Dive', icon: Microscope },
  { href: '/interview-readiness', label: 'Interview Readiness', icon: Target },
  { href: '/profile', label: 'Profile', icon: UserCircle },
]

interface MobileNavProps {
  displayName: string
  archetype: string | null
}

export default function MobileNav({ displayName, archetype }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-[#918fa1] hover:text-[#c7c4d8] transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#131b2e] border-r border-white/[0.06] z-50 flex flex-col py-6 px-3 transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-3 mb-8">
          <div>
            <p className="text-sm font-bold font-[family-name:var(--font-space-grotesk)] text-[#c3c0ff]">
              PM Pathfinder
            </p>
            {archetype && (
              <p className="text-xs text-[#918fa1] font-mono mt-0.5 capitalize">The {archetype}</p>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="text-[#918fa1] hover:text-[#c7c4d8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-indigo-500/10 text-[#c3c0ff] border-l-2 border-indigo-400 pl-[10px]'
                    : 'text-[#918fa1] hover:text-[#c7c4d8] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-400' : ''}`} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#c7c4d8]">{displayName}</p>
            <p className="text-[10px] text-[#3d4a60] mt-0.5">PM Pathfinder · v0.1</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[#918fa1] hover:text-[#c7c4d8] transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
