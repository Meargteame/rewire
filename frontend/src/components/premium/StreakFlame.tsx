import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakFlameProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function StreakFlame({ streak, size = "md", animated = true }: StreakFlameProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const getFlameColor = (streak: number) => {
    if (streak >= 30) return "#dc2626"; // Red - Hot
    if (streak >= 14) return "#ea580c"; // Orange-red - Very warm
    if (streak >= 7) return "#f97316";  // Orange - Warm
    if (streak >= 3) return "#f59e0b";  // Amber - Getting warm
    return "#eab308"; // Yellow - Starting
  };

  const getIntensity = (streak: number) => {
    return Math.min(streak / 30, 1); // Max intensity at 30 days
  };

  const flameColor = getFlameColor(streak);
  const intensity = getIntensity(streak);

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={animated ? {
        scale: [1, 1.1, 1],
        rotate: [0, 2, -2, 0]
      } : undefined}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={animated ? {
          boxShadow: [
            `0 0 20px ${flameColor}40`,
            `0 0 30px ${flameColor}60`,
            `0 0 20px ${flameColor}40`
          ]
        } : undefined}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Flame icon */}
      <Flame 
        className={`${sizeClasses[size]} relative z-10`}
        style={{ 
          color: flameColor,
          filter: `brightness(${1 + intensity * 0.5})`
        }}
      />
      
      {/* Particles for high streaks */}
      {streak >= 7 && animated && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              animate={{
                y: [-10, -20, -10],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
              style={{
                left: `${40 + i * 10}%`,
                top: "20%"
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}