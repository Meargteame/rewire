import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { TrendingUp, Calendar, Target, Award, Clock, Zap } from "lucide-react";

interface ChallengeHistoryItem {
  id: string;
  challengeTitle: string;
  category: string;
  completedAt: string;
  durationSeconds: number;
}

interface Stats {
  totalCompleted: number;
  categoriesBreakdown: Record<string, number>;
  recentChallenges: ChallengeHistoryItem[];
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChallengeHistoryItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        fetch("/api/history", { credentials: "include" }),
        fetch("/api/stats", { credentials: "include" }),
      ]);

      const historyData = await historyRes.json();
      const statsData = await statsRes.json();

      if (historyData.success) setHistory(historyData.history);
      if (statsData.success) setStats(statsData.stats);
    } catch (error) {
      console.error("Failed to fetch progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const categoryColors: Record<string, string> = {
    "creative sketching": "bg-purple-500",
    "language learning": "bg-blue-500",
    "mindfulness": "bg-green-500",
    "physical movement": "bg-red-500",
    "gratitude reflection": "bg-yellow-500",
    "trivia": "bg-indigo-500",
    "music": "bg-pink-500",
    "coding puzzle": "bg-orange-500",
  };

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            Your Progress 📊
          </h1>
          <p className="text-brand-muted text-lg">
            Track your journey and celebrate your wins
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-brand-muted">Loading your progress...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-brand-accent to-orange-500 p-6 rounded-2xl text-white shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                    Current Streak
                  </span>
                </div>
                <p className="text-4xl font-bold">{user.currentStreak}</p>
                <p className="text-sm opacity-80 mt-1">days in a row</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-brand-muted">Total Completed</span>
                </div>
                <p className="text-4xl font-bold">{user.totalChallenges}</p>
                <p className="text-sm text-brand-muted mt-1">challenges</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-brand-muted">Personal Best</span>
                </div>
                <p className="text-4xl font-bold">{user.longestStreak}</p>
                <p className="text-sm text-brand-muted mt-1">day streak</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-brand-muted">Time Invested</span>
                </div>
                <p className="text-4xl font-bold">{Math.floor((user.totalChallenges * 60) / 60)}</p>
                <p className="text-sm text-brand-muted mt-1">minutes</p>
              </motion.div>
            </div>

            {/* Category Breakdown */}
            {stats && Object.keys(stats.categoriesBreakdown).length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-brand-border mb-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Category Breakdown</h2>
                <div className="space-y-4">
                  {Object.entries(stats.categoriesBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => {
                      const percentage = (count / stats.totalCompleted) * 100;
                      const colorClass = categoryColors[category] || "bg-gray-500";
                      
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium capitalize">{category}</span>
                            <span className="text-sm text-brand-muted">{count} challenges ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-3 bg-brand-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${colorClass} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Challenge History Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold">Recent Activity</h2>
                <Calendar className="w-5 h-5 text-brand-muted" />
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-brand-muted" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No challenges completed yet</h3>
                  <p className="text-brand-muted">Start your first challenge to see your progress here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => {
                    const date = new Date(item.completedAt);
                    const colorClass = categoryColors[item.category] || "bg-gray-500";
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-brand-bg transition-colors"
                      >
                        <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{item.challengeTitle}</h3>
                          <div className="flex items-center gap-3 text-sm text-brand-muted">
                            <span className="capitalize">{item.category}</span>
                            <span>•</span>
                            <span>{date.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-brand-muted text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{item.durationSeconds}s</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
