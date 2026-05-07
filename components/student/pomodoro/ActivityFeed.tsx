"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "REWARD" | "PENALTY";
  title: string;
  value: number;
  date: Date;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="premium-card !p-8 text-center space-y-2 opacity-50">
        <div className="text-2xl mb-2">📜</div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="premium-card !p-6 space-y-6">
      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-3">
        Activity Log
      </h4>

      <div className="space-y-5">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                item.type === "REWARD" 
                  ? "bg-green-500/10 text-green-600" 
                  : "bg-destructive/10 text-destructive"
              }`}>
                {item.type === "REWARD" ? <Gift size={16} /> : <AlertTriangle size={16} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-black text-foreground">{item.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    item.type === "REWARD"
                      ? "bg-green-500 text-white"
                      : "bg-destructive text-white"
                  }`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-tighter">
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className={`text-xs font-black flex items-center gap-1 ${
              item.type === "REWARD" ? "text-green-600" : "text-destructive"
            }`}>
              {item.type === "REWARD" ? "+" : "-"}
              {item.value} XP
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
