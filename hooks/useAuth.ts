"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser, Role } from "@/types";
import type { User } from "@supabase/supabase-js";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.name as string) ?? null,
    role: (user.user_metadata?.role as Role) ?? "STUDENT",
    avatar: (user.user_metadata?.avatar as string) ?? null,
    xp: 0,
    level: 1,
    streak: 0,
    totalStudyTime: 0,
  };
}

/**
 * Client-side auth hook.
 * Subscribes to Supabase auth state changes.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      setUser(sbUser ? mapSupabaseUser(sbUser) : null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  }, []);

  return { user, loading, signOut };
}
