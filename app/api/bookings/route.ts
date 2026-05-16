import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }

  const { service_id, professional_space_id, booking_date, booking_time, description, home, total_price } = body

  if (!service_id || !professional_space_id || !booking_date || !booking_time) {
    return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      client_id: user.id,
      service_id,
      professional_space_id,
      booking_date,
      booking_time,
      description: description || null,
      home: Boolean(home),
      total_price: Number(total_price) || 0,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
