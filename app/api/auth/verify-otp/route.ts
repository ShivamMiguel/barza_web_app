import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email e código são obrigatórios.' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: 'O código deve ter 6 dígitos.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })

    if (error) {
      return NextResponse.json(
        { error: 'Código inválido ou expirado. Solicita um novo.' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
