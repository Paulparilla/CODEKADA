"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getStudentClasses } from "@/lib/actions/class.actions";
import JoinClassModal from "@/components/student/JoinClassModal";
import { BookOpen, Users, ArrowRight, Loader2, Search } from "lucide-react";
import Link from "next/link";

export default function StudentClassesPage() {
  const { user, loading: authLoading } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      getStudentClasses(user.id).then((data) => {
        setClasses(data);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredClasses = classes.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
            Enrolled Classrooms
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-primary">
            My <span className="text-secondary italic">Classrooms.</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Manage your courses and interact with your instructors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12 w-64 h-12"
            />
          </div>
          {user && <JoinClassModal userId={user.id} />}
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="premium-card group hover:border-secondary/30 transition-all p-0 overflow-hidden flex flex-col">
              <div className="p-8 space-y-6 flex-1">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-2xl transition-transform group-hover:scale-110 duration-500">
                    📚
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest">
                    Active
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors line-clamp-1">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-2 min-h-[40px]">
                    {cls.description || "No description provided for this classroom."}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-primary">{cls._count.members} Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-primary">Instructor: {cls.teacher.name}</span>
                  </div>
                </div>
              </div>

              <Link 
                href={`/student/classes/${cls.id}`}
                className="w-full bg-muted/30 group-hover:bg-secondary/10 p-4 text-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-secondary transition-all flex items-center justify-center gap-2"
              >
                Enter Classroom
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-card min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-dashed">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl mb-6 opacity-50">
            🏫
          </div>
          <h4 className="text-xl font-black text-primary mb-2">No classrooms found</h4>
          <p className="text-sm text-muted-foreground font-medium max-w-xs mb-8">
            {search ? `No matches for "${search}".` : "You haven't joined any classrooms yet. Use a code to get started!"}
          </p>
          {user && <JoinClassModal userId={user.id} />}
        </div>
      )}
    </div>
  );
}
