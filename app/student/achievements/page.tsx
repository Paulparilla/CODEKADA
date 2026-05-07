import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  Trophy, 
  Medal, 
  Target, 
  Zap, 
  Flame, 
  Star, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Award
} from "lucide-react";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      rewardClaims: {
        include: { reward: true }
      }
    }
  });

  if (!user) redirect("/login");

  // Mock available achievements for UI demonstration
  const achievements = [
    { 
      id: "focus-1", 
      title: "Focus Initiate", 
      description: "Complete your first 25-minute focus session.", 
      icon: Zap, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      isUnlocked: true 
    },
    { 
      id: "streak-3", 
      title: "Consistent Forger", 
      description: "Maintain a 3-day study streak.", 
      icon: Flame, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      isUnlocked: user.streak >= 3 
    },
    { 
      id: "xp-1000", 
      title: "Knowledge Seeker", 
      description: "Earn your first 1,000 XP.", 
      icon: Star, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      isUnlocked: user.xp >= 1000 
    },
    { 
      id: "long-focus", 
      title: "Deep Diver", 
      description: "Complete a 60-minute focus session.", 
      icon: Target, 
      color: "text-indigo-500", 
      bg: "bg-indigo-500/10",
      isUnlocked: false 
    },
    { 
      id: "early-bird", 
      title: "Early Bird", 
      description: "Start a focus session before 7:00 AM.", 
      icon: Sparkles, 
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10",
      isUnlocked: false 
    },
    { 
      id: "master", 
      title: "Focus Master", 
      description: "Complete 100 focus sessions.", 
      icon: Trophy, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      isUnlocked: false 
    },
  ];

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <div className="relative space-y-10">
      {/* Hero Stats */}
      <div className="premium-card relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-foreground">My Achievements</h1>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                {unlockedCount} of {achievements.length} Badges Earned
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 px-8 md:border-l border-border">
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Rank</p>
              <p className="text-2xl font-black text-primary">Iron Forger</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Completion</p>
              <p className="text-2xl font-black text-secondary">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div 
              key={achievement.id}
              className={`premium-card relative group transition-all duration-500 ${
                achievement.isUnlocked 
                  ? "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5" 
                  : "opacity-60 grayscale bg-muted/30"
              }`}
            >
              {!achievement.isUnlocked && (
                <div className="absolute top-4 right-4 text-muted-foreground">
                  <Lock size={16} />
                </div>
              )}
              {achievement.isUnlocked && (
                <div className="absolute top-4 right-4 text-secondary">
                  <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                </div>
              )}

              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className={`w-16 h-16 rounded-2xl ${achievement.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 ${achievement.color}`} />
                </div>
                <div>
                  <h3 className="font-black text-foreground tracking-tight mb-1">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[200px]">
                    {achievement.description}
                  </p>
                </div>
                
                {achievement.isUnlocked ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">
                    <Award size={12} />
                    Unlocked
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    In Progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Rewards Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black tracking-tight text-foreground border-b border-border pb-3">
          Claimed Rewards
        </h2>
        
        {user.rewardClaims.length === 0 ? (
          <div className="premium-card !p-12 text-center space-y-4 opacity-50">
            <div className="text-4xl">🎁</div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No rewards claimed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.rewardClaims.map((claim) => (
              <div key={claim.id} className="premium-card flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Medal size={24} />
                </div>
                <div>
                  <p className="font-bold text-foreground">{claim.reward.name}</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    Claimed on {new Date(claim.claimedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
