import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "./premium/PremiumToast";
import { api } from "../services/api";
import { handleApiError } from "../utils/errorHandler";
import { formatTime } from "../utils";
import { DEFAULT_CHALLENGE_DURATION } from "../constants";
import type { Challenge } from "../types";

interface Props {
  challenge: Challenge | null;
  loading?: boolean;
  onComplete?: (challengeTitle: string) => void;
  onRefresh?: () => void;
  /** Use full width of parent (e.g. dashboard). Default keeps a comfortable max width for landing. */
  fullWidth?: boolean;
}

export default function ChallengeCard({ challenge, loading, onComplete, onRefresh, fullWidth = false }: Props) {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_CHALLENGE_DURATION);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    setTimeLeft(challenge?.durationSeconds ?? DEFAULT_CHALLENGE_DURATION);
    setRunning(false);
    setDone(false);
  }, [challenge]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setDone(true);
      handleComplete();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft]);

  const handleComplete = async () => {
    onComplete?.(challenge?.title || "Challenge");
    
    // Track completion if user is logged in
    if (user && challenge) {
      try {
        const data = await api.challenges.complete({
          challengeTitle: challenge.title,
          category: challenge.category,
          durationSeconds: challenge.durationSeconds,
        });
        
        // Check for new achievements
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach((achievement) => {
            showToast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
          });
        }
        
        await refreshUser(); // Refresh streak and stats
      } catch (err) {
        handleApiError(err, "Failed to save progress");
      }
    }
  };

  const total = challenge?.durationSeconds ?? DEFAULT_CHALLENGE_DURATION;
  const progress = ((total - timeLeft) / total) * 100;

  const shellClass = fullWidth
    ? "w-full p-6 md:p-8 glass rounded-card shadow-xl"
    : "w-full max-w-md p-8 glass rounded-card shadow-xl";

  if (loading) {
    return (
      <div className={`${shellClass} animate-pulse`}>
        <div className="h-3 bg-brand-border rounded w-1/3 mb-6" />
        <div className="h-6 bg-brand-border rounded w-3/4 mb-3" />
        <div className="h-4 bg-brand-border rounded w-full mb-6" />
        <div className="h-2 bg-brand-border rounded-full mb-8" />
        <div className="h-12 bg-brand-border rounded-lg" />
      </div>
    );
  }

  return (
    <motion.div
      key={challenge?.title}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={shellClass}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">
          {challenge?.category ?? "Current Quest"}
        </span>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm ${timeLeft <= 10 && running ? "text-red-500" : "text-brand-accent"}`}>
            {formatTime(timeLeft)}
          </span>
          {onRefresh && (
            <button onClick={onRefresh} className="text-brand-muted hover:text-brand-accent transition-colors" aria-label="New challenge">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <h3 className="text-2xl mb-2">{challenge?.title ?? "Loading..."}</h3>
      <p className="text-brand-muted text-sm mb-6 leading-relaxed">{challenge?.description}</p>

      <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-brand-accent rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {done ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" /> Challenge Complete!
        </motion.div>
      ) : (
        <button
          onClick={() => running ? setRunning(false) : setRunning(true)}
          className="w-full py-3 bg-brand-text text-white rounded-lg font-medium hover:bg-brand-text/90 transition-all"
        >
          {running ? "Pause" : timeLeft < total ? "Resume" : "Start Challenge"}
        </button>
      )}
    </motion.div>
  );
}
