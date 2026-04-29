// 🎯 Empty State Component

import { LucideIcon } from "lucide-react";
import AnimatedCard from "../premium/AnimatedCard";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <AnimatedCard className="bg-white p-12 text-center shadow-lg">
      <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-brand-muted" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-brand-text">{title}</h3>
      <p className="text-brand-muted mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-brand-accent text-white rounded-button hover:bg-brand-accent-hover transition-colors"
        >
          {action.label}
        </button>
      )}
    </AnimatedCard>
  );
}
