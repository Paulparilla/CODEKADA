"use client";

import { useActionState, useState } from "react";
import { signUp, type AuthState } from "@/lib/actions/auth.actions";
import Link from "next/link";

const initialState: AuthState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TEACHER">(
    "STUDENT"
  );

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <section className="space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/80 px-4 py-2 shadow-sm backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground"
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              FocusForge
            </p>
            <p className="text-sm text-muted-foreground">Study smarter, not harder</p>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Create your account and start your focus streak.
          </h1>
          <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            A clean onboarding flow for students and teachers, designed around
            a calm cream canvas with navy structure and sky-blue accents.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
          {[
            { title: "Pomodoro", text: "Track deep work sessions", tone: "bg-secondary/10 text-secondary" },
            { title: "Levels", text: "Grow with every streak", tone: "bg-accent/10 text-accent" },
            { title: "Rewards", text: "Earn badges and XP", tone: "bg-warning/30 text-primary" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                {item.title}
              </div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">
            Create account
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose your role and start with the right dashboard.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          {state.error && (
            <div
              id="signup-error"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {state.error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Choose your role
            </label>
            <input type="hidden" name="role" value={selectedRole} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                id="role-student"
                type="button"
                onClick={() => setSelectedRole("STUDENT")}
                className={`group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  selectedRole === "STUDENT"
                    ? "border-secondary bg-secondary/10 shadow-sm"
                    : "border-border bg-background hover:border-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-primary">Student</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Track personal focus sessions and earn XP.
                    </p>
                  </div>
                  <div className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedRole === "STUDENT" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {selectedRole === "STUDENT" ? "Selected" : "Choose"}
                  </div>
                </div>
              </button>

              <button
                id="role-teacher"
                type="button"
                onClick={() => setSelectedRole("TEACHER")}
                className={`group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  selectedRole === "TEACHER"
                    ? "border-secondary bg-secondary/10 shadow-sm"
                    : "border-border bg-background hover:border-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-primary">Teacher</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Monitor classes and review student progress.
                    </p>
                  </div>
                  <div className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedRole === "TEACHER" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {selectedRole === "TEACHER" ? "Selected" : "Choose"}
                  </div>
                </div>
              </button>
            </div>
            {state.fieldErrors?.role && (
              <p className="text-xs text-destructive">{state.fieldErrors.role[0]}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Dela Cruz"
                required
                autoComplete="name"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              {state.fieldErrors?.name && (
                <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              {state.fieldErrors?.email && (
                <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              <p className="text-xs text-muted-foreground">
                Use at least 6 characters.
              </p>
              {state.fieldErrors?.password && (
                <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p>
              )}
            </div>
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-secondary hover:text-secondary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
}
