// 🎯 Reusable Stat Card Component

import { LucideIcon } from "lucide-react";
import AnimatedCard from "../premium/AnimatedCard";

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  description: string;
  delay?: number;
}

export default function StatCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  description,
  delay = 0,
}: StatCardProps) {
  return (
    <AnimatedCard className="flex h-full min-h-[10.5rem] flex-col justify-between bg-white p-4 md:p-5 shadow-lg" delay={delay}>
      <div className="w-full">
        <div className="mb-3 flex w-full items-center justify-between gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBgColor} md:h-10 md:w-10`}>
            <Icon className={`h-4 w-4 ${iconColor} md:h-5 md:w-5`} />
          </div>
        </div>
        <p className="text-2xl font-bold tabular-nums text-brand-text md:text-3xl">{value}</p>
      </div>
      <p className="text-xs text-brand-muted md:text-sm">{description}</p>
    </AnimatedCard>
  );
}
