import { createClient } from '@/lib/supabase/server'

export interface ServiceWithSpace {
  id: string
  professional_space_id: string
  service_name: string
  price: number
  category: string
  is_active: boolean
  duration_minutes: number
  description?: string
  extra_fee?: number
  preco_promocional?: number
  professional_space: {
    id: string
    space_name: string
    logo?: string
    location_space?: Record<string, any>
    rate?: number
    created_at: string
  }
}

export async function getServicesWithSpace(limit = 10): Promise<ServiceWithSpace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('professional_services')
    .select('*, professional_space(id, space_name, logo, location_space, rate, created_at)')
    .eq('is_active', true)
    .limit(limit)

  if (error || !data) return []
  return data
}
