"use client";

import { useState } from "react";
import { createAssignment } from "@/lib/actions/class.actions";
import { 
  Plus, 
  X, 
  Loader2, 
  CheckSquare, 
  Target, 
  Zap, 
  AlignLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";

interface CreateAssignmentModalProps {
  classId: string;
}

export default function CreateAssignmentModal({ classId }: CreateAssignmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await createAssignment(classId, title, description, xpReward);
    
    if (result.success) {
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setXpReward(100);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 hover:to-indigo-500/10 border border-blue-500/10 hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <CheckSquare size={18} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Create Task</p>
            <p className="text-[10px] text-muted-foreground font-bold">Assign new work</p>
          </div>
        </div>
        <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </button>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-background/60 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl"
              >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/10 to-transparent" />
                
                <div className="relative p-8 md:p-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles size={10} />
                        Class Management
                      </div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight">Assign New <span className="text-blue-500 italic">Task.</span></h3>
                      <p className="text-sm text-muted-foreground font-medium max-w-sm">
                        Create an engaging activity to keep your students focused and motivated.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-3 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground transition-all active:scale-95"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                      {/* Title Input */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          <Target size={12} className="text-blue-500" />
                          Task Title
                        </div>
                        <input
                          type="text"
                          placeholder="What should this task be called?"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-blue-500/30 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                        />
                      </div>

                      {/* Description Input */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          <AlignLeft size={12} className="text-blue-500" />
                          Instructions
                        </div>
                        <textarea
                          placeholder="Provide clear steps for your students..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-blue-500/30 rounded-2xl px-5 py-4 text-sm font-medium transition-all outline-none min-h-[140px] resize-none"
                        />
                      </div>

                      {/* XP Reward Selector */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          <Zap size={12} className="text-yellow-500" />
                          Progression Reward
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { val: 50, label: "Minor" },
                            { val: 100, label: "Standard" },
                            { val: 250, label: "Major" },
                            { val: 500, label: "Epic" },
                          ].map((tier) => (
                            <button
                              key={tier.val}
                              type="button"
                              onClick={() => setXpReward(tier.val)}
                              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                xpReward === tier.val 
                                  ? "bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10 scale-105" 
                                  : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              <span className="text-xs font-black uppercase tracking-widest">{tier.label}</span>
                              <span className="text-[10px] font-bold opacity-60">{tier.val} XP</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 h-14 rounded-2xl bg-muted/50 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !title.trim()}
                        className="flex-[2] h-14 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Plus size={18} />
                            Publish Task
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
