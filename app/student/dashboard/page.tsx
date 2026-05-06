import { signOut } from "@/lib/actions/auth.actions";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back! Ready to focus?
          </p>
        </div>
        <form action={signOut}>
          <button
            id="student-signout"
            type="submit"
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:shadow-sm"
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* Placeholder cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-foreground">Pomodoro Timer</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-3xl mb-2">⭐</div>
          <h3 className="font-semibold text-foreground">Gamification</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-foreground">Sessions</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
