import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fd = await request.formData()
    const space_name = (fd.get('space_name') as string | null)?.trim()
    if (!space_name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

    const phone = (fd.get('phone') as string | null)?.trim() || null
    const time_in = (fd.get('time_in') as string | null) || null
    const time_out = (fd.get('time_out') as string | null) || null
    const beauty_services = (fd.get('beauty_services') as string | null)?.trim() || null
    const isPhysical = fd.get('space') === 'true'
    const available = fd.get('available') === 'true'

    const locationSpaceStr = (fd.get('location_space') as string | null)?.trim() || null
    let location_space: Record<string, unknown> | null = null
    if (locationSpaceStr) {
      try { location_space = JSON.parse(locationSpaceStr) } catch { /* ignore */ }
    }

    let logoUrl: string | null = null
    const logoFile = fd.get('logo') as File | null
    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split('.').pop() ?? 'jpg'
      const path = `spaces/${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('logo')
        .upload(path, logoFile, { upsert: true })
      if (!uploadError) {
        const { data: pub } = supabase.storage.from('logo').getPublicUrl(path)
        logoUrl = pub.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('professional_space')
      .insert({
        space_name,
        owner: user.id,
        logo: logoUrl,
        phone,
        time_in,
        time_out,
        beauty_services,
        space: isPhysical,
        available,
        location_space,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ space: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

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
