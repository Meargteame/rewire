import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Target, ArrowRight } from "lucide-react";
import AnimatedCard from "./AnimatedCard";
import { showToast } from "./PremiumToast";

interface Recommendation {
  id: string;
  type: "challenge" | "time" | "category" | "streak";
  title: string;
  description: string;
  confidence: number; // 0-100
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: "sparkles" | "trending" | "clock" | "target";
}

interface SmartRecommendationsProps {
  userId?: string;
  className?: string;
}

export default function SmartRecommendations({ userId, className = "" }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      generateRecommendations();
    }
  }, [userId]);

  const generateRecommendations = async () => {
    try {
      // Fetch user data for recommendations
      const [historyRes, statsRes] = await Promise.all([
        fetch("/api/history", { credentials: "include" }),
        fetch("/api/stats", { credentials: "include" })
      ]);

      const historyData = await historyRes.json();
      const statsData = await statsRes.json();

      if (historyData.success && statsData.success) {
        const recs = analyzeAndRecommend(historyData.history, statsData.stats);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error("Failed to generate recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeAndRecommend = (history: any[], stats: any): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Time-based recommendations
    const hourCounts = new Array(24).fill(0);
    history.forEach(h => {
      const hour = new Date(h.completedAt).getHours();
      hourCounts[hour]++;
    });

    const bestHour = hourCounts.indexOf(Math.max(...hourCounts));
    if (Math.max(...hourCounts) > 2) {
      const timeLabel = bestHour < 12 ? `${bestHour || 12}AM` : `${bestHour === 12 ? 12 : bestHour - 12}PM`;
      recommendations.push({
        id: "optimal-time",
        type: "time",
        title: "Optimal Challenge Time",
        description: `You're most successful around ${timeLabel}. Try scheduling your next challenge then!`,
        confidence: 85,
        icon: "clock",
        action: {
          label: "Set Reminder",
          onClick: () => showToast.info("Reminder feature coming soon!")
        }
      });
    }

    // Category recommendations
    const categories = Object.entries(stats.categoriesBreakdown || {});
    if (categories.length > 0) {
      const [topCategory, topCount] = categories.sort(([,a], [,b]) => (b as number) - (a as number))[0];
      const leastCategory = categories.find(([cat]) => 
        !["creative sketching", "mindfulness", "physical movement"].includes(cat) ||
        (stats.categoriesBreakdown[cat] || 0) < 2
      );

      if (leastCategory) {
        recommendations.push({
          id: "explore-category",
          type: "category", 
          title: "Explore New Territory",
          description: `Try more ${leastCategory[0]} challenges to diversify your skills!`,
          confidence: 70,
          icon: "sparkles",
          action: {
            label: "Browse Category",
            onClick: () => showToast.info("Navigate to Challenges page to explore!")
          }
        });
      }

      if (topCount as number > 5) {
        recommendations.push({
          id: "strength-category",
          type: "category",
          title: "Build on Your Strength", 
          description: `You excel at ${topCategory}! Try advanced challenges in this category.`,
          confidence: 90,
          icon: "trending"
        });
      }
    }

    // Streak recommendations
    const currentDate = new Date();
    const lastChallenge = history[0] ? new Date(history[0].completedAt) : null;
    
    if (lastChallenge) {
      const hoursSinceLastChallenge = (currentDate.getTime() - lastChallenge.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastChallenge > 18 && hoursSinceLastChallenge < 30) {
        recommendations.push({
          id: "maintain-streak",
          type: "streak",
          title: "Maintain Your Momentum",
          description: "It's been a while since your last challenge. Keep your streak alive!",
          confidence: 95,
          icon: "target",
          action: {
            label: "Start Challenge",
            onClick: () => showToast.info("Navigate to Dashboard to start a challenge!")
          }
        });
      }
    }

    // Consistency recommendations
    const recentDays = 7;
    const recentHistory = history.filter(h => {
      const date = new Date(h.completedAt);
      const daysAgo = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= recentDays;
    });

    if (recentHistory.length < 3 && history.length > 10) {
      recommendations.push({
        id: "consistency-boost",
        type: "streak",
        title: "Consistency Boost Needed",
        description: "You've been less active lately. Small daily actions create big results!",
        confidence: 80,
        icon: "trending",
        action: {
          label: "Quick Challenge",
          onClick: () => showToast.info("Try a 60-second mindfulness challenge!")
        }
      });
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "trending":
        return <TrendingUp className="w-5 h-5" />;
      case "clock":
        return <Clock className="w-5 h-5" />;
      case "target":
        return <Target className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-100";
    if (confidence >= 70) return "text-blue-600 bg-blue-100";
    return "text-yellow-600 bg-yellow-100";
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-24 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <AnimatedCard className="bg-white p-6 text-center shadow-lg">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold mb-2">No recommendations yet</h3>
        <p className="text-sm text-gray-600">Complete more challenges to get personalized suggestions!</p>
      </AnimatedCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-serif font-bold gradient-text mb-4">Smart Recommendations</h3>
      
      {recommendations.map((rec, index) => (
        <AnimatedCard key={rec.id} className="bg-white p-4 shadow-md" delay={index * 0.1}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
              {getIcon(rec.icon)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                  {rec.confidence}% match
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              
              {rec.action && (
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={rec.action.onClick}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>{rec.action.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}