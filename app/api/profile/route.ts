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
    const { full_name, profession, bio, avatar_url } = body

    if (full_name !== undefined && (typeof full_name !== 'string' || full_name.trim().length === 0)) {
      return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })
    }

    const result = await updateProfile({
      full_name: full_name?.trim(),
      profession: profession?.trim(),
      bio: bio?.trim(),
      avatar_url: avatar_url?.trim(),
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
