import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { TrendingUp, Calendar, Target, Award, Clock, Zap, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from "recharts";
import AnimatedCard from "../components/premium/AnimatedCard";
import ProgressRing from "../components/premium/ProgressRing";
import InsightCard from "../components/premium/InsightCard";
import AchievementBadge from "../components/premium/AchievementBadge";
import SkeletonLoader from "../components/premium/SkeletonLoader";
import { showToast } from "../components/premium/PremiumToast";

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

interface Insight {
  type: 'trend' | 'milestone' | 'recommendation' | 'warning';
  title: string;
  description: string;
  metric: number;
  change: number | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  secret?: boolean;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChallengeHistoryItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "achievements">("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, statsRes, insightsRes, achievementsRes] = await Promise.all([
        fetch("/api/history", { credentials: "include" }),
        fetch("/api/stats", { credentials: "include" }),
        fetch("/api/insights", { credentials: "include" }),
        fetch("/api/achievements", { credentials: "include" }),
      ]);

      const historyData = await historyRes.json();
      const statsData = await statsRes.json();
      const insightsData = await insightsRes.json();
      const achievementsData = await achievementsRes.json();

      if (historyData.success) setHistory(historyData.history);
      if (statsData.success) setStats(statsData.stats);
      if (insightsData.success) setInsights(insightsData.insights);
      if (achievementsData.success) setAchievements(achievementsData.achievements);
    } catch (error) {
      console.error("Failed to fetch progress data:", error);
      showToast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
          <SkeletonLoader variant="dashboard" />
        </main>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(stats?.categoriesBreakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: getCategoryColor(name)
  }));

  const weeklyData = getWeeklyData(history);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 gradient-text">
            Your Progress 📊
          </h1>
          <p className="text-brand-muted text-lg">
            Track your journey and celebrate your wins
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl shadow-sm w-fit">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "insights", label: "Insights", icon: TrendingUp },
            { id: "achievements", label: "Achievements", icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all relative
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg -z-10"
                  />
                )}
              </button>
            );
          })}
        </div>
        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatedCard className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 text-white shadow-xl" delay={0.1}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                    Current Streak
                  </span>
                </div>
                <p className="text-4xl font-bold">{user.currentStreak}</p>
                <p className="text-sm opacity-80 mt-1">days in a row</p>
              </AnimatedCard>

              <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.2}>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-brand-muted">Total Completed</span>
                </div>
                <p className="text-4xl font-bold gradient-text">{user.totalChallenges}</p>
                <p className="text-sm text-brand-muted mt-1">challenges</p>
              </AnimatedCard>

              <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.3}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-brand-muted">Personal Best</span>
                </div>
                <p className="text-4xl font-bold gradient-text">{user.longestStreak}</p>
                <p className="text-sm text-brand-muted mt-1">day streak</p>
              </AnimatedCard>

              <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.4}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-brand-muted">Time Invested</span>
                </div>
                <p className="text-4xl font-bold gradient-text">{Math.floor((user.totalChallenges * 60) / 60)}</p>
                <p className="text-sm text-brand-muted mt-1">minutes</p>
              </AnimatedCard>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weekly Progress Chart */}
              <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.5}>
                <h3 className="text-xl font-serif font-bold mb-6 gradient-text">Weekly Progress</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="challenges" 
                        stroke="url(#gradient)" 
                        strokeWidth={3}
                        dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedCard>

              {/* Category Distribution */}
              <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.6}>
                <h3 className="text-xl font-serif font-bold mb-6 gradient-text">Category Distribution</h3>
                {categoryData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Complete challenges to see distribution</p>
                    </div>
                  </div>
                )}
              </AnimatedCard>
            </div>

            {/* Challenge History Timeline */}
            <AnimatedCard className="bg-white p-6 shadow-lg" delay={0.7}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold gradient-text">Recent Activity</h2>
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
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {history.slice(0, 10).map((item, index) => {
                    const date = new Date(item.completedAt);
                    const colorClass = getCategoryColor(item.category);
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all"
                      >
                        <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
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
            </AnimatedCard>
          </div>
        )}
        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {insights.length === 0 ? (
              <AnimatedCard className="bg-white p-12 text-center shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No insights yet</h3>
                <p className="text-gray-600">Complete more challenges to unlock personalized insights!</p>
              </AnimatedCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    title={insight.title}
                    value={insight.metric}
                    change={insight.change}
                    trend={insight.change ? (insight.change > 0 ? "up" : "down") : "neutral"}
                    description={insight.description}
                    delay={index * 0.1}
                    gradient={insight.type === "milestone"}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-8">
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6 gradient-text">
                  Unlocked ({unlockedAchievements.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                  {unlockedAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AchievementBadge
                        achievement={achievement}
                        size="lg"
                        showProgress={false}
                        onClick={() => showToast.success(`${achievement.name}: ${achievement.description}`)}
                      />
                      <div className="text-center mt-2">
                        <p className="text-sm font-semibold">{achievement.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{achievement.rarity}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* In Progress Achievements */}
            {lockedAchievements.filter(a => a.progress > 0).length > 0 && (
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6 gradient-text">
                  In Progress ({lockedAchievements.filter(a => a.progress > 0).length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedAchievements
                    .filter(a => a.progress > 0)
                    .map((achievement, index) => (
                      <AnimatedCard key={achievement.id} className="bg-white p-6 shadow-lg" delay={index * 0.1}>
                        <div className="flex items-start gap-4">
                          <AchievementBadge
                            achievement={achievement}
                            size="md"
                            showProgress={true}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{achievement.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-semibold">{Math.round(achievement.progress)}%</span>
                            </div>
                            <ProgressRing
                              progress={achievement.progress}
                              size={40}
                              strokeWidth={3}
                              showPercentage={false}
                            />
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.filter(a => a.progress === 0).length > 0 && (
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6 gradient-text">
                  Locked ({lockedAchievements.filter(a => a.progress === 0).length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                  {lockedAchievements
                    .filter(a => a.progress === 0)
                    .map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AchievementBadge
                          achievement={achievement}
                          size="lg"
                          showProgress={false}
                        />
                        <div className="text-center mt-2">
                          <p className="text-sm font-semibold text-gray-500">
                            {achievement.secret ? "???" : achievement.name}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{achievement.rarity}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {achievements.length === 0 && (
              <AnimatedCard className="bg-white p-12 text-center shadow-lg">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
                <p className="text-gray-600">Start completing challenges to unlock achievements!</p>
              </AnimatedCard>
            )}
          </div>
        )}
      </main>
    </div>
  );

  // Helper functions
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      "creative sketching": "bg-purple-500",
      "language learning": "bg-blue-500", 
      "mindfulness": "bg-green-500",
      "physical movement": "bg-red-500",
      "gratitude reflection": "bg-yellow-500",
      "trivia": "bg-indigo-500",
      "music": "bg-pink-500",
      "coding puzzle": "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
  }

  function getWeeklyData(history: ChallengeHistoryItem[]) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({ day, challenges: 0 }));
    
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    
    history.forEach(item => {
      const date = new Date(item.completedAt);
      if (date >= weekStart) {
        const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        if (dayIndex < 7) {
          weekData[dayIndex].challenges++;
        }
      }
    });
    
    return weekData;
  }
}
