import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware: refreshes Supabase session + enforces role-based route protection.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 1. Create Supabase client that can read/write cookies on the request/response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Refresh the session (IMPORTANT — do not remove)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 3. Public auth pages: redirect to dashboard if already logged in
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const role = user.user_metadata?.role ?? "STUDENT";
    const dashUrl =
      role === "TEACHER" || role === "ADMIN"
        ? "/teacher/dashboard"
        : "/student/dashboard";
    const url = request.nextUrl.clone();
    url.pathname = dashUrl;
    return NextResponse.redirect(url);
  }

  // 4. Protected student routes
  if (pathname.startsWith("/student")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const role = user.user_metadata?.role ?? "STUDENT";
    if (role !== "STUDENT") {
      const url = request.nextUrl.clone();
      url.pathname = "/teacher/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // 5. Protected teacher routes
  if (pathname.startsWith("/teacher")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const role = user.user_metadata?.role ?? "STUDENT";
    if (role !== "TEACHER" && role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/student/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (static files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
