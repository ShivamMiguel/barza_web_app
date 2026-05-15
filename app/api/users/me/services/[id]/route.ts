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

    // Verify ownership via joined space
    const { data: existing } = await supabase
      .from('professional_services')
      .select('id, professional_space(owner)')
      .eq('id', id)
      .single()

    const owner = (existing?.professional_space as { owner?: string } | null)?.owner
    if (!existing || owner !== user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const fd = await request.formData()
    const updates: Record<string, unknown> = {}

    const service_name = (fd.get('service_name') as string | null)?.trim()
    if (service_name) updates.service_name = service_name

    if (fd.has('price')) updates.price = Number(fd.get('price'))
    if (fd.has('duration_minutes')) updates.duration_minutes = Number(fd.get('duration_minutes'))

    const category = (fd.get('category') as string | null)?.trim()
    if (category) updates.category = category

    if (fd.has('description')) updates.description = (fd.get('description') as string).trim() || null
    if (fd.has('extra_fee')) updates.extra_fee = fd.get('extra_fee') ? Number(fd.get('extra_fee')) : null
    if (fd.has('preco_promocional')) updates.preco_promocional = fd.get('preco_promocional') ? Number(fd.get('preco_promocional')) : null
    if (fd.has('is_active')) updates.is_active = fd.get('is_active') !== 'false'

    const imageFile = fd.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop() ?? 'jpg'
      const path = `services/${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('comprovatives')
        .upload(path, imageFile, { upsert: true })
      if (!uploadError) {
        const { data: pub } = supabase.storage.from('comprovatives').getPublicUrl(path)
        updates.image = pub.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('professional_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ service: data })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: existing } = await supabase
      .from('professional_services')
      .select('id, professional_space(owner)')
      .eq('id', id)
      .single()

    const owner = (existing?.professional_space as { owner?: string } | null)?.owner
    if (!existing || owner !== user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { error } = await supabase
      .from('professional_services')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
