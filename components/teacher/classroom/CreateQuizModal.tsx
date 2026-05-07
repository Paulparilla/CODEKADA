"use client";

import { useState } from "react";
import { 
  Plus, 
  X, 
  Loader2, 
  FileText, 
  Target, 
  HelpCircle, 
  Clock,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  Hash,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";
import { generateAIQuiz } from "@/lib/actions/quiz.actions";

interface CreateQuizModalProps {
  classId: string;
}

export default function CreateQuizModal({ classId }: CreateQuizModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [type, setType] = useState<"MCQ" | "FILL_IN_BLANKS" | "ESSAY">("MCQ");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await generateAIQuiz({
      classId,
      topic,
      questionCount,
      type
    });
    
    if (result.success) {
      setIsOpen(false);
      setTopic("");
      setQuestionCount(5);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-secondary/10 to-indigo-500/5 hover:from-secondary/20 hover:to-indigo-500/10 border border-secondary/10 hover:border-secondary/30 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary text-white shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
            <FileText size={18} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Create AI Quiz</p>
            <p className="text-[10px] text-muted-foreground font-bold">Generated in seconds</p>
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
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-secondary/10 to-transparent" />
                
                <div className="relative p-8 md:p-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">
                        <BrainCircuit size={10} />
                        AI Quiz Engine
                      </div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight">Generate AI <span className="text-secondary italic">Quiz.</span></h3>
                      <p className="text-sm text-muted-foreground font-medium max-w-sm">
                        Specify a topic and our AI will build a complete assessment for you.
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
                      {/* Topic Input */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          <Target size={12} className="text-secondary" />
                          Topic / Subject
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. World War II Causes or Calculus Derivatives"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          required
                          className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-secondary/30 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Question Type */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            <Type size={12} className="text-secondary" />
                            Question Type
                          </div>
                          <select 
                            value={type} 
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-secondary/30 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                          >
                            <option value="MCQ">Multiple Choice</option>
                            <option value="FILL_IN_BLANKS">Fill in Blanks</option>
                            <option value="ESSAY">Essay / Open Ended</option>
                          </select>
                        </div>

                        {/* Count Input */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            <Hash size={12} className="text-secondary" />
                            Question Count
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-secondary/30 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                          />
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
                        disabled={isSubmitting || !topic.trim()}
                        className="flex-[2] h-14 rounded-2xl bg-secondary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <BrainCircuit size={18} />
                            Generate with AI
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
