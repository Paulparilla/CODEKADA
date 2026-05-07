"use client";

import { signOut } from "@/lib/actions/auth.actions";
import { completeSession } from "@/lib/actions/session.actions";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";
import JoinClassModal from "@/components/student/JoinClassModal";
import ExamMode from "@/components/student/ExamMode";
import { getActiveExams } from "@/lib/actions/exam.actions";
import { getStudentAnalytics } from "@/lib/actions/analytics.actions";
import { StudyTimeChart, XpPerformanceChart } from "@/components/student/AnalyticsCharts";

import { useFocusEnforcement } from "@/hooks/useFocusEnforcement";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [showExamMode, setShowExamMode] = useState(false);
  const [isStrictMode, setIsStrictMode] = useState(false);
  const [activeExams, setActiveExams] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [primaryClassId, setPrimaryClassId] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      getActiveExams(user.id).then(setActiveExams);
      getStudentAnalytics(user.id).then(setAnalytics);
      
      // Fetch primary class for Shield policy
      import("@/lib/actions/class.actions").then(({ getStudentClasses }) => {
        getStudentClasses(user.id).then(classes => {
          if (classes && classes.length > 0) {
            setPrimaryClassId(classes[0].id);
          }
        });
      });
    }
  }, [user]);
  const { 
    mode, 
    isActive, 
    formatTime, 
    progress, 
    toggleTimer, 
    resetTimer, 
    switchMode,
    timeLeft
  } = usePomodoro();

  useFocusEnforcement({
    isActive,
    isStrictMode,
    classId: primaryClassId,
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Handle session completion automatically
  useEffect(() => {
    if (timeLeft === 0 && mode === "WORK" && user) {
      handleComplete();
    }
  }, [timeLeft, mode, user]);

  const handleComplete = async () => {
    if (!user) return;
    setIsSyncing(true);
    await completeSession({
      userId: user.id,
      durationMinutes: 25,
      xpEarned: 250,
      status: "COMPLETED",
    });
    setIsSyncing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 ${isActive ? "animate-ping" : ""}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {isActive ? "Focus Session Active" : "Ready to Focus"}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-primary">
            Welcome back, <span className="text-secondary italic">{user?.name?.split(" ")[0] || "Student"}.</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Track your progress and stay productive.
          </p>
        </div>
        
        {user && (
          <div className="flex items-center gap-3">
            <JoinClassModal userId={user.id} />
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end px-4 border-l border-border">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total XP</span>
            <span className="text-sm font-black text-primary">{user?.xp?.toLocaleString() || 0}</span>
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <section className="grid gap-6 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Level", value: `Lv. ${user?.level || 1}`, color: "text-secondary", icon: "⭐" },
          { label: "Total XP", value: user?.xp?.toLocaleString() || "0", color: "text-accent", icon: "💎" },
          { label: "Streak", value: `${user?.streak || 0} Days`, color: "text-orange-500", icon: "🔥" },
          { label: "Total Time", value: `${Math.floor((user?.totalStudyTime || 0) / 60)}h`, color: "text-primary", icon: "⏳" },
        ].map((stat) => (
          <div key={stat.label} className="premium-card !p-6 flex flex-col items-center text-center group">
            <span className="text-2xl mb-2 transition-transform group-hover:scale-125 duration-300">{stat.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
            <span className={`text-xl font-black ${stat.color} mt-1`}>{stat.value}</span>
          </div>
        ))}
      </section>

      {/* Full-Width Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight">Study Consistency</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">Last 7 Days (Minutes)</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            </div>
          </div>
          <StudyTimeChart data={analytics} />
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight">Performance Growth</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">XP Progression</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="m12 14 4-4 4 4"/><path d="M3 3v18h18"/><path d="m12 14-4-4-4 4"/></svg>
            </div>
          </div>
          <XpPerformanceChart data={analytics} />
        </div>
      </div>

      {/* Lower Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Focus Timer Card */}
        <div className="lg:col-span-2 premium-card !p-0 overflow-hidden relative group">
          <div className="p-8 space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-primary">Focus Forge</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsStrictMode(!isStrictMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isStrictMode ? "bg-secondary text-white shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                  }`}
                  title={isStrictMode ? "Strict Mode Active" : "Enable Strict Mode"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isStrictMode ? "animate-pulse" : ""}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {isStrictMode ? "Strict" : "Standard"}
                </button>
                <div className="flex gap-2">
                  {(["WORK", "SHORT_BREAK"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => switchMode(m)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        mode === m ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                      }`}
                    >
                      {m === "WORK" ? "Focus" : "Rest"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="aspect-video rounded-[2.5rem] bg-muted/30 border border-muted-foreground/10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 h-1.5 bg-secondary transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                style={{ width: `${progress}%` }}
              />

              <div className="text-8xl md:text-[120px] font-black tracking-tighter text-primary select-none tabular-nums">
                {formatTime}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={toggleTimer}
                  className={`btn-primary !px-16 !py-5 text-xl shadow-2xl ${isActive ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" : "bg-primary shadow-primary/20"}`}
                >
                  {isActive ? "Pause Forge" : "Ignite Focus"}
                </button>
                {activeExams.length > 0 && (
                  <button
                    onClick={() => setShowExamMode(true)}
                    className="px-8 py-5 rounded-2xl bg-sky-500 text-white hover:bg-sky-600 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 flex items-center gap-2"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Exam Active
                  </button>
                )}
                <button 
                  onClick={resetTimer}
                  className="p-5 rounded-2xl bg-white border-2 border-primary/5 text-primary hover:bg-muted transition-all shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
              </div>

              {activeExams.length > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-3">Pending Exams</p>
                  <div className="space-y-2">
                    {activeExams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between text-xs font-bold text-primary">
                        <span>{exam.title || "Unit Test"} - {exam.class?.name}</span>
                        <span className="text-sky-500">Active Now</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-secondary/10" />
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="premium-card space-y-6 h-full">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-primary">Classroom Feed</h4>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm">📢</div>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-3xl bg-muted/30 border border-transparent hover:border-secondary/20 transition-all cursor-pointer group/item">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">Advanced Calc</p>
                  <p className="text-sm font-bold text-primary mt-1 group-hover/item:text-secondary transition-colors">Quiz scheduled for Friday.</p>
                </div>
              ))}
            </div>
            <Link 
              href="/student/classes"
              className="w-full py-4 rounded-2xl bg-muted/50 hover:bg-muted text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all block"
            >
              View All Classes →
            </Link>
          </div>
        </div>
      </div>

      {isSyncing && (
        <div className="fixed bottom-8 right-8 px-6 py-3 rounded-2xl bg-primary text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Forging XP...</span>
        </div>
      )}
      {showExamMode && user && (
        <ExamMode 
          userId={user.id} 
          onComplete={() => setShowExamMode(false)} 
          onFail={() => setShowExamMode(false)} 
        />
      )}
    </div>
  );
}
