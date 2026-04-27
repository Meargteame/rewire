import { motion } from "framer-motion";
import { Crown, Star, Flame, Target, Calendar, Trophy, Zap, Award } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number; // 0-100
  unlocked: boolean;
  unlockedAt?: Date;
  secret?: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
}

export default function AchievementBadge({
  achievement,
  size = "md",
  showProgress = true,
  onClick
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  };

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return {
          bg: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
          glow: "shadow-lg shadow-yellow-500/50",
          border: "border-yellow-300"
        };
      case "epic":
        return {
          bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
          glow: "shadow-lg shadow-purple-500/50",
          border: "border-purple-300"
        };
      case "rare":
        return {
          bg: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
          glow: "shadow-lg shadow-blue-500/50",
          border: "border-blue-300"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-400 to-gray-600",
          glow: "shadow-md shadow-gray-500/30",
          border: "border-gray-300"
        };
    }
  };

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      crown: Crown,
      star: Star,
      flame: Flame,
      target: Target,
      calendar: Calendar,
      trophy: Trophy,
      zap: Zap,
      award: Award
    };
    
    const IconComponent = iconMap[iconName] || Star;
    return <IconComponent className={`${iconSizes[size]} text-white`} />;
  };

  const colors = getRarityColors(achievement.rarity);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative cursor-pointer ${onClick ? 'hover:cursor-pointer' : ''}`}
    >
      {/* Badge Container */}
      <div
        className={`
          ${sizeClasses[size]} 
          ${achievement.unlocked ? colors.bg : 'bg-gray-200'} 
          ${achievement.unlocked ? colors.glow : 'shadow-sm'}
          ${achievement.unlocked ? colors.border : 'border-gray-300'}
          border-2 rounded-full flex items-center justify-center relative overflow-hidden
          transition-all duration-300
        `}
      >
        {/* Shine effect for unlocked badges */}
        {achievement.unlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "linear"
            }}
          />
        )}

        {/* Icon */}
        <div className={`relative z-10 ${achievement.unlocked ? '' : 'opacity-40'}`}>
          {achievement.secret && !achievement.unlocked ? (
            <div className="text-gray-400 text-2xl">?</div>
          ) : (
            getIcon(achievement.icon)
          )}
        </div>

        {/* Lock overlay for locked badges */}
        {!achievement.unlocked && !achievement.secret && (
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white rounded-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Progress ring for partially completed achievements */}
      {showProgress && !achievement.unlocked && achievement.progress > 0 && (
        <svg
          className={`absolute inset-0 ${sizeClasses[size]} transform -rotate-90`}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 48 * (1 - achievement.progress / 100)
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      )}

      {/* Unlock animation */}
      {achievement.unlocked && (
        <motion.div
          className="absolute -inset-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className={`w-full h-full ${colors.bg} rounded-full blur-md`} />
        </motion.div>
      )}

      {/* Rarity indicator */}
      {achievement.unlocked && achievement.rarity !== "common" && (
        <div className="absolute -top-1 -right-1">
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
            ${achievement.rarity === 'legendary' ? 'bg-yellow-500' : ''}
            ${achievement.rarity === 'epic' ? 'bg-purple-500' : ''}
            ${achievement.rarity === 'rare' ? 'bg-blue-500' : ''}
          `}>
            {achievement.rarity === 'legendary' && '★'}
            {achievement.rarity === 'epic' && '◆'}
            {achievement.rarity === 'rare' && '●'}
          </div>
        </div>
      )}
    </motion.div>
  );
}