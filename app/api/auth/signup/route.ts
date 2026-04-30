import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e palavra-passe são obrigatórios." }, { status: 400 });
    }

    const headersList = await headers();
    const origin = headersList.get("origin") ?? "https://barza.app";

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      const message = error.message === "User already registered" ? "Este email já tem uma conta. Faz login." : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
