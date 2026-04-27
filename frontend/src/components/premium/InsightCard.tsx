import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import AnimatedCard from "./AnimatedCard";

interface InsightCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change
  trend?: "up" | "down" | "neutral";
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  delay?: number;
  gradient?: boolean;
}

export default function InsightCard({
  title,
  value,
  change,
  trend = "neutral",
  description,
  action,
  delay = 0,
  gradient = false
}: InsightCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <AnimatedCard 
      className={`p-6 ${gradient ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-white'} shadow-lg`}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold gradient-text">{value}</span>
            {change !== undefined && (
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-semibold">
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {action && (
        <motion.button
          whileHover={{ x: 5 }}
          onClick={action.onClick}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>{action.label}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatedCard>
  );
}