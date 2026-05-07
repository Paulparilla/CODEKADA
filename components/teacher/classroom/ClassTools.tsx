"use client";
import { useState } from "react";

import { 
  FileText, 
  CheckSquare, 
  FileUp, 
  Trash2, 
  AlertCircle,
  MoreVertical,
  Brain,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { deleteClass } from "@/lib/actions/class.actions";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import CreateAssignmentModal from "./CreateAssignmentModal";
import CreateQuizModal from "./CreateQuizModal";
import UploadDocumentModal from "./UploadDocumentModal";
import QuizAnalyticsModal from "./QuizAnalyticsModal";

interface ClassToolsProps {
  classId: string;
  assignments?: any[];
  documents?: any[];
  quizzes?: any[];
  onQuizClick?: (quizId: string) => void;
}

export default function ClassTools({ classId, assignments = [], documents = [], quizzes = [], onQuizClick }: ClassToolsProps) {
  const router = useRouter();
  const [analyticsQuiz, setAnalyticsQuiz] = useState<any>(null);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Classroom?",
      text: "This action is permanent and will remove all student data for this class.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete everything",
      confirmButtonColor: "var(--color-destructive)",
      background: "var(--color-card)",
      color: "var(--color-primary)",
      customClass: {
        popup: "rounded-3xl border border-border shadow-2xl",
        confirmButton: "rounded-xl font-bold px-6 py-2",
        cancelButton: "rounded-xl font-bold px-6 py-2"
      }
    });

    if (result.isConfirmed) {
      const res = await deleteClass(classId);
      if (res.success) {
        router.push("/teacher/dashboard");
      }
    }
  };

  return (
    <div className="space-y-6 sticky top-24">
      <div className="premium-card !p-6 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-3">
          Tools & Resources
        </h3>
        <div className="space-y-3">
          <CreateAssignmentModal classId={classId} />
          <CreateQuizModal classId={classId} />
          <UploadDocumentModal classId={classId} />
        </div>
      </div>

      {/* Active Content Feed */}
      <div className="premium-card !p-6 space-y-4 border-primary/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-3">
          Active Classroom Content
        </h3>
        
        <div className="space-y-4">
          {/* Quizzes */}
          {quizzes.length > 0 && (
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">AI Quizzes</p>
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  onClick={() => onQuizClick?.(quiz.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-secondary/20 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                      <Brain size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{quiz.title}</p>
                      <p className="text-[9px] font-black text-secondary uppercase tracking-widest">{quiz.questions?.length || 0} Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnalyticsQuiz(quiz);
                      }}
                      className="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                      title="View Results"
                    >
                      <BarChart3 size={14} />
                    </button>
                    <MoreVertical size={14} className="text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assignments */}
          {assignments.length > 0 && (
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tasks</p>
              {assignments.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <CheckSquare size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{task.title}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{task.xpReward} XP</p>
                    </div>
                  </div>
                  <MoreVertical size={14} className="text-muted-foreground group-hover:text-primary" />
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Resources</p>
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-accent/20 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      <FileUp size={14} />
                    </div>
                    <span className="text-xs font-bold text-foreground truncate max-w-[140px]">{doc.name}</span>
                  </div>
                  <MoreVertical size={14} className="text-muted-foreground group-hover:text-accent" />
                </div>
              ))}
            </div>
          )}

          {quizzes.length === 0 && assignments.length === 0 && documents.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[10px] font-bold text-muted-foreground italic">No content created yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="premium-card !p-6 border-destructive/20 bg-destructive/5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive/60 border-b border-destructive/10 pb-3">
          Danger Zone
        </h3>
        <button
          onClick={handleDelete}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all group"
        >
          <div className="p-2 rounded-xl bg-destructive/20 text-destructive group-hover:bg-white/20 group-hover:text-white transition-all">
            <Trash2 size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            Delete Class
          </span>
        </button>
      </div>

      {analyticsQuiz && (
        <QuizAnalyticsModal 
          quiz={analyticsQuiz} 
          onClose={() => setAnalyticsQuiz(null)} 
        />
      )}
    </div>
  );
}
