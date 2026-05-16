import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const VALID_STATUSES = ['pending', 'accepted', 'rejected', 'completed', 'cancelled']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }

  const { status } = body
  if (!status || !VALID_STATUSES.includes(status as string)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  // Fetch the booking with space owner info to verify permission
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('client_id, professional_space_id, professional_space(owner)')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
  }

  const spaceOwner = (booking.professional_space as unknown as { owner: string } | null)?.owner
  const isSpaceOwner = spaceOwner === user.id
  const isClient = booking.client_id === user.id

  if (!isSpaceOwner && !isClient) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // Clients may only cancel their own bookings
  if (isClient && !isSpaceOwner && status !== 'rejected') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
