// 🎯 Full Page Loading Component

import Spinner from "./Spinner";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-brand-muted">{message}</p>
      </div>
    </div>
  );
}
