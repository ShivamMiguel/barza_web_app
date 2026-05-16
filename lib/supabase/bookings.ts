import { createClient } from '@/lib/supabase/server'

export interface BookingWithClient {
  id: string
  client_id: string
  professional_space_id: string
  service_id: string | null
  booking_date: string
  booking_time: string
  status: string
  description: string | null
  total_price: number
  home: boolean
  discount: number | null
  created_at: string
  profiles: { full_name: string; avatar_url: string | null } | null
  professional_services: { service_name: string } | null
}

export interface BookingWithSpace {
  id: string
  client_id: string
  professional_space_id: string
  service_id: string | null
  booking_date: string
  booking_time: string
  status: string
  description: string | null
  total_price: number
  home: boolean
  discount: number | null
  created_at: string
  professional_space: { space_name: string; logo: string | null } | null
  professional_services: { service_name: string } | null
}

export async function getBookingsBySpace(spaceId: string): Promise<BookingWithClient[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(full_name, avatar_url), professional_services(service_name)')
    .eq('professional_space_id', spaceId)
    .order('booking_date', { ascending: false })

  if (error || !data) return []
  return data as BookingWithClient[]
}

export async function getBookingsByUser(userId: string): Promise<BookingWithSpace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, professional_space(space_name, logo), professional_services(service_name)')
    .eq('client_id', userId)
    .order('booking_date', { ascending: false })

  if (error || !data) return []
  return data as BookingWithSpace[]
}
