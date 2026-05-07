"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/lib/actions/auth.actions";
import Link from "next/link";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="premium-card">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-pulse-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="m4.93 4.93 2.83 2.83" />
                <path d="m16.24 16.24 2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="m4.93 19.07 2.83-2.83" />
                <path d="m16.24 7.76 2.83-2.83" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Welcome Back</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Enter your credentials to access the forge.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Global Error */}
          {state.error && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm font-medium text-destructive animate-in shake-in duration-300">
              {state.error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="input-field"
              suppressHydrationWarning
            />
            {state.fieldErrors?.email && (
              <p className="text-[11px] font-bold text-destructive ml-3">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Password
              </label>
              <Link href="#" className="text-[11px] font-bold text-secondary hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="input-field"
              suppressHydrationWarning
            />
            {state.fieldErrors?.password && (
              <p className="text-[11px] font-bold text-destructive ml-3">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full group overflow-hidden relative"
            suppressHydrationWarning
          >
            <span className={`relative z-10 flex items-center gap-2 ${pending ? "opacity-0" : "opacity-100"}`}>
              Enter Forge
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>

            {pending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
          New to the forge?{" "}
          <Link
            href="/signup"
            className="text-secondary hover:underline underline-offset-4 decoration-2 font-bold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
