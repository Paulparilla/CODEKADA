import { createServerClient, createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client (for Server Components, Server Actions, Route Handlers).
 * Must be called inside a request context where cookies are available.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can fail in Server Components (read-only).
            // This is safe to ignore if middleware refreshes the session.
          }
        },
      },
    }
  );
}

/**
 * Browser-side Supabase client (for Client Components / hooks).
 */
export function createBrowserClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
