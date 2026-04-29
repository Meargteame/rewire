import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: Props) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        await signup(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-md w-full"
            >
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 text-white hover:text-brand-accent transition-colors"
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif mb-2">
                    {mode === "login" ? "Welcome Back" : "Start Your Journey"}
                  </h2>
                  <p className="text-brand-muted">
                    {mode === "login"
                      ? "Log in to track your progress and streaks"
                      : "Create an account to save your micro-wins"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                          placeholder="Your name"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                    </div>
                    {mode === "signup" && (
                      <p className="text-xs text-brand-muted mt-1">At least 6 characters</p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-accent text-white rounded-lg font-medium hover:bg-brand-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      setError("");
                    }}
                    className="text-sm text-brand-muted hover:text-brand-accent transition-colors"
                  >
                    {mode === "login"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Log in"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
