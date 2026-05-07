import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClassDetails } from "@/lib/actions/class.actions";
import TeacherClassroomView from "@/components/teacher/classroom/TeacherClassroomView";
import { 
  ChevronRight,
  Target,
  Users
} from "lucide-react";
import Link from "next/link";

export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const classData = await getClassDetails(id);

  if (!classData) {
    notFound();
  }

  // Ensure only the teacher of this class can view it
  if (classData.teacherId !== authUser.id) {
    redirect("/teacher/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Top Navigation & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <Link href="/teacher/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight size={10} />
          <Link href="/teacher/classes" className="hover:text-primary transition-colors">Classes</Link>
          <ChevronRight size={10} />
          <span className="text-primary">{classData.name}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/20">
            Join Code: <span className="text-foreground tracking-[0.2em] ml-2">{classData.code}</span>
          </div>
        </div>
      </div>

      {/* Classroom Header Card */}
      <div className="premium-card relative overflow-hidden !p-8 bg-gradient-to-br from-card to-secondary/5 border-secondary/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-primary">{classData.name}</h1>
            <p className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {classData.description || "A dedicated space for focused learning and academic excellence."}
            </p>
          </div>

          <div className="flex items-center gap-8 px-8 md:border-l border-border/50">
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Students</p>
              <p className="text-3xl font-black text-foreground">{classData._count?.members || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">XP Ceiling</p>
              <p className="text-3xl font-black text-secondary">Unlimited</p>
            </div>
          </div>
        </div>
      </div>

      <TeacherClassroomView classData={classData} userId={authUser.id} />
    </div>
  );
}
