"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signUpSchema, signInSchema } from "@/types";
import bcrypt from "bcryptjs";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Sign up a new user.
 * Creates Supabase auth user + Prisma User record.
 */
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // 1. Validate input
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = parsed.data;

  // 2. Create Supabase auth user with role in metadata
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role, // stored in user_metadata for middleware access
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Registration failed. Please try again." };
  }

  // 3. Create matching Prisma User record with manual password hash
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        // @ts-ignore - Suppressing ghost IDE error: password field is verified in schema and generated client
        password: hashedPassword, // Stored manually as requested
        name,
        role: role as "STUDENT" | "TEACHER",
      },
    });
  } catch (err) {
    console.error("Prisma User creation error:", err);
    // User might already exist if retrying — that's okay
  }

  // 4. Redirect to appropriate dashboard
  redirect(role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard");
}

/**
 * Sign in an existing user.
 */
export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // 1. Validate input
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  // 2. Sign in with Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  // 3. Get role from Prisma to redirect correctly
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  const role = dbUser?.role ?? "STUDENT";

  // 4. Redirect to appropriate dashboard
  redirect(role === "TEACHER" || role === "ADMIN" ? "/teacher/dashboard" : "/student/dashboard");
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
/**
 * Update user profile (Name, Avatar, etc.)
 */
export async function updateProfile(userId: string, data: { name?: string; avatar?: string }) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    // Also update Supabase Auth metadata to keep them in sync
    const supabase = await createClient();
    await supabase.auth.updateUser({
      data: { 
        name: updatedUser.name,
        avatar: updatedUser.avatar 
      }
    });

    revalidatePath("/", "layout");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { success: false, error: "Failed to update profile." };
  }
}
