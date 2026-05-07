import { requireAuth } from "@/lib/auth";
import PomodoroTimer from "@/components/student/pomodoro/PomodoroTimer";

export default async function TeacherPomodoroPage() {
  const user = await requireAuth(["TEACHER", "ADMIN"]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-foreground tracking-tight">Focus Module</h1>
        <p className="text-muted-foreground font-medium italic">Deep work and teaching productivity.</p>
      </div>

      <div className="premium-card !p-0 overflow-hidden min-h-[600px] flex items-center justify-center bg-gradient-to-br from-card via-card to-primary/5">
        <PomodoroTimer userId={user.id} />
      </div>
    </div>
  );
}
