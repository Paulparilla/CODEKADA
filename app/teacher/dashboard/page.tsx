import { signOut } from "@/lib/actions/auth.actions";

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor your students&apos; progress
          </p>
        </div>
        <form action={signOut}>
          <button
            id="teacher-signout"
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
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-semibold text-foreground">Classes</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="font-semibold text-foreground">Student Monitoring</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="font-semibold text-foreground">Rewards</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
