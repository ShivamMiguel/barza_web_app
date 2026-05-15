import { createClient } from '@/lib/supabase/server'

// ── professional_space table ───────────────────────────────────────────────────

export interface ProfessionalSpace {
  id: string
  created_at: string
  space_name: string
  rate: number | null
  owner: string
  update_at?: string | null
  beauty_services?: string | null
  location_space?: Record<string, unknown> | null
  phone?: string | null
  time_in?: string | null
  time_out?: string | null
  space?: boolean | null
  logo?: string | null
  available?: boolean | null
}

export interface ProfessionalService {
  id: string
  created_at?: string
  professional_space_id: string
  service_name: string
  price: number
  category: string
  is_active: boolean
  duration_minutes: number
  description?: string | null
  extra_fee?: number | null
  preco_promocional?: number | null
  image?: string | null
}

export async function getSpaceById(id: string): Promise<ProfessionalSpace | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('professional_space')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as ProfessionalSpace
}

export async function getSpacesByOwner(ownerId: string): Promise<ProfessionalSpace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('professional_space')
    .select('*')
    .eq('owner', ownerId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as ProfessionalSpace[]
}

export async function getServicesBySpaceIds(spaceIds: string[], activeOnly = false): Promise<ProfessionalService[]> {
  if (spaceIds.length === 0) return []
  const supabase = await createClient()
  let query = supabase
    .from('professional_services')
    .select('*')
    .in('professional_space_id', spaceIds)
    .order('created_at', { ascending: false })

  if (activeOnly) query = query.eq('is_active', true)

  const { data, error } = await query
  if (error || !data) return []
  return data as ProfessionalService[]
}

// ── professional_services + join ───────────────────────────────────────────────

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
  image?: string | null
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
