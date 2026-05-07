"use client";

import { useState } from "react";
import { postAnnouncement } from "@/lib/actions/class.actions";
import { 
  Send, 
  User, 
  Clock, 
  MessageSquare, 
  Brain, 
  Zap, 
  ChevronRight, 
  ThumbsUp, 
  CheckSquare, 
  FileUp,
  Smile,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addComment, toggleReaction } from "@/lib/actions/social.actions";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface ClassWallProps {
  classId: string;
  teacherId: string;
  announcements: any[];
  isTeacher?: boolean;
  onQuizClick?: (quizId: string) => void;
  onViewResults?: (quizId: string) => void;
  userId: string;
}

export default function ClassWall({ 
  classId, 
  teacherId, 
  announcements, 
  isTeacher = true, 
  onQuizClick,
  onViewResults,
  userId
}: ClassWallProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    const result = await postAnnouncement(classId, teacherId, content);
    if (result.success) {
      setContent("");
      router.refresh();
    }
    setIsPosting(false);
  };

  const handleAddComment = async (announcementId: string) => {
    if (!commentContent.trim() || isSocialLoading) return;
    
    setIsSocialLoading(`comment-${announcementId}`);
    const res = await addComment(announcementId, userId, commentContent, classId);
    if (res.success) {
      setCommentContent("");
      setActiveCommentBox(null);
      router.refresh();
    }
    setIsSocialLoading(null);
  };

  const handleToggleReaction = async (announcementId: string) => {
    if (isSocialLoading) return;
    
    setIsSocialLoading(`react-${announcementId}`);
    await toggleReaction(announcementId, userId, "👍", classId);
    router.refresh();
    setIsSocialLoading(null);
  };

  return (
    <div className="space-y-8">
      {/* Post Box */}
      {isTeacher && (
        <div className="premium-card !p-6 shadow-xl border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
          <form onSubmit={handlePost} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start a conversation with your class..."
              className="w-full bg-background/50 border-transparent focus:bg-background focus:border-secondary/30 rounded-2xl p-4 text-sm font-medium resize-none min-h-[120px] transition-all outline-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
                All students will see this post.
              </p>
              <button
                type="submit"
                disabled={!content.trim() || isPosting}
                className="btn-secondary flex items-center gap-2 h-10 px-6 disabled:opacity-50"
              >
                <Send size={14} />
                <span>{isPosting ? "Posting..." : "Post"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {announcements.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-40">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-sm font-black uppercase tracking-widest">No conversations yet.</p>
            </motion.div>
          ) : (
            announcements.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card overflow-hidden !p-0 hover:shadow-lg transition-all"
              >
                <div className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {post.author.avatar ? <img src={post.author.avatar} className="w-full h-full object-cover" /> : <User size={24} />}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-foreground">{post.author.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          <Clock size={10} />
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {post.content}
                    </p>

                    {/* Rich Activity Rendering */}
                    {post.type === "QUIZ" && (
                      <div className={`mt-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between group/quiz transition-all`}>
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-secondary text-white shadow-lg shadow-secondary/20"><Brain size={18} /></div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Active Assessment</p>
                            <p className="text-sm font-bold text-foreground">
                              {isTeacher ? "AI Quiz Published" : "Launch AI Quiz"}
                            </p>
                          </div>
                        </div>
                        
                        {isTeacher ? (
                          <button 
                            onClick={() => {
                              if (post.attachmentId) {
                                onViewResults?.(post.attachmentId);
                              } else {
                                Swal.fire({
                                  title: "Legacy Quiz Post",
                                  text: "This specific post doesn't have a linked quiz. Please create a NEW AI Quiz to see Wall Analytics!",
                                  icon: "info",
                                  confirmButtonColor: "var(--color-secondary)"
                                });
                              }
                            }}
                            className="relative z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary/80 active:scale-95 transition-all shadow-lg shadow-secondary/20 cursor-pointer"
                          >
                            <BarChart3 size={14} />
                            Review Results
                          </button>
                        ) : (
                          <div 
                            onClick={() => post.attachmentId && onQuizClick?.(post.attachmentId)}
                            className="cursor-pointer p-2 rounded-lg hover:bg-secondary/10 transition-all"
                          >
                            <ChevronRight size={18} className="text-muted-foreground group-hover/quiz:translate-x-1 transition-all" />
                          </div>
                        )}
                      </div>
                    )}

                    {post.type === "ASSIGNMENT" && (
                      <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><CheckSquare size={18} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">New Task Assigned</p>
                          <p className="text-sm font-bold text-foreground">View in Modules Sidebar</p>
                        </div>
                      </div>
                    )}

                    {post.type === "DOCUMENT" && (
                      <div className="mt-4 p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent text-white shadow-lg shadow-accent/20"><FileUp size={18} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent">Learning Resource</p>
                          <p className="text-sm font-bold text-foreground">Document Shared</p>
                        </div>
                      </div>
                    )}

                    {/* Social Bar */}
                    <div className="pt-4 border-t border-border flex items-center gap-4">
                      <button 
                        onClick={() => handleToggleReaction(post.id)}
                        disabled={isSocialLoading === `react-${post.id}`}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          post.reactions?.some((r: any) => r.userId === userId) 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        } ${isSocialLoading === `react-${post.id}` ? "opacity-50 scale-95" : "hover:scale-105 active:scale-95"}`}
                      >
                        <ThumbsUp size={12} className={isSocialLoading === `react-${post.id}` ? "animate-pulse" : ""} />
                        <span>{post.reactions?.length || 0} Likes</span>
                      </button>
                      <button 
                        onClick={() => setActiveCommentBox(activeCommentBox === post.id ? null : post.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-muted/50 text-muted-foreground hover:bg-muted transition-all ${activeCommentBox === post.id ? "ring-2 ring-primary/20" : ""}`}
                      >
                        <MessageSquare size={12} />
                        <span>{post.comments?.length || 0} Comments</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment Section */}
                <AnimatePresence>
                  {(activeCommentBox === post.id || (post.comments && post.comments.length > 0)) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="bg-muted/30 border-t border-border"
                    >
                      <div className="p-6 space-y-4">
                        {post.comments?.map((comment: any) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                              {comment.author.avatar ? <img src={comment.author.avatar} className="w-full h-full object-cover" /> : <User size={14} />}
                            </div>
                            <div className="flex-1 bg-background/50 p-3 rounded-2xl text-xs border border-border/30">
                              <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-1">{comment.author.name}</p>
                              <p className="font-medium text-foreground/80 leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                        ))}

                        {activeCommentBox === post.id && (
                          <div className="flex gap-3 pt-2">
                            <input 
                              autoFocus
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-xs outline-none focus:border-primary/30 transition-all shadow-inner"
                            />
                            <button 
                              onClick={() => handleAddComment(post.id)}
                              disabled={isSocialLoading === `comment-${post.id}`}
                              className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                              {isSocialLoading === `comment-${post.id}` ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
