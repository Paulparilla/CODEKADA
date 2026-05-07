"use client";

import { useState } from "react";
import { joinClass } from "@/lib/actions/class.actions";
import { Plus, X, Hash, Loader2 } from "lucide-react";

interface JoinClassModalProps {
  userId: string;
}

export default function JoinClassModal({ userId }: JoinClassModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus("loading");
    const result = await joinClass(userId, code);

    if (result.success) {
      setStatus("success");
      setMessage(`Successfully joined ${result.className}!`);
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setCode("");
        setMessage("");
      }, 2000);
    } else {
      setStatus("error");
      setMessage(result.error || "Failed to join class.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all font-bold text-sm"
      >
        <Plus className="w-4 h-4" />
        Join Class
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="premium-card w-full max-w-md relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">Join a Classroom</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Enter the 6-character code provided by your instructor.
                </p>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                    <Hash className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="E.G. XJ92LK"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    required
                    className="input-field pl-12 text-lg font-black tracking-widest"
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                    status === "success" 
                      ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="btn-primary w-full flex items-center justify-center gap-2 h-12"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : status === "success" ? (
                    "Joined!"
                  ) : (
                    "Join Classroom"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
