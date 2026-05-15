import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify ownership
    const { data: existing } = await supabase
      .from('professional_space')
      .select('id')
      .eq('id', id)
      .eq('owner', user.id)
      .single()

    if (!existing) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

    const fd = await request.formData()
    const updates: Record<string, unknown> = {}

    const space_name = (fd.get('space_name') as string | null)?.trim()
    if (space_name) updates.space_name = space_name

    if (fd.has('available')) updates.available = fd.get('available') === 'true'
    if (fd.has('phone')) updates.phone = (fd.get('phone') as string).trim() || null
    if (fd.has('time_in')) updates.time_in = (fd.get('time_in') as string) || null
    if (fd.has('time_out')) updates.time_out = (fd.get('time_out') as string) || null
    if (fd.has('beauty_services')) updates.beauty_services = (fd.get('beauty_services') as string).trim() || null

    const locationStr = fd.get('location_space') as string | null
    if (locationStr !== null) {
      try { updates.location_space = locationStr ? JSON.parse(locationStr) : null } catch { /* ignore */ }
    }

    // Logo upload
    const logoFile = fd.get('logo') as File | null
    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split('.').pop() ?? 'jpg'
      const path = `spaces/${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('logo')
        .upload(path, logoFile, { upsert: true })
      if (!uploadError) {
        const { data: pub } = supabase.storage.from('logos').getPublicUrl(path)
        updates.logo = pub.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('professional_space')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ space: data })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
