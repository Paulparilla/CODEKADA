"use client";

import { 
  FileText, 
  CheckSquare, 
  FileUp, 
  Download,
  ExternalLink,
  Brain,
  Zap,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import QuizPlayer from "./QuizPlayer";

interface StudentClassToolsProps {
  assignments: any[];
  documents: any[];
  quizzes: any[];
  userId: string;
}

export default function StudentClassTools({ assignments, documents, quizzes, userId }: StudentClassToolsProps) {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  return (
    <div className="space-y-6 sticky top-24">
      {/* AI Quizzes Card */}
      <div className="premium-card !p-6 space-y-4 border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary border-b border-secondary/10 pb-3 flex items-center justify-between">
          Active AI Quizzes
          <Brain size={12} className="animate-pulse" />
        </h3>
        <div className="space-y-3">
          {quizzes.length === 0 ? (
            <p className="text-xs text-muted-foreground font-medium italic py-4">No AI quizzes available.</p>
          ) : (
            quizzes.map((quiz) => {
              const hasCompleted = quiz.submissions?.some((s: any) => s.userId === userId);
              
              return (
                <div 
                  key={quiz.id} 
                  onClick={() => !hasCompleted && setActiveQuiz(quiz)}
                  className={`p-4 rounded-2xl border transition-all group ${
                    hasCompleted 
                      ? "bg-muted/20 border-border opacity-60 cursor-not-allowed" 
                      : "bg-secondary/5 border-secondary/10 hover:border-secondary/30 cursor-pointer shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-foreground group-hover:text-secondary transition-colors line-clamp-1">{quiz.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-0.5 rounded-full">
                          <Zap size={10} />
                          {quiz.xpReward} XP
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">
                          {quiz.questions?.length || 0} Questions
                        </span>
                      </div>
                    </div>
                    {!hasCompleted && (
                      <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                  {hasCompleted && (
                    <p className="mt-2 text-[8px] font-black text-accent uppercase tracking-widest flex items-center gap-1">
                      <CheckSquare size={10} /> Completed
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {activeQuiz && (
        <QuizPlayer 
          quiz={activeQuiz} 
          userId={userId} 
          onClose={() => setActiveQuiz(null)} 
        />
      )}
      <div className="premium-card !p-6 space-y-4 border-primary/20">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-3">
          Upcoming Tasks
        </h3>
        <div className="space-y-3">
          {assignments.length === 0 ? (
            <p className="text-xs text-muted-foreground font-medium italic py-4">No tasks assigned yet.</p>
          ) : (
            assignments.map((task) => (
              <div key={task.id} className="p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <CheckSquare size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{task.title}</p>
                    <p className="text-[9px] font-black text-secondary uppercase tracking-widest">{task.xpReward} XP</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Documents Card */}
      <div className="premium-card !p-6 space-y-4 border-accent/20">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent border-b border-accent/10 pb-3">
          Shared Resources
        </h3>
        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-xs text-muted-foreground font-medium italic py-4">No documents shared.</p>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <FileText size={14} />
                  </div>
                  <span className="text-xs font-bold text-foreground truncate max-w-[120px]">{doc.name}</span>
                </div>
                <Download size={14} className="text-muted-foreground group-hover:text-accent" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
