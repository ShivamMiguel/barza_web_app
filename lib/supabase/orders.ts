import { createClient } from '@/lib/supabase/server'

export interface Order {
  id: string
  product_id: string
  quantity: number
  total_price: number
  status: string
  created_at: string
  user: string
  space_id: string
}

export interface OrderWithProduct extends Order {
  products: {
    name: string
    image_url: string | null
    price: number
  } | null
  professional_space: {
    space_name: string
    logo: string | null
  } | null
}

export async function getOrdersByUser(userId: string): Promise<OrderWithProduct[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(name, image_url, price), professional_space!space_id(space_name, logo)')
    .eq('user', userId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as OrderWithProduct[]
}

export async function getOrdersBySpace(spaceId: string): Promise<OrderWithProduct[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(name, image_url, price), professional_space!space_id(space_name, logo)')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as OrderWithProduct[]
}
