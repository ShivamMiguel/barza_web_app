import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLoggedUserProfile, needsOnboarding } from "@/lib/supabase/profile";

/**
 * Handles Supabase Auth redirects:
 * - Email confirmation links
 * - OAuth provider callbacks (Google, etc.)
 *
 * Supabase redirects here with ?code=... after the auth handshake.
 *
 * After exchanging the code we inspect the profile: first-time OAuth
 * signups (and anyone who hasn't completed onboarding) get routed to
 * /onboarding regardless of the ?next param. Explicit /onboarding/*
 * destinations are always honored so mid-flow continuations work.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitiseNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/?auth=error`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/?auth=error`);
  }

  // Honor explicit onboarding paths (mid-flow email confirmations etc.)
  if (next.startsWith("/onboarding")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Otherwise, gate every other destination on onboarding completion.
  const profile = await getLoggedUserProfile();
  if (needsOnboarding(profile)) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

function sanitiseNext(raw: string | null): string {
  if (!raw) return "/community";
  if (!raw.startsWith("/")) return "/community";
  if (raw.startsWith("//")) return "/community";
  return raw;
}
