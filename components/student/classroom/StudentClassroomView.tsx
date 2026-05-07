"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  LayoutGrid, 
  Users, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import ClassWall from "@/components/teacher/classroom/ClassWall";
import ClassRoster from "@/components/teacher/classroom/ClassRoster";
import StudentClassTools from "@/components/student/classroom/StudentClassTools";
import QuizPlayer from "@/components/student/classroom/QuizPlayer";
import { motion, AnimatePresence } from "framer-motion";

interface StudentClassroomViewProps {
  classData: any;
  userId: string;
}

export default function StudentClassroomView({ classData, userId }: StudentClassroomViewProps) {
  const [activeTab, setActiveTab] = useState<"feed" | "resources" | "roster">("feed");
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  const tabs = [
    { id: "feed", label: "Wall", icon: MessageSquare },
    { id: "resources", label: "Modules", icon: LayoutGrid },
    { id: "roster", label: "Classmates", icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex items-center gap-2 p-1 bg-muted/50 rounded-2xl border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop & Mobile Responsive Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Resources (Hidden on mobile unless active) */}
        <div className={`${activeTab === "resources" ? "block" : "hidden"} lg:block lg:col-span-3`}>
          <StudentClassTools 
            assignments={classData.assignments} 
            documents={classData.documents} 
            quizzes={classData.quizzes}
            userId={userId}
          />
        </div>

        {/* Middle: The Wall (Hidden on mobile unless active) */}
        <div className={`${activeTab === "feed" ? "block" : "hidden"} lg:block lg:col-span-6`}>
          <ClassWall 
            classId={classData.id} 
            teacherId={classData.teacherId} 
            announcements={classData.announcements} 
            isTeacher={false}
            onQuizClick={(quizId) => {
              const quiz = classData.quizzes.find((q: any) => q.id === quizId);
              if (quiz) setActiveQuiz(quiz);
            }}
            userId={userId}
          />
        </div>

        {/* Right Sidebar: Members (Hidden on mobile unless active) */}
        <div className={`${activeTab === "roster" ? "block" : "hidden"} lg:block lg:col-span-3`}>
          <ClassRoster 
            classId={classData.id} 
            members={classData.members} 
            teacherId={classData.teacherId}
            isTeacher={false}
          />
        </div>

      </div>

      {activeQuiz && (
        <QuizPlayer 
          quiz={activeQuiz} 
          userId={userId} 
          onClose={() => setActiveQuiz(null)} 
        />
      )}
    </div>
  );
}
