"use client";

import { useState } from "react";
import { createClass } from "@/lib/actions/class.actions";
import { Plus, X, Loader2, BookOpen } from "lucide-react";

interface CreateClassModalProps {
  teacherId: string;
}

export default function CreateClassModal({ teacherId }: CreateClassModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [newCode, setNewCode] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus("loading");
    const result = await createClass(teacherId, name, description);

    if (result.success && result.class) {
      setStatus("success");
      setNewCode(result.class.code);
      setMessage(`Class "${name}" created successfully!`);
      // Keep it open to show the code
    } else {
      setStatus("error");
      setMessage(result.error || "Failed to create class.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const closeAndReset = () => {
    setIsOpen(false);
    setStatus("idle");
    setName("");
    setDescription("");
    setMessage("");
    setNewCode("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        New Class
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="premium-card w-full max-w-md relative animate-in zoom-in-95 duration-300">
            <button
              onClick={closeAndReset}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">Create Classroom</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Set up a new space for your students.
                </p>
              </div>

              {status === "success" ? (
                <div className="space-y-6 py-4 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Your Class Code</p>
                    <div className="text-4xl font-black text-secondary tracking-[0.2em] bg-secondary/5 py-4 rounded-2xl border-2 border-dashed border-secondary/30">
                      {newCode}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Share this code with your students to let them join.
                    </p>
                  </div>
                  <button
                    onClick={closeAndReset}
                    className="btn-primary w-full mt-4"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Advanced Mathematics"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="What will students learn?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input-field min-h-[100px] py-3 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-xs font-bold border border-destructive/20">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary w-full h-12 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Create Classroom"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
