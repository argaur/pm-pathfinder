'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, PlayCircle, BookOpen, Microscope, RefreshCw } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/report', label: 'My Report', icon: FileText },
  { href: '/roadmap/video', label: 'Video Roadmap', icon: PlayCircle },
  { href: '/roadmap/text', label: 'Text Roadmap', icon: BookOpen },
  { href: '/deep-dive', label: 'Deep Dive', icon: Microscope },
  { href: '/re-evaluate', label: 'Re-evaluate', icon: RefreshCw },
]

export default function Sidebar({ archetype }: { archetype: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-56 flex-col bg-slate-900/60 border-r border-slate-800 px-4 py-6">
      {/* Logo */}
      <div className="mb-8 px-2">
        <span className="text-sm font-bold text-indigo-400 tracking-tight">PM Pathfinder</span>
        {archetype && (
          <p className="text-xs text-slate-600 capitalize mt-0.5">The {archetype}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-indigo-950/60 text-white border border-indigo-900/60'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
