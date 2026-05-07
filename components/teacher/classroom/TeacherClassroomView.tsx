"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Settings, 
  Users, 
  Sparkles,
  ChevronRight,
  Shield
} from "lucide-react";
import ClassWall from "@/components/teacher/classroom/ClassWall";
import ClassRoster from "@/components/teacher/classroom/ClassRoster";
import ClassTools from "@/components/teacher/classroom/ClassTools";
import ShieldManagement from "@/components/teacher/classroom/ShieldManagement";
import QuizPlayer from "@/components/student/classroom/QuizPlayer";
import QuizAnalyticsModal from "@/components/teacher/classroom/QuizAnalyticsModal";
import { motion, AnimatePresence } from "framer-motion";

interface TeacherClassroomViewProps {
  classData: any;
  userId: string;
}

export default function TeacherClassroomView({ classData, userId }: TeacherClassroomViewProps) {
  const [activeTab, setActiveTab] = useState<"feed" | "tools" | "roster" | "shield">("feed");
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [analyticsQuiz, setAnalyticsQuiz] = useState<any>(null);

  const handleQuizClick = (quizId: string) => {
    const quiz = classData.quizzes.find((q: any) => q.id === quizId);
    if (quiz) setActiveQuiz(quiz);
  };

  const handleViewResults = (quizId: string) => {
    const quiz = classData.quizzes.find((q: any) => q.id === quizId);
    if (quiz) setAnalyticsQuiz(quiz);
  };

  const tabs = [
    { id: "feed", label: "Wall", icon: MessageSquare },
    { id: "tools", label: "Admin Tools", icon: Settings },
    { id: "roster", label: "Students", icon: Users },
    { id: "shield", label: "Shield", icon: Shield },
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
                ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
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
        
        {/* Left Sidebar: Tools */}
        <div className={`${activeTab === "tools" ? "block" : "hidden"} lg:block lg:col-span-3`}>
          <ClassTools 
            classId={classData.id} 
            quizzes={classData.quizzes}
            assignments={classData.assignments}
            documents={classData.documents}
            onQuizClick={handleQuizClick}
            onViewResults={handleViewResults}
          />
        </div>

        {/* Middle: The Wall */}
        <div className={`${activeTab === "feed" ? "block" : "hidden"} lg:block lg:col-span-6`}>
          <ClassWall 
            classId={classData.id} 
            teacherId={classData.teacherId} 
            announcements={classData.announcements} 
            isTeacher={true}
            onQuizClick={handleQuizClick}
            onViewResults={handleViewResults}
            userId={userId}
          />
        </div>

        {/* Right Sidebar: Members */}
        <div className={`${activeTab === "roster" ? "block" : "hidden"} lg:block lg:col-span-3`}>
          <ClassRoster 
            classId={classData.id} 
            members={classData.members} 
            teacherId={classData.teacherId}
            isTeacher={true}
          />
        </div>

        {/* Shield Management Tab Content (Full Width when active) */}
        {activeTab === "shield" && (
          <div className="lg:col-span-12">
            <ShieldManagement classId={classData.id} />
          </div>
        )}

      </div>

      {activeQuiz && (
        <QuizPlayer 
          quiz={activeQuiz} 
          userId={userId} 
          onClose={() => setActiveQuiz(null)} 
        />
      )}

      {analyticsQuiz && (
        <QuizAnalyticsModal 
          quiz={analyticsQuiz} 
          onClose={() => setAnalyticsQuiz(null)} 
        />
      )}
    </div>
  );
}
