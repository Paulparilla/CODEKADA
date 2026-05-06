import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import type { AuthUser, Role } from "@/types";

/**
 * Get the current Supabase session (server-side).
 * Returns null if unauthenticated.
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Get session + Prisma user record with role.
 * Returns null if unauthenticated or user not found in DB.
 */
export async function getUserWithRole(): Promise<AuthUser | null> {
  const sessionUser = await getSession();
  if (!sessionUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      xp: true,
      level: true,
      streak: true,
    },
  });

  if (!dbUser) return null;

  return dbUser as AuthUser;
}

/**
 * Server-side auth guard. Redirects if unauthenticated or role mismatch.
 * Use in Server Component layouts to protect route groups.
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<AuthUser> {
  const user = await getUserWithRole();

  if (!user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard based on actual role
    const dest = user.role === "STUDENT" ? "/student/dashboard" : "/teacher/dashboard";
    redirect(dest);
  }

  return user;
}
