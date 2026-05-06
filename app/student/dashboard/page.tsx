"use client";

import { signOut } from "@/lib/actions/auth.actions";
import { completeSession } from "@/lib/actions/session.actions";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
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
            {isActive ? "Deep Work Active" : "Forge Idle"}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-primary">
            Welcome back, <span className="text-secondary italic">{user?.name?.split(" ")[0] || "Scholar"}.</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Your level {user?.level || 1} journey continues. Ready to forge?
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end px-4 border-r border-border">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Focus XP</span>
            <span className="text-sm font-black text-primary">{user?.xp || 0} / 1,000</span>
          </div>
          <form action={signOut}>
            <button
              id="student-signout"
              type="submit"
              className="px-5 py-2.5 rounded-2xl border-2 border-primary/5 bg-white font-bold text-sm text-primary transition-all hover:bg-destructive hover:text-white hover:border-destructive shadow-sm"
            >
              Sign Out
            </button>
          </form>
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

      {/* Main Content Areas */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Focus Timer Card */}
        <div className="lg:col-span-2 premium-card !p-0 overflow-hidden relative group">
          <div className="p-8 space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-primary">Focus Forge</h3>
              <div className="flex gap-2">
                {(["WORK", "SHORT_BREAK"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      mode === m ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                    }`}
                  >
                    {m.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="aspect-video rounded-[2.5rem] bg-muted/30 border border-muted-foreground/10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
              {/* Progress Ring or Bar */}
              <div 
                className="absolute bottom-0 left-0 h-1.5 bg-secondary transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                style={{ width: `${progress}%` }}
              />

              <div className="text-8xl md:text-9xl font-black tracking-tighter text-primary animate-pulse-slow">
                {formatTime}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={toggleTimer}
                  className={`btn-primary !px-12 !py-4 text-lg ${isActive ? "bg-destructive hover:bg-destructive/90" : "bg-primary"}`}
                >
                  {isActive ? "Pause Forge" : "Ignite Focus"}
                </button>
                <button 
                  onClick={resetTimer}
                  className="p-4 rounded-2xl bg-white border-2 border-primary/5 text-primary hover:bg-muted transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-secondary/10" />
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="premium-card space-y-4">
            <h4 className="text-lg font-black text-primary">Classroom Feed</h4>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-secondary/20 transition-all cursor-pointer">
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider">Advanced Calc</p>
                  <p className="text-sm font-medium text-primary mt-1">Quiz scheduled for Friday.</p>
                </div>
              ))}
            </div>
            <button className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors text-center">
              View All Classes →
            </button>
          </div>
        </div>
      </div>

      {isSyncing && (
        <div className="fixed bottom-8 right-8 px-6 py-3 rounded-2xl bg-primary text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Forging XP...</span>
        </div>
      )}
    </div>
  );
}
