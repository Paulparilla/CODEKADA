"use client";

import { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  Trophy,
  Zap,
  Loader2,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";
import { submitQuizAttempt } from "@/lib/actions/quiz.actions";
import Swal from "sweetalert2";

interface Question {
  id: string;
  content: string;
  type: "MCQ" | "FILL_IN_BLANKS" | "ESSAY";
  options: any; // string[]
  correctAnswer: string;
  explanation?: string;
}

interface QuizPlayerProps {
  quiz: {
    id: string;
    title: string;
    questions: Question[];
  };
  userId: string;
  onClose: () => void;
}

export default function QuizPlayer({ quiz, userId, onClose }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentIdx];
  const isLast = currentIdx === quiz.questions.length - 1;

  const handleNext = () => {
    if (isLast) {
      calculateAndSubmit();
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const calculateAndSubmit = async () => {
    setIsSubmitting(true);
    let finalScore = 0;

    quiz.questions.forEach(q => {
      if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        finalScore++;
      }
    });

    setScore(finalScore);
    const res = await submitQuizAttempt({
      userId,
      quizId: quiz.id,
      score: finalScore,
      totalQuestions: quiz.questions.length
    });

    if (res.success) {
      setShowResults(true);
      Swal.fire({
        title: "Quiz Completed!",
        text: `You earned ${res.xpEarned} XP!`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4 md:p-8">
        <div className="premium-card w-full max-w-3xl overflow-hidden flex flex-col h-full max-h-[800px]">
          
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-secondary text-white">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">{quiz.title}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Question {currentIdx + 1} of {quiz.questions.length}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X size={20} />
            </button>
          </div>

          {!showResults ? (
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
                  className="h-full bg-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>

              {/* Question Content */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold leading-tight">{currentQuestion.content}</h2>
                
                {currentQuestion.type === "MCQ" ? (
                  <div className="grid gap-3">
                    {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option })}
                        className={`p-5 rounded-2xl border-2 text-left transition-all font-bold ${
                          answers[currentQuestion.id] === option 
                            ? "bg-secondary/10 border-secondary text-secondary" 
                            : "bg-muted/30 border-transparent hover:border-border"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                    className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-secondary rounded-2xl px-6 py-5 text-lg font-bold outline-none transition-all"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full" />
                <div className="relative p-8 rounded-full bg-secondary text-white">
                  <Trophy size={64} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight">Great Effort!</h2>
                <p className="text-xl text-muted-foreground font-medium">
                  You scored <span className="text-foreground font-bold">{score}</span> out of {quiz.questions.length}
                </p>
              </div>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-yellow-500/10 text-yellow-600 font-black uppercase tracking-widest text-sm">
                <Zap size={20} />
                +{Math.round((score / quiz.questions.length) * 250)} XP Earned
              </div>
              <button
                onClick={onClose}
                className="btn-primary h-14 px-12"
              >
                Close Results
              </button>
            </div>
          )}

          {/* Footer Controls */}
          {!showResults && (
            <div className="p-6 border-t border-border flex items-center justify-between bg-muted/30">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-muted disabled:opacity-30 font-black text-xs uppercase tracking-widest transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              
              <button
                disabled={!answers[currentQuestion.id] || isSubmitting}
                onClick={handleNext}
                className="btn-primary px-8 h-12 flex items-center gap-2 shadow-blue-500/20"
              >
                {isLast ? (
                  isSubmitting ? <Loader2 className="animate-spin" /> : "Finish Quiz"
                ) : (
                  <>Next <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
