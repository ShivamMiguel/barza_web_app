import { getLoggedUserProfile, updateProfile } from '@/lib/supabase/profile'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const profile = await getLoggedUserProfile()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, profession, bio, avatar_url, phone, interests, location } = body

    if (full_name !== undefined && (typeof full_name !== 'string' || full_name.trim().length === 0)) {
      return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })
    }

    if (phone !== undefined && typeof phone !== 'string') {
      return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 })
    }

    let cleanInterests: string[] | undefined
    if (interests !== undefined) {
      if (!Array.isArray(interests) || !interests.every((i) => typeof i === 'string')) {
        return NextResponse.json({ error: 'Interesses inválidos' }, { status: 400 })
      }
      cleanInterests = interests.map((i) => i.trim()).filter(Boolean)
    }

    let cleanLocation:
      | { country?: string; country_code?: string; city?: string; neighborhood?: string; street?: string; address?: string; latitude?: number; longitude?: number; dial_code?: string }
      | undefined
    if (location !== undefined) {
      if (typeof location !== 'object' || location === null || Array.isArray(location)) {
        return NextResponse.json({ error: 'Localização inválida' }, { status: 400 })
      }
      const loc = location as Record<string, unknown>
      cleanLocation = {}
      const stringFields = ['country', 'country_code', 'city', 'neighborhood', 'street', 'address', 'dial_code'] as const
      for (const key of stringFields) {
        const v = loc[key]
        if (v === undefined) continue
        if (typeof v !== 'string') {
          return NextResponse.json({ error: `Localização: campo "${key}" inválido` }, { status: 400 })
        }
        const trimmed = v.trim()
        if (trimmed) cleanLocation[key] = trimmed
      }
      for (const key of ['latitude', 'longitude'] as const) {
        const v = loc[key]
        if (v === undefined) continue
        if (typeof v !== 'number' || !isFinite(v)) {
          return NextResponse.json({ error: `Localização: campo "${key}" inválido` }, { status: 400 })
        }
        cleanLocation[key] = v
      }
    }

    const result = await updateProfile({
      full_name: full_name?.trim(),
      profession: profession?.trim(),
      bio: bio?.trim(),
      avatar_url: avatar_url?.trim(),
      phone: phone?.trim(),
      interests: cleanInterests,
      location: cleanLocation,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const updated = await getLoggedUserProfile()
    return NextResponse.json({ success: true, profile: updated })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
