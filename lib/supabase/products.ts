import { createClient } from '@/lib/supabase/server'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  promo_price: number | null
  image_url: string | null
  category: string | null
  created_at: string
  space_id: string
}

export interface ProductWithSpace extends Product {
  professional_space: {
    id: string
    space_name: string
    logo: string | null
    owner: string
  }
}

export async function getProductsBySpaceIds(spaceIds: string[]): Promise<Product[]> {
  if (spaceIds.length === 0) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('space_id', spaceIds)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as Product[]
}

export async function getProductsWithSpace(limit = 20): Promise<ProductWithSpace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, professional_space!space_id(id, space_name, logo, owner)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error || !data) return []
  return data as ProductWithSpace[]
}
