import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  variant?: "card" | "text" | "circle" | "button" | "dashboard";
  className?: string;
  count?: number;
}

export default function SkeletonLoader({ 
  variant = "card", 
  className = "",
  count = 1 
}: SkeletonLoaderProps) {
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
  };

  const SkeletonElement = ({ children }: { children: React.ReactNode }) => (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {children}
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case "text":
        return (
          <div className="space-y-2">
            <SkeletonElement>
              <div className="h-4 w-3/4" />
            </SkeletonElement>
            <SkeletonElement>
              <div className="h-4 w-1/2" />
            </SkeletonElement>
          </div>
        );

      case "circle":
        return (
          <SkeletonElement>
            <div className="w-12 h-12 rounded-full" />
          </SkeletonElement>
        );

      case "button":
        return (
          <SkeletonElement>
            <div className="h-10 w-24 rounded-lg" />
          </SkeletonElement>
        );

      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <SkeletonElement>
                <div className="h-8 w-1/3" />
              </SkeletonElement>
              <SkeletonElement>
                <div className="h-4 w-1/2" />
              </SkeletonElement>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonElement key={i}>
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-1/2" />
                    <div className="h-8 w-3/4" />
                    <div className="h-3 w-full" />
                  </div>
                </SkeletonElement>
              ))}
            </div>

            {/* Challenge card skeleton */}
            <SkeletonElement>
              <div className="p-8 space-y-4">
                <div className="flex justify-between">
                  <div className="h-3 w-1/4" />
                  <div className="h-3 w-16" />
                </div>
                <div className="h-6 w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 w-full" />
                  <div className="h-4 w-2/3" />
                </div>
                <div className="h-2 w-full rounded-full" />
                <div className="h-12 w-full rounded-lg" />
              </div>
            </SkeletonElement>
          </div>
        );

      default: // card
        return (
          <SkeletonElement>
            <div className="p-6 space-y-4">
              <div className="h-4 w-1/4" />
              <div className="h-6 w-3/4" />
              <div className="space-y-2">
                <div className="h-4 w-full" />
                <div className="h-4 w-2/3" />
              </div>
            </div>
          </SkeletonElement>
        );
    }
  };

  return (
    <div className="animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={count > 1 ? "mb-4" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}