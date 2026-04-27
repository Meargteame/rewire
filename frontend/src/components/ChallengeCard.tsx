import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import type { Challenge } from "../hooks/useChallenge";

interface Props {
  challenge: Challenge | null;
  loading?: boolean;
  onComplete?: () => void;
  onRefresh?: () => void;
}

export default function ChallengeCard({ challenge, loading, onComplete, onRefresh }: Props) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  // Reset timer when challenge changes
  useEffect(() => {
    setTimeLeft(challenge?.durationSeconds ?? 60);
    setRunning(false);
    setDone(false);
  }, [challenge]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setDone(true);
      onComplete?.();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft, onComplete]);

  const total = challenge?.durationSeconds ?? 60;
  const progress = ((total - timeLeft) / total) * 100;

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="w-full max-w-md p-8 glass rounded-card shadow-xl animate-pulse">
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
      className="w-full max-w-md p-8 glass rounded-card shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">
          {challenge?.category ?? "Current Quest"}
        </span>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm ${timeLeft <= 10 && running ? "text-red-500" : "text-brand-accent"}`}>
            {fmt(timeLeft)}
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
