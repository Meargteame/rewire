/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import {
  ArrowRight, CheckCircle2, Clock, Zap, Brain,
  Sparkles, Smartphone, ShieldCheck, Menu, X, Star, Quote,
} from "lucide-react";
import { useState } from "react";
import ChallengeCard from "./components/ChallengeCard";
import ChallengeModal from "./components/ChallengeModal";
import { useChallenge, useChallenges } from "./hooks/useChallenge";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const { challenge, loading, refresh } = useChallenge();
  const { challenges, loading: loadingBatch } = useChallenges();
  const [completedCount, setCompletedCount] = useState(0);

  return (
    <div className="min-h-screen selection:bg-brand-accent/30">
      <Nav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} onGetStarted={() => setIsChallengeModalOpen(true)} />
      <ChallengeModal isOpen={isChallengeModalOpen} onClose={() => setIsChallengeModalOpen(false)} />

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 bg-brand-bg pt-24 px-6 flex flex-col gap-6 text-xl font-serif"
        >
          <a href="#how" onClick={() => setIsMenuOpen(false)}>How it works</a>
          <a href="#quests" onClick={() => setIsMenuOpen(false)}>Quests</a>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
          <button onClick={() => { setIsMenuOpen(false); setIsChallengeModalOpen(true); }} className="bg-brand-accent text-white py-4 rounded-xl mt-4">Get Started</button>
        </motion.div>
      )}

      <main>
        {/* Hero */}
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
              <button onClick={() => setIsChallengeModalOpen(true)} className="w-full sm:w-auto bg-brand-accent text-white px-8 py-4 rounded-button text-lg font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                Start My First Challenge
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#how" className="w-full sm:w-auto px-8 py-4 rounded-button text-lg font-medium border border-brand-border hover:bg-white transition-all">
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative w-full max-w-5xl aspect-video bg-brand-text rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-text"
          >
            <img
              src="https://picsum.photos/seed/rewire-app/1920/1080?blur=2"
              alt="Rewire App Interface"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChallengeCard
                challenge={challenge}
                loading={loading}
                onRefresh={refresh}
                onComplete={() => setCompletedCount((c) => c + 1)}
              />
            </div>
          </motion.div>

          {completedCount > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-brand-accent font-semibold text-sm">
              {completedCount} challenge{completedCount > 1 ? "s" : ""} completed this session 🎉
            </motion.p>
          )}
        </section>

        {/* Why Now */}
        <section id="how" className="section-padding bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl mb-6">
                The attention economy is winning.{" "}
                <br /><span className="text-brand-muted">It&apos;s time to fight back.</span>
              </h2>
              <p className="text-lg text-brand-muted mb-8 leading-relaxed">
                Modern apps are engineered to keep you trapped in a loop of low-value dopamine. Rewire uses the same psychological triggers to build habits that actually matter.
              </p>
              <div className="space-y-6">
                {[
                  { stat: "78%", label: "of users feel 'digital fatigue' daily" },
                  { stat: "2.5 hrs", label: "average daily time spent on social feeds" },
                  { stat: "45 min", label: "average time reclaimed with Rewire" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-3xl font-serif text-brand-accent">{item.stat}</span>
                    <span className="text-sm text-brand-muted font-medium uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-8 bg-brand-bg rounded-card border border-brand-border">
                <Brain className="w-10 h-10 text-brand-accent mb-4" />
                <h4 className="text-xl mb-2">Neuro-Positive Design</h4>
                <p className="text-brand-muted text-sm">We replace the &quot;empty&quot; dopamine of scrolling with the &quot;earned&quot; dopamine of small achievements.</p>
              </div>
              <div className="p-8 bg-brand-bg rounded-card border border-brand-border">
                <Smartphone className="w-10 h-10 text-brand-accent mb-4" />
                <h4 className="text-xl mb-2">Seamless Intercept</h4>
                <p className="text-brand-muted text-sm">Our smart nudge detects when you&apos;re stuck in a scroll loop and offers a meaningful exit ramp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Break the loop.</h2>
            <p className="text-brand-muted">The status quo vs. the Rewire way.</p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { pain: "The Doomscroll", solution: "The Micro-Quest", desc: "Swap 30 minutes of noise for 60 seconds of focused learning.", icon: <Clock className="w-6 h-6" /> },
              { pain: "Digital Guilt", solution: "Real Progress", desc: "End your day feeling accomplished instead of drained.", icon: <CheckCircle2 className="w-6 h-6" /> },
              { pain: "High Friction", solution: "One-Tap Entry", desc: "No 'monk mode' required. Just a better choice at the right time.", icon: <Zap className="w-6 h-6" /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col h-full">
                <div className="p-6 bg-white rounded-t-card border-x border-t border-brand-border flex-1">
                  <div className="text-brand-accent mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-red-500 uppercase mb-2 line-through opacity-50">{item.pain}</div>
                  <h4 className="text-2xl mb-3">{item.solution}</h4>
                  <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="h-1 bg-brand-accent rounded-b-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Live Quest Vault */}
        <section id="quests" className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl mb-4">Live Quest Vault</h2>
              <p className="text-brand-muted">AI-generated challenges, fresh every time. Pick one and go.</p>
            </div>
            {loadingBatch ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-6 bg-brand-bg rounded-card border border-brand-border animate-pulse h-40" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((c, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="p-6 bg-brand-bg rounded-card border border-brand-border flex flex-col gap-3 cursor-pointer group"
                  >
                    <span className="text-xs font-semibold text-brand-accent uppercase tracking-widest">{c.category}</span>
                    <h4 className="text-xl group-hover:text-brand-accent transition-colors">{c.title}</h4>
                    <p className="text-brand-muted text-sm leading-relaxed flex-1">{c.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-brand-muted font-mono">{c.durationSeconds}s</span>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="text-xs font-semibold text-brand-accent flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Try it <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section-padding bg-brand-text text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl mb-6">Engineered for <br /><span className="italic opacity-70">human attention.</span></h2>
                <p className="text-white/60 text-lg">Every feature is designed to get you in, get you a win, and get you back to your life.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-3 border border-white/20 rounded-full text-sm font-medium">12k+ Active Streaks</div>
                <div className="px-6 py-3 border border-white/20 rounded-full text-sm font-medium">89% Completion Rate</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Scroll Intercept", desc: "Smart detection nudges you when you've been scrolling for more than 3 minutes.", icon: <Smartphone /> },
                { title: "60-Second Quests", desc: "AI-curated micro-lessons in languages, art, coding, and mindfulness.", icon: <Sparkles /> },
                { title: "Dopamine Streaks", desc: "Visual progress that rewards consistency, not time spent on the app.", icon: <Zap /> },
                { title: "The Snack Vault", desc: "A personalized library of 'meaningful snacks' based on your interests.", icon: <Brain /> },
                { title: "Privacy First", desc: "Your usage data stays on your device. We don't track what you scroll.", icon: <ShieldCheck /> },
                { title: "Custom Triggers", desc: "Set specific times or apps where you want Rewire to be most active.", icon: <Clock /> },
              ].map((f, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="p-8 border border-white/10 rounded-card bg-white/5 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center mb-6">{f.icon}</div>
                  <h4 className="text-2xl mb-3">{f.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl md:text-5xl mb-6">Loved by the <br />distracted.</h2>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />)}
              </div>
              <p className="text-brand-muted">Rated 4.9/5 by over 10,000 users who reclaimed their focus.</p>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              {[
                { quote: "I swapped my 2am TikTok habit for 2am Spanish lessons. I actually feel awake and energized now instead of drained.", author: "Sarah J.", role: "Product Designer" },
                { quote: "Rewire didn't take away my phone; it just made my phone work for me. The 60-second quests are the perfect length.", author: "Mark T.", role: "Software Engineer" },
              ].map((t, i) => (
                <div key={i} className="p-8 bg-white border border-brand-border rounded-card relative">
                  <Quote className="absolute top-6 right-8 w-10 h-10 text-brand-accent/10" />
                  <p className="text-lg mb-8 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-bg rounded-full border border-brand-border" />
                    <div>
                      <div className="font-bold text-sm">{t.author}</div>
                      <div className="text-xs text-brand-muted">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-padding bg-white">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Invest in your focus.</h2>
            <p className="text-brand-muted">Choose the plan that fits your habit-breaking journey.</p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { name: "Free", price: "$0", features: ["3 Intercepts / day", "Basic Quest Library", "Standard Streaks"], cta: "Start for Free", recommended: false },
              { name: "Premium", price: "$8", features: ["Unlimited Intercepts", "Full Quest Library", "Custom Triggers", "Advanced Analytics"], cta: "Start 7-Day Trial", recommended: true },
              { name: "Lifetime", price: "$99", features: ["All Premium Features", "One-time Payment", "Early Access to Quests", "Priority Support"], cta: "Get Lifetime Access", recommended: false },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-card border flex flex-col ${plan.recommended ? "border-brand-accent bg-brand-accent/5 ring-4 ring-brand-accent/5" : "border-brand-border bg-brand-bg"}`}>
                {plan.recommended && <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4 block">Recommended</span>}
                <h4 className="text-2xl mb-1">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-serif">{plan.price}</span>
                  {plan.price !== "$99" && plan.price !== "$0" && <span className="text-brand-muted text-sm">/mo</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-brand-muted">
                      <CheckCircle2 className="w-4 h-4 text-brand-accent" />{f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-button font-medium transition-all ${plan.recommended ? "bg-brand-accent text-white hover:scale-105 shadow-lg shadow-brand-accent/20" : "bg-brand-text text-white hover:bg-brand-text/90"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding max-w-4xl mx-auto">
          <h2 className="text-4xl mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is this just another screen time app?", a: "No. Screen time apps just block you. Rewire replaces the habit. We don't just tell you to stop; we give you something better to do." },
              { q: "Does it actually block my other apps?", a: "It provides a 'soft intercept' – a nudge that you can choose to follow. It's about building the muscle of choice, not just forced restriction." },
              { q: "What kind of challenges are included?", a: "Everything from 60-second language drills and creative sketching prompts to guided breathing and quick coding puzzles." },
              { q: "Is my data private?", a: "Completely. We use local-first storage. We never see what you're scrolling or how you use other apps. Your focus is your business." },
              { q: "Does it work on both iOS and Android?", a: "Yes, Rewire is available as a mobile app for both platforms and a browser extension for desktop." },
            ].map((item, i) => (
              <details key={i} className="group p-6 bg-white border border-brand-border rounded-card cursor-pointer">
                <summary className="flex items-center justify-between font-medium list-none">
                  {item.q}
                  <span className="group-open:rotate-180 transition-transform">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 text-brand-muted leading-relaxed text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding bg-brand-accent text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl mb-8">Reclaim your <br />attention today.</h2>
            <p className="text-white/80 text-lg mb-12">Join 50,000+ users who swapped the scroll for the soul. Start your 7-day free trial of Rewire Premium.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setIsChallengeModalOpen(true)} className="w-full sm:w-auto bg-white text-brand-accent px-10 py-5 rounded-button text-xl font-bold hover:scale-105 transition-all">
                Get Started Now
              </button>
              <button onClick={() => setIsChallengeModalOpen(true)} className="w-full sm:w-auto px-10 py-5 rounded-button text-xl font-bold border border-white/30 hover:bg-white/10 transition-all">
                Try a Challenge
              </button>
            </div>
            <p className="mt-8 text-white/50 text-xs uppercase tracking-widest font-semibold">No credit card required for trial</p>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-brand-border bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-accent rounded flex items-center justify-center">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="font-serif text-xl font-medium">Rewire</span>
          </div>
          <div className="flex gap-8 text-sm text-brand-muted">
            <a href="#" className="hover:text-brand-accent">Privacy</a>
            <a href="#" className="hover:text-brand-accent">Terms</a>
            <a href="#" className="hover:text-brand-accent">Contact</a>
            <a href="#" className="hover:text-brand-accent">Twitter</a>
          </div>
          <div className="text-xs text-brand-muted">© 2026 Rewire Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function Nav({ isMenuOpen, setIsMenuOpen, onGetStarted }: { isMenuOpen: boolean; setIsMenuOpen: (v: boolean) => void; onGetStarted: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="font-serif text-2xl font-medium">Rewire</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#how" className="hover:text-brand-accent transition-colors">How it works</a>
        <a href="#quests" className="hover:text-brand-accent transition-colors">Quests</a>
        <a href="#features" className="hover:text-brand-accent transition-colors">Features</a>
        <a href="#pricing" className="hover:text-brand-accent transition-colors">Pricing</a>
        <button onClick={onGetStarted} className="bg-brand-text text-white px-6 py-2 rounded-button hover:bg-brand-text/90 transition-all">Get Started</button>
      </div>
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
        {isMenuOpen ? <X /> : <Menu />}
      </button>
    </nav>
  );
}
