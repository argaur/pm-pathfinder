'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Map, Microscope, Target, UserCircle } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/report', label: 'My Report', icon: FileText },
  { href: '/roadmap', label: 'Learning Path', icon: Map },
  { href: '/deep-dive', label: 'Deep Dive', icon: Microscope },
  { href: '/interview-readiness', label: 'Interview Readiness', icon: Target },
  { href: '/profile', label: 'Profile', icon: UserCircle },
]

export default function Sidebar({ archetype }: { archetype: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-56 flex-col bg-[#131b2e] px-3 py-6 border-r border-white/[0.04]">
      {/* Logo */}
      <div className="mb-8 px-3">
        <span className="text-sm font-bold font-[family-name:var(--font-space-grotesk)] text-[#c3c0ff] tracking-tight">
          PM Pathfinder
        </span>
        {archetype && (
          <p className="text-xs text-[#918fa1] font-mono mt-1 capitalize">The {archetype}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
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

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-white/[0.04]">
        <p className="text-[10px] text-[#3d4a60]">PM Pathfinder · v0.1</p>
      </div>
    </aside>
  )
}
