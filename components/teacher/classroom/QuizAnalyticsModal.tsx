"use client";

import { 
  X, 
  Trophy, 
  Users, 
  Target, 
  TrendingUp,
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";

interface Submission {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  completedAt: Date;
  user: {
    name: string;
    avatar: string | null;
  };
}

interface QuizAnalyticsModalProps {
  quiz: {
    title: string;
    submissions: Submission[];
    questions: any[];
  };
  teacherId: string;
  onClose: () => void;
}

export default function QuizAnalyticsModal({ quiz, teacherId, onClose }: QuizAnalyticsModalProps) {
  // Filter out teacher submissions (anyone with name including "Teacher" or matching teacherId)
  const studentSubmissions = quiz.submissions.filter(s => 
    s.userId !== teacherId && 
    !s.user.name.toLowerCase().includes("teacher")
  );

  const averageScore = studentSubmissions.length > 0 
    ? (studentSubmissions.reduce((acc, s) => acc + (s.score / s.totalQuestions), 0) / studentSubmissions.length) * 100
    : 0;

  return (
    <Portal>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/60 backdrop-blur-md p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="premium-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-primary/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-border bg-gradient-to-br from-card to-primary/5 flex items-start justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                <Target size={10} />
                Analytics Dashboard
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground font-medium">Academic performance and student standings.</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/10 space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Users size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Participants</span>
                </div>
                <p className="text-3xl font-black">{studentSubmissions.length}</p>
              </div>
              <div className="p-6 rounded-[24px] bg-secondary/5 border border-secondary/10 space-y-1">
                <div className="flex items-center gap-2 text-secondary">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Avg. Score</span>
                </div>
                <p className="text-3xl font-black">{Math.round(averageScore)}%</p>
              </div>
              <div className="p-6 rounded-[24px] bg-accent/5 border border-accent/10 space-y-1">
                <div className="flex items-center gap-2 text-accent">
                  <Trophy size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Questions</span>
                </div>
                <p className="text-3xl font-black">{quiz.questions.length}</p>
              </div>
            </div>

            {/* Results Table */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Student Standings</h4>
              <div className="premium-card !p-0 overflow-hidden border-border/50">
                {studentSubmissions.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <Users size={48} className="mx-auto mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest">No student submissions yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">XP Earned</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {studentSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                {sub.user.avatar ? <img src={sub.user.avatar} className="w-full h-full object-cover" /> : <User size={14} />}
                              </div>
                              <span className="text-sm font-bold">{sub.user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-black ${sub.score / sub.totalQuestions >= 0.7 ? "text-green-500" : "text-orange-500"}`}>
                                {sub.score} / {sub.totalQuestions}
                              </span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-current opacity-20" style={{ width: `${(sub.score / sub.totalQuestions) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black text-secondary bg-secondary/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                              +{sub.xpEarned} XP
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              {new Date(sub.completedAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-border bg-muted/30">
            <button
              onClick={onClose}
              className="btn-primary w-full h-14"
            >
              Done Reviewing
            </button>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
