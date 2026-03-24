import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, archetype, avatar_url')
    .eq('id', user.id)
    .single()

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
