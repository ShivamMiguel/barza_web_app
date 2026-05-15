import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ services: [] })

    const { data: spaces } = await supabase
      .from('professional_space')
      .select('id')
      .eq('owner', user.id)

    const spaceIds = (spaces ?? []).map((s: { id: string }) => s.id)
    if (spaceIds.length === 0) return NextResponse.json({ services: [] })

    const { data, error } = await supabase
      .from('professional_services')
      .select('*')
      .in('professional_space_id', spaceIds)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ services: [] })
    return NextResponse.json({ services: data ?? [] })
  } catch {
    return NextResponse.json({ services: [] })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fd = await request.formData()
    const professional_space_id = (fd.get('professional_space_id') as string | null)?.trim()
    const service_name = (fd.get('service_name') as string | null)?.trim()
    const price = Number(fd.get('price'))
    const category = (fd.get('category') as string | null)?.trim()
    const duration_minutes = Number(fd.get('duration_minutes'))

    if (!professional_space_id || !service_name || !category || !price || !duration_minutes) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
    }

    // Verify ownership
    const { data: space } = await supabase
      .from('professional_space')
      .select('id')
      .eq('id', professional_space_id)
      .eq('owner', user.id)
      .single()

    if (!space) return NextResponse.json({ error: 'Espaço não encontrado' }, { status: 403 })

    const description = (fd.get('description') as string | null)?.trim() || null
    const extra_fee = fd.get('extra_fee') ? Number(fd.get('extra_fee')) : null
    const preco_promocional = fd.get('preco_promocional') ? Number(fd.get('preco_promocional')) : null
    const is_active = fd.get('is_active') !== 'false'

    let image: string | null = null
    const imageFile = fd.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop() ?? 'jpg'
      const path = `services/${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('comprovatives')
        .upload(path, imageFile, { upsert: true })
      if (!uploadError) {
        const { data: pub } = supabase.storage.from('comprovatives').getPublicUrl(path)
        image = pub.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('professional_services')
      .insert({
        professional_space_id,
        service_name,
        price,
        category,
        duration_minutes,
        description,
        extra_fee,
        preco_promocional,
        is_active,
        image,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ service: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
