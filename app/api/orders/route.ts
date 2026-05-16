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

  const { product_id, quantity, space_id } = body

  if (!product_id || typeof product_id !== 'string') {
    return NextResponse.json({ error: 'product_id obrigatório' }, { status: 400 })
  }
  if (!space_id || typeof space_id !== 'string') {
    return NextResponse.json({ error: 'space_id obrigatório' }, { status: 400 })
  }
  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
    return NextResponse.json({ error: 'Quantidade inválida' }, { status: 400 })
  }

  // Fetch product to get current price
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('price, promo_price, space_id')
    .eq('id', product_id)
    .single()

  if (productError || !product) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }

  if (product.space_id !== space_id) {
    return NextResponse.json({ error: 'Espaço inválido' }, { status: 400 })
  }

  const unitPrice =
    product.promo_price != null && product.promo_price < product.price
      ? product.promo_price
      : product.price

  const total_price = unitPrice * qty

  const { data, error } = await supabase
    .from('orders')
    .insert({
      product_id,
      quantity: qty,
      total_price,
      status: 'pendente',
      user: user.id,
      space_id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
