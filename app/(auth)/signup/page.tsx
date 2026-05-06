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
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Branding & Value Prop */}
      <section className="flex-1 space-y-8 text-center lg:text-left">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/50 border border-white/20 shadow-sm backdrop-blur-md animate-float">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
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
          <span className="text-sm font-bold tracking-widest uppercase text-primary/80">
            FocusForge
          </span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-primary leading-[1.1]">
            Master your <span className="text-secondary">focus</span>, 
            <br />
            Forge your <span className="text-accent italic">future.</span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground/80 leading-relaxed mx-auto lg:mx-0">
            The all-in-one productivity forge for students and educators. 
            Gamified deep work sessions, automated tracking, and classroom mastery.
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-3 gap-4">
          {[
            { label: "Deep Work", icon: "🔥", color: "bg-orange-500/10 text-orange-600" },
            { label: "Real-time", icon: "⚡", color: "bg-blue-500/10 text-blue-600" },
            { label: "Rewards", icon: "🏆", color: "bg-yellow-500/10 text-yellow-600" },
          ].map((feat) => (
            <div key={feat.label} className="p-4 rounded-3xl bg-white/30 border border-white/40 shadow-sm backdrop-blur-sm transition-transform hover:scale-105">
              <span className="text-xl mb-2 block">{feat.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">{feat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Card */}
      <section className="w-full max-w-md lg:max-w-[480px]">
        <div className="premium-card">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-primary">Get Started</h2>
            <p className="text-muted-foreground mt-2">Join the elite circle of high-performers.</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state.error && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm font-medium text-destructive animate-in shake-in duration-300">
                {state.error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Identity
              </label>
              <input type="hidden" name="role" value={selectedRole} />
              <div className="grid grid-cols-2 gap-3">
                {(["STUDENT", "TEACHER"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 border-2 ${
                      selectedRole === role
                        ? "border-secondary bg-secondary/5 ring-4 ring-secondary/5 shadow-inner"
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <span className={`text-sm font-bold ${selectedRole === role ? "text-secondary" : "text-muted-foreground"}`}>
                      {role === "STUDENT" ? "Student" : "Educator"}
                    </span>
                    {selectedRole === role && (
                      <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="input-field"
                />
                {state.fieldErrors?.name && (
                  <p className="text-[11px] font-bold text-destructive ml-3">{state.fieldErrors.name[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="input-field"
                />
                {state.fieldErrors?.email && (
                  <p className="text-[11px] font-bold text-destructive ml-3">{state.fieldErrors.email[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <input
                  name="password"
                  type="password"
                  placeholder="Secure Password"
                  required
                  className="input-field"
                />
                {state.fieldErrors?.password && (
                  <p className="text-[11px] font-bold text-destructive ml-3">{state.fieldErrors.password[0]}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full group overflow-hidden relative"
            >
              <span className={`relative z-10 flex items-center gap-2 ${pending ? "opacity-0" : "opacity-100"}`}>
                Forge Account
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              
              {pending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Already in the forge?{" "}
            <Link href="/login" className="text-secondary hover:underline underline-offset-4 decoration-2 font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
