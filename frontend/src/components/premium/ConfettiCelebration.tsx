import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiCelebrationProps {
  trigger: boolean;
  type?: "basic" | "burst" | "stars" | "fireworks";
  message?: string;
  onComplete?: () => void;
}

export default function ConfettiCelebration({ 
  trigger, 
  type = "basic", 
  message,
  onComplete 
}: ConfettiCelebrationProps) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const runConfetti = () => {
      switch (type) {
        case "burst":
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#ea580c', '#fb923c', '#fdba74']
          });
          break;
          
        case "stars":
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            shapes: ['star'],
            colors: ['#fbbf24', '#f59e0b', '#d97706']
          });
          break;
          
        case "fireworks":
          const count = 200;
          const defaults = {
            origin: { y: 0.7 },
            colors: ['#f97316', '#ea580c', '#22c55e', '#3b82f6', '#8b5cf6']
          };

          function fire(particleRatio: number, opts: any) {
            confetti({
              ...defaults,
              ...opts,
              particleCount: Math.floor(count * particleRatio)
            });
          }

          fire(0.25, { spread: 26, startVelocity: 55 });
          fire(0.2, { spread: 60 });
          fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
          fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
          fire(0.1, { spread: 120, startVelocity: 45 });
          break;
          
        default:
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#f97316', '#ea580c', '#fb923c']
          });
      }
    };

    runConfetti();
    
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete?.(), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, type, message, onComplete]);

  return (
    <AnimatePresence>
      {showMessage && message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut"
            }}
            className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-orange-500 max-w-md mx-4"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Congratulations!
              </h2>
              <p className="text-gray-600 text-lg">
                {message}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}