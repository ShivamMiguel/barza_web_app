import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const headers: Record<string, string> = {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    }

    if (user?.id) {
      headers['x-user-id'] = user.id
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/market-insight`, {
      headers,
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch market insights' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
