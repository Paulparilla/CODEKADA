"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

import { completeTask } from "@/lib/actions/task.actions";
import Swal from "sweetalert2";

interface Task {
  id: string;
  title: string;
  time: string;
  duration: number;
  class?: string;
  isCompleted?: boolean;
}

interface TaskSidebarProps {
  tasks: Task[];
  userId: string;
}

export default function TaskSidebar({ tasks, userId }: TaskSidebarProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleMarkAsDone = async (scheduleId: string) => {
    setLoadingId(scheduleId);
    const result = await completeTask(userId, scheduleId);
    setLoadingId(null);

    if (result.success) {
      Swal.fire({
        title: "Task Completed!",
        text: `You earned ${result.xpEarned} XP!`,
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        background: "var(--color-card)",
        color: "var(--color-primary)"
      });
    }
  };

  return (
    <div className="premium-card !p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Upcoming Tasks
        </h4>
        <Link 
          href="/student/classes" 
          className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"
        >
          View All <ExternalLink size={10} />
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-muted-foreground italic">No tasks scheduled for today.</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {task.isCompleted ? (
                      <CheckCircle2 size={16} className="text-secondary" />
                    ) : (
                      <Circle size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm font-bold transition-colors ${
                      task.isCompleted ? "text-muted-foreground line-through" : "text-foreground group-hover:text-primary"
                    }`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {task.time}
                      </span>
                      {task.class && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          {task.class}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!task.isCompleted && (
                  <button
                    onClick={() => handleMarkAsDone(task.id)}
                    disabled={loadingId === task.id}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    {loadingId === task.id ? "..." : "Done"}
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
