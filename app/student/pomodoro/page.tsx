import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PomodoroTimer from "@/components/student/pomodoro/PomodoroTimer";
import XPProgressBar from "@/components/student/pomodoro/XPProgressBar";
import ActivityFeed from "@/components/student/pomodoro/ActivityFeed";
import TaskSidebar from "@/components/student/pomodoro/TaskSidebar";
import { Brain, Flame, Info, Sparkles, Trophy } from "lucide-react";

export default async function PomodoroPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Fetch full user data and related records
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      penalties: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      rewardClaims: {
        include: { reward: true },
        orderBy: { claimedAt: "desc" },
        take: 3,
      },
      schedules: {
        where: {
          startTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today onwards
          }
        },
        include: { 
          class: true,
          sessions: {
            where: { status: "COMPLETED" },
            take: 1
          }
        },
        orderBy: { startTime: "asc" },
        take: 5,
      }
    }
  });

  if (!user) redirect("/login");

  // Format activity feed items
  const activityItems = [
    ...user.rewardClaims.map(rc => ({
      id: rc.id,
      type: "REWARD" as const,
      title: rc.reward.name,
      value: rc.reward.cost, // or some other XP value
      date: rc.claimedAt,
    })),
    ...user.penalties.map(p => ({
      id: p.id,
      type: "PENALTY" as const,
      title: p.reason,
      value: p.xpLost,
      date: p.createdAt,
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  // Format tasks
  const tasks = user.schedules.map(s => ({
    id: s.id,
    title: s.title || (s.isExamMode ? "Exam Session" : "Study Session"),
    time: new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: s.duration,
    class: s.class?.name,
    isCompleted: s.sessions.length > 0,
  }));

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content (8/12) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
                <Brain size={14} />
                Focus Mode
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
                Deep Work <span className="text-primary italic">Timer</span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
                Stay focused, earn rewards, and level up your skills.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Flame size={20} fill="currentColor" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Current Streak</div>
                <div className="text-lg font-black text-foreground">{user.streak} Days</div>
              </div>
            </div>
          </div>

          {/* Main Timer Module */}
          <div className="py-4">
            <PomodoroTimer userId={user.id} />
          </div>
        </div>

        {/* Sidebar (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <XPProgressBar currentXp={user.xp} level={user.level} />
          
          <TaskSidebar tasks={tasks} userId={user.id} />
          
          {/* Tips / Info (Moved to Sidebar) */}
          <div className="space-y-4">
            {[
              { icon: Sparkles, title: "Efficiency", text: "25min focus is the sweet spot for peak performance.", color: "text-primary" },
              { icon: Brain, title: "Memory", text: "Short breaks help solidify new information.", color: "text-secondary" },
              { icon: Trophy, title: "Rewards", text: "Complete sessions to unlock exclusive items.", color: "text-orange-500" },
            ].map((tip, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-all">
                <tip.icon size={18} className={`${tip.color} mb-3`} />
                <h4 className="text-xs font-bold text-foreground mb-1">{tip.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>

          <ActivityFeed items={activityItems} />
        </div>

      </div>
    </div>
  );
}
