import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import ChallengeCard from "./ChallengeCard";
import { useChallenge } from "../hooks/useChallenge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChallengeModal({ isOpen, onClose }: Props) {
  const { challenge, loading, refresh } = useChallenge();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full"
            >
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 text-white hover:text-brand-accent transition-colors"
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="bg-brand-bg rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif mb-2">Your First Micro-Win</h2>
                  <p className="text-brand-muted">
                    Take 60 seconds right now. No signup, no commitment.
                  </p>
                </div>

                <ChallengeCard
                  challenge={challenge}
                  loading={loading}
                  onRefresh={refresh}
                  onComplete={() => {}}
                />

                <div className="mt-6 text-center">
                  <p className="text-sm text-brand-muted">
                    Like this? Imagine replacing every scroll session with moments like these.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
