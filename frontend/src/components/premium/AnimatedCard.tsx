import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: boolean;
}

/** Caller-set bg-* must not be paired with our default surface (Tailwind + layer order can hide gradients). */
function hasExplicitBackground(className: string) {
  return /(^|\s)(?:!)?bg-/.test(className);
}

export default function AnimatedCard({ 
  children, 
  className = "", 
  hover = true, 
  delay = 0,
  gradient = false 
}: AnimatedCardProps) {
  const base = gradient
    ? "gradient-border"
    : hasExplicitBackground(className)
      ? "premium-card"
      : "premium-card bg-brand-surface";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={hover ? { 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`
        ${base}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}