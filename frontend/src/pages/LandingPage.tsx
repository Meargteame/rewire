import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Zap, Brain, Sparkles, Smartphone, ShieldCheck, Star, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChallengeCard from "../components/ChallengeCard";
import { useChallenge, useChallenges } from "../hooks/useChallenge";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { challenge, loading, refresh } = useChallenge();
  const { challenges, loading: loadingBatch } = useChallenges();
  const [completedCount, setCompletedCount] = useState(0);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
        <motion.div initial="initial" animate="animate" variants={stagger} className="max-w-4xl">
          <motion.span variants={fadeIn} className="inline-block px-4 py-1.5 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
            Soul over Scroll
          </motion.span>
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.95]">
            Replace mindless scrolling with{" "}
            <span className="italic text-brand-accent">micro-wins.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-brand-muted mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            The habit-breaker that swaps dopamine-draining feeds for 60-second challenges that actually feel good. Reclaim 45 minutes of your day, every day.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleGetStarted} className="w-full sm:w-auto bg-brand-accent text-white px-8 py-4 rounded-button text-lg font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group">
              Start My First Challenge
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#how" className="w-full sm:w-auto px-8 py-4 rounded-button text-lg font-medium border border-brand-border hover:bg-white transition-all">
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-20 relative w-full max-w-5xl aspect-video bg-brand-text rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-text">
          <img src="https://picsum.photos/seed/rewire-app/1920/1080?blur=2" alt="Rewire App Interface" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ChallengeCard challenge={challenge} loading={loading} onRefresh={refresh} onComplete={() => setCompletedCount((c) => c + 1)} />
          </div>
        </motion.div>

        {completedCount > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-brand-accent font-semibold text-sm">
            {completedCount} challenge{completedCount > 1 ? "s" : ""} completed this session 🎉
          </motion.p>
        )}
      </section>

      {/* Rest of landing page sections... */}
      <section id="how" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">The attention economy is winning.</h2>
          <p className="text-brand-muted text-lg mb-12">It&apos;s time to fight back with Rewire.</p>
          <button onClick={handleGetStarted} className="bg-brand-accent text-white px-8 py-4 rounded-button text-lg font-medium hover:scale-105 transition-all">
            Get Started Now
          </button>
        </div>
      </section>
    </main>
  );
}
