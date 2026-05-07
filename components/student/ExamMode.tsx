"use client";

import { useState } from "react";
import { useExamMode } from "@/hooks/useExamMode";
import { Shield, AlertTriangle, Clock, Lock } from "lucide-react";
import { completeSession } from "@/lib/actions/session.actions";

interface ExamModeProps {
  userId: string;
  onComplete: () => void;
  onFail: () => void;
}

export default function ExamMode({ userId, onComplete, onFail }: ExamModeProps) {
  const [isActive, setIsActive] = useState(true);
  
  const { violations } = useExamMode({
    isActive,
    maxWarnings: 3,
    onFail: () => {
      setIsActive(false);
      onFail();
    }
  });

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Exam Header */}
      <header className="h-20 bg-sky-500 flex items-center justify-between px-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Strict Exam Mode</h2>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Integrity monitoring active</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Clock className="w-5 h-5" />
            <span className="text-2xl font-black tracking-widest">24:59</span>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${
            violations > 0 ? "bg-red-500 border-white animate-pulse" : "bg-white/10 border-white/20"
          }`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-black uppercase">Warnings: {violations} / 3</span>
          </div>
        </div>
      </header>

      {/* Exam Body */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Locked Info */}
        <div className="w-80 border-r border-border bg-muted/30 p-8 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rules</h3>
            <div className="space-y-3">
              {[
                "Do not switch tabs or windows.",
                "Avoid using external applications.",
                "Copying and pasting is disabled.",
                "Screen sharing/screenshots are tracked.",
              ].map((rule, i) => (
                <div key={i} className="flex gap-3 text-sm font-medium text-primary">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-sky-500/5 border border-sky-500/20 space-y-4">
            <div className="flex items-center gap-3 text-sky-600">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Locked Area</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              You are currently in a restricted focus environment. Actions outside this viewport will trigger violations.
            </p>
          </div>
        </div>

        {/* Content Area - Placeholder for Exam Content */}
        <div className="flex-1 p-12 bg-white flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl space-y-8 select-none">
            <div className="space-y-4">
              <span className="text-sm font-black text-sky-500 uppercase tracking-[0.3em]">Module Active</span>
              <h1 className="text-5xl font-black text-primary tracking-tighter">Your Exam is in Progress</h1>
              <p className="text-lg text-muted-foreground font-medium">
                Focus on the task at hand. Your session is being monitored for academic integrity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 rounded-3xl bg-muted/50 border border-border">
                <p className="text-3xl font-black text-primary">12</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Questions Left</p>
              </div>
              <div className="p-8 rounded-3xl bg-muted/50 border border-border">
                <p className="text-3xl font-black text-primary">85%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Focus Score</p>
              </div>
            </div>

            <button 
              onClick={onComplete}
              className="px-12 py-5 rounded-2xl bg-sky-500 text-white font-black text-lg uppercase tracking-widest shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </main>

      {/* Integrity Overlay (Visible on hover if active) */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
        Integrity Guard Active
      </div>
    </div>
  );
}
