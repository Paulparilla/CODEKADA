"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";

interface XPProgressBarProps {
  currentXp: number;
  level: number;
}

export default function XPProgressBar({ currentXp, level }: XPProgressBarProps) {
  // Simple leveling: 1000 XP per level
  const xpInCurrentLevel = currentXp % 1000;
  const progress = (xpInCurrentLevel / 1000) * 100;
  const xpToNextLevel = 1000 - xpInCurrentLevel;

  return (
    <div className="premium-card !p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <Star size={16} fill="currentColor" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-foreground">Level {level}</span>
        </div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {xpToNextLevel} XP to Lv.{level + 1}
        </span>
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-secondary to-blue-400 relative"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
          </motion.div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <span>{xpInCurrentLevel} XP</span>
          <span>1000 XP</span>
        </div>
      </div>
    </div>
  );
}
