import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useChallenge } from "../hooks/useChallenge";
import ChallengeCard from "../components/ChallengeCard";
import { Flame, Trophy, Target, Calendar, ChevronRight, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";

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
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (completedToday > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [completedToday]);

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
    }
  };

  const handleChallengeComplete = () => {
    setCompletedToday((c: number) => c + 1);
    setCompletedThisWeek((w: number) => w + 1);
    refreshUser();
    fetchHistory();
  };

  if (!user) return null;

  const streakPercentage = Math.min((user.currentStreak / 30) * 100, 100);
  const dailyGoal = 3;
  const dailyProgress = Math.min((completedToday / dailyGoal) * 100, 100);

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-serif font-bold mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-brand-muted text-base md:text-lg">
            {user.currentStreak > 0 
              ? `You're on fire! ${user.currentStreak} day streak 🔥`
              : "Start your first challenge today!"}
          </p>
        </div>

        {/* Stats Grid - Duolingo-inspired */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Current Streak - Primary */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="col-span-2 bg-gradient-to-br from-orange-500 to-brand-accent p-4 md:p-6 rounded-2xl text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Flame className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider opacity-90">
                  Current Streak
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3 md:mb-4">
                <span className="text-4xl md:text-6xl font-bold">{user.currentStreak}</span>
                <span className="text-lg md:text-2xl opacity-80">days</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${streakPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-xs mt-2 opacity-80">
                {30 - user.currentStreak} days to 30-day milestone
              </p>
            </div>
          </motion.div>

          {/* Total Challenges */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-4 md:p-6 rounded-2xl border border-brand-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{user.totalChallenges}</p>
            <p className="text-xs md:text-sm text-brand-muted">Total Completed</p>
          </motion.div>

          {/* Longest Streak */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-4 md:p-6 rounded-2xl border border-brand-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{user.longestStreak}</p>
            <p className="text-xs md:text-sm text-brand-muted">Personal Best</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Card - Primary Focus */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold">Today's Challenge</h2>
              {completedToday > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full"
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
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-brand-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-brand-muted">Daily Goal</span>
                  <span className="text-sm font-bold">{completedToday}/{dailyGoal}</span>
                </div>
                <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyProgress}%` }}
                    className="h-full bg-brand-accent rounded-full"
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-brand-muted">This Week</span>
                  <span className="text-sm font-bold">{completedThisWeek}/21</span>
                </div>
                <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((completedThisWeek / 21) * 100, 100)}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Streak Calendar */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Activity</h3>
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
                    <div
                      key={i}
                      className={`aspect-square rounded-lg transition-colors ${
                        isActive
                          ? "bg-brand-accent"
                          : "bg-brand-border"
                      }`}
                      title={dateStr}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-brand-muted mt-3">Last 4 weeks</p>
            </div>

            {/* Achievements */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <h3 className="font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                {user.currentStreak >= 7 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Week Warrior</p>
                      <p className="text-xs text-brand-muted">7 day streak!</p>
                    </div>
                  </div>
                )}
                
                {user.totalChallenges >= 10 && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Getting Started</p>
                      <p className="text-xs text-brand-muted">10 challenges done!</p>
                    </div>
                  </div>
                )}

                <button className="w-full flex items-center justify-between p-3 hover:bg-brand-bg rounded-lg transition-colors">
                  <span className="text-sm font-medium text-brand-muted">View all achievements</span>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-8xl"
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
