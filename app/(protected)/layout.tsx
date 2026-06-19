import { redirect } from 'next/navigation'
import { getCachedUser, getCachedProfile } from '@/lib/supabase/cached'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCachedUser()

  if (!user) {
    redirect('/auth')
  }

  const profile = await getCachedProfile(user.id)

  return (
    <div className="flex h-screen bg-[#0b1326] overflow-hidden">
      <Sidebar archetype={profile?.archetype ?? null} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          displayName={profile?.display_name ?? user.email ?? 'User'}
          avatarUrl={profile?.avatar_url ?? null}
          archetype={profile?.archetype ?? null}
        />
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
