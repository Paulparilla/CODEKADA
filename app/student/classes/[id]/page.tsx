import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClassDetails } from "@/lib/actions/class.actions";
import StudentClassroomView from "@/components/student/classroom/StudentClassroomView";
import { 
  ChevronRight,
  ShieldCheck,
  Trophy
} from "lucide-react";
import Link from "next/link";

export default async function StudentClassDetailsPage({
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

  // Ensure the student is a member of this class
  const isMember = classData.members.some(m => m.userId === authUser.id);
  if (!isMember) {
    redirect("/student/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Top Navigation & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <Link href="/student/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight size={10} />
          <Link href="/student/classes" className="hover:text-primary transition-colors">Classes</Link>
          <ChevronRight size={10} />
          <span className="text-primary">{classData.name}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Class Active
          </div>
        </div>
      </div>

      {/* Classroom Header Card */}
      <div className="premium-card relative overflow-hidden !p-8 bg-gradient-to-br from-card to-primary/5 border-primary/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Trophy size={20} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-primary">{classData.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {classData.description || "A dedicated space for focused learning and academic excellence."}
            </p>
          </div>

          <div className="flex items-center gap-8 px-8 md:border-l border-border/50">
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Teacher</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-foreground">{classData.teacher.name}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Your Status</p>
              <p className="text-xl font-black text-secondary uppercase tracking-widest">Enrolled</p>
            </div>
          </div>
        </div>
      </div>

      <StudentClassroomView classData={classData} userId={authUser.id} />
    </div>
  );
}
