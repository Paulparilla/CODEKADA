"use client";

import { useState } from "react";
import { removeStudent } from "@/lib/actions/class.actions";
import { Users, UserMinus, ShieldAlert, MoreHorizontal, User } from "lucide-react";
import Swal from "sweetalert2";

interface ClassRosterProps {
  classId: string;
  members: any[];
  teacherId: string;
  isTeacher?: boolean;
}

export default function ClassRoster({ classId, members, teacherId, isTeacher = false }: ClassRosterProps) {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemove = async (userId: string, name: string) => {
    const result = await Swal.fire({
      title: "Remove Student?",
      text: `Are you sure you want to remove ${name} from this class?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
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
      setIsRemoving(userId);
      const res = await removeStudent(classId, userId);
      if (res.success) {
        Swal.fire({
          title: "Removed!",
          text: `${name} has been removed.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }
      setIsRemoving(null);
    }
  };

  return (
    <div className="premium-card !p-6 space-y-6 h-fit sticky top-24">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Members ({members.length})
        </h3>
        <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
          <Users size={14} />
        </div>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {members.map((member) => (
          <div key={member.user.id} className="group flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden border border-border group-hover:border-primary/30 transition-all shrink-0">
                {member.user.avatar ? (
                  <img src={member.user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                    <User size={18} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-foreground truncate">{member.user.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">Lv. {member.user.level}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">{member.user.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {isTeacher && member.user.id !== teacherId && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => handleRemove(member.user.id, member.user.name)}
                  disabled={isRemoving === member.user.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Remove Student"
                >
                  <UserMinus size={14} />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-600/10 transition-all" title="Ban Student">
                  <ShieldAlert size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full py-3 rounded-2xl bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-primary transition-all">
        Invite Link
      </button>
    </div>
  );
}
