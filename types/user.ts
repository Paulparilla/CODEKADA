import { z } from "zod";

// ─── Enums ───────────────────────────────────────────────
export const ROLES = ["STUDENT", "TEACHER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

// ─── Auth User ───────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatar: string | null;
  xp: number;
  level: number;
  streak: number;
  totalStudyTime: number;
}

// ─── Zod Schemas ─────────────────────────────────────────
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long"),
  role: z.enum(["STUDENT", "TEACHER"], {
    required_error: "Please select a role",
  }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;
