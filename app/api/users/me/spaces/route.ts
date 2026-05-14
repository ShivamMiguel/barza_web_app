import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ spaces: [], services: [] })

    const { data: spaces, error: spaceError } = await supabase
      .from('professional_space')
      .select('*')
      .eq('owner', user.id)
      .order('created_at', { ascending: false })

    if (spaceError) return NextResponse.json({ spaces: [], services: [] })

    const spaceIds = (spaces ?? []).map((s: { id: string }) => s.id)
    let services: unknown[] = []
    if (spaceIds.length > 0) {
      const { data } = await supabase
        .from('professional_services')
        .select('*')
        .in('professional_space_id', spaceIds)
        .eq('is_active', true)
      services = data ?? []
    }

    return NextResponse.json({ spaces: spaces ?? [], services })
  } catch {
    return NextResponse.json({ spaces: [], services: [] })
  }
}
