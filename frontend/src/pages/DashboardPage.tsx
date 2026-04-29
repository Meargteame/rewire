import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useChallenge } from "../hooks/useChallenge";
import ChallengeCard from "../components/ChallengeCard";
import { Flame, Trophy, Target, Calendar, ChevronRight, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AnimatedCard from "../components/premium/AnimatedCard";
import ProgressRing from "../components/premium/ProgressRing";
import StreakFlame from "../components/premium/StreakFlame";
import ConfettiCelebration from "../components/premium/ConfettiCelebration";
import SkeletonLoader from "../components/premium/SkeletonLoader";
import { showToast } from "../components/premium/PremiumToast";

interface ChallengeHistoryItem {
  id: string;
  challengeTitle: string;
  category: string;
  completedAt: string;
  durationSeconds: number;
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const { challenge, loading, refresh } = useChallenge();
  const [completedToday, setCompletedToday] = useState(0);
  const [completedThisWeek, setCompletedThisWeek] = useState(0);
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history", { credentials: "include" });
      const data = await res.json();
      
      if (data.success) {
        const history: ChallengeHistoryItem[] = data.history;
        const today = new Date().toISOString().split("T")[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        
        // Count today's completions
        const todayCount = history.filter(h => 
          h.completedAt.split("T")[0] === today
        ).length;
        setCompletedToday(todayCount);
        
        // Count this week's completions
        const weekCount = history.filter(h => {
          const date = h.completedAt.split("T")[0];
          return date >= weekAgo && date <= today;
        }).length;
        setCompletedThisWeek(weekCount);
        
        // Build activity calendar dates
        const dates = new Set(history.map(h => h.completedAt.split("T")[0]));
        setActivityDates(dates);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      showToast.error("Failed to load your progress");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeComplete = (challengeTitle: string) => {
    const newTodayCount = completedToday + 1;
    setCompletedToday(newTodayCount);
    setCompletedThisWeek((w: number) => w + 1);
    
    // Show celebration based on milestones
    if (user) {
      const newStreak = user.currentStreak + 1;
      
      if (newStreak === 7) {
        setCelebrationMessage("Amazing! You've built a 7-day habit!");
        setShowCelebration(true);
        showToast.streak(7);
      } else if (newStreak === 30) {
        setCelebrationMessage("Incredible! 30 days of consistency!");
        setShowCelebration(true);
        showToast.streak(30);
      } else if (newStreak % 10 === 0) {
        setCelebrationMessage(`Fantastic! ${newStreak} day milestone reached!`);
        setShowCelebration(true);
        showToast.streak(newStreak);
      } else {
        showToast.challenge(challengeTitle);
      }
    }
    
    refreshUser();
    fetchHistory();
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-brand-bg">
        <Sidebar />
        <main className="page-shell-main">
          <SkeletonLoader variant="dashboard" />
        </main>
      </div>
    );
  }

  const streakPercentage = Math.min((user.currentStreak / 30) * 100, 100);
  const dailyGoal = 3;
  const dailyProgress = Math.min((completedToday / dailyGoal) * 100, 100);

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      
      <main className="page-shell-main">
        {/* Header */}
        <motion.div 
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2 text-brand-text">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-brand-muted text-base md:text-lg">
            {user.currentStreak > 0 
              ? `You're on fire! ${user.currentStreak} day streak 🔥`
              : "Start your first challenge today!"}
          </p>
        </motion.div>

        {/* Stats grid: stretch so cards share height; streak hero uses row layout on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 items-stretch gap-3 md:gap-6 mb-6 md:mb-8">
          <AnimatedCard
            className="col-span-2 bg-brand-accent p-4 md:p-6 text-white shadow-accent relative overflow-hidden min-h-[11rem] md:min-h-[12rem] flex rounded-card"
            delay={0.1}
          >
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
            <div className="relative z-10 flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2 md:mb-2">
                  <StreakFlame streak={user.currentStreak} size="md" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/90 md:text-sm">
                    Current Streak
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <span className="text-4xl font-bold tabular-nums leading-none md:text-6xl">{user.currentStreak}</span>
                  <span className="text-lg text-white/85 md:text-2xl">days</span>
                </div>
                <p className="mt-2 max-w-sm text-xs leading-snug text-white/80">
                  {user.currentStreak >= 30
                    ? "You have hit the 30-day milestone. Keep the rhythm going."
                    : `${Math.max(0, 30 - user.currentStreak)} days to your 30-day milestone.`}
                </p>
              </div>
              <div className="shrink-0 self-start md:self-center">
                <ProgressRing
                  progress={streakPercentage}
                  size={72}
                  strokeWidth={5}
                  color="rgba(255,255,255,0.95)"
                  backgroundColor="rgba(255,255,255,0.22)"
                  showPercentage={false}
                  glow
                />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="flex h-full min-h-[10.5rem] flex-col justify-between bg-white p-4 md:p-5 shadow-lg" delay={0.2}>
            <div className="w-full">
              <div className="mb-3 flex w-full items-center justify-between gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 md:h-10 md:w-10">
                  <Target className="h-4 w-4 text-emerald-600 md:h-5 md:w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold tabular-nums text-brand-text md:text-3xl">{user.totalChallenges}</p>
            </div>
            <p className="text-xs text-brand-muted md:text-sm">Total completed</p>
          </AnimatedCard>

          <AnimatedCard className="flex h-full min-h-[10.5rem] flex-col justify-between bg-white p-4 md:p-5 shadow-lg" delay={0.3}>
            <div className="w-full">
              <div className="mb-3 flex w-full items-center justify-between gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 md:h-10 md:w-10">
                  <Trophy className="h-4 w-4 text-amber-600 md:h-5 md:w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold tabular-nums text-brand-text md:text-3xl">{user.longestStreak}</p>
            </div>
            <p className="text-xs text-brand-muted md:text-sm">Personal best (days)</p>
          </AnimatedCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Card - Primary Focus */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold gradient-text">Today's Challenge</h2>
                {completedToday > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">{completedToday} completed today!</span>
                  </motion.div>
                )}
              </div>
              
              <ChallengeCard
                challenge={challenge}
                loading={loading}
                onRefresh={refresh}
                onComplete={handleChallengeComplete}
              />

              {/* Quick Stats */}
              <motion.div 
                className="mt-6 grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <AnimatedCard className="bg-white p-4 shadow-md" delay={0.7}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brand-muted">Daily Goal</span>
                    <span className="text-sm font-bold">{completedToday}/{dailyGoal}</span>
                  </div>
                  <ProgressRing 
                    progress={dailyProgress} 
                    size={40} 
                    strokeWidth={4}
                    showPercentage={false}
                  />
                </AnimatedCard>

                <AnimatedCard className="bg-white p-4 shadow-md" delay={0.8}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brand-muted">This Week</span>
                    <span className="text-sm font-bold">{completedThisWeek}/21</span>
                  </div>
                  <ProgressRing 
                    progress={Math.min((completedThisWeek / 21) * 100, 100)} 
                    size={40} 
                    strokeWidth={4}
                    color="#3b82f6"
                    showPercentage={false}
                  />
                </AnimatedCard>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Streak Calendar */}
            <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.9}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold gradient-text">Activity</h3>
                <Calendar className="w-4 h-4 text-brand-muted" />
              </div>
              
              {/* Mini Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (27 - i));
                  const dateStr = date.toISOString().split("T")[0];
                  const isActive = activityDates.has(dateStr);
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.02 }}
                      whileHover={{ scale: 1.2 }}
                      className={`aspect-square rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-br from-orange-400 to-red-500 shadow-md"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      title={dateStr}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-brand-muted mt-3">Last 4 weeks</p>
            </AnimatedCard>

            {/* Achievements */}
            <AnimatedCard className="bg-white p-6 shadow-lg" delay={1.0}>
              <h3 className="font-semibold mb-4 gradient-text">Achievements</h3>
              <div className="space-y-3">
                {user.currentStreak >= 7 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Week Warrior</p>
                      <p className="text-xs text-brand-muted">7 day streak!</p>
                    </div>
                  </motion.div>
                )}
                
                {user.totalChallenges >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Getting Started</p>
                      <p className="text-xs text-brand-muted">10 challenges done!</p>
                    </div>
                  </motion.div>
                )}

                <motion.button 
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-lg transition-all"
                >
                  <span className="text-sm font-medium text-brand-muted">View all achievements</span>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </motion.button>
              </div>
            </AnimatedCard>
          </motion.div>
        </div>

        {/* Premium Celebration */}
        <ConfettiCelebration
          trigger={showCelebration}
          type="fireworks"
          message={celebrationMessage}
          onComplete={() => setShowCelebration(false)}
        />
      </main>
    </div>
  );
}
