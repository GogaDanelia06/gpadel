"use client";

import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
}: StatCardProps) {
  return (
    <div className="bg-white border border-brand-line rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
          {icon}
        </div>
        {hint && (
          <span className="text-[11px] uppercase tracking-wider text-brand-mute">
            {hint}
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20 rounded-md" />
      ) : (
        <div className="text-3xl font-black text-brand-ink leading-none">
          {value}
        </div>
      )}
      <div className="mt-2 text-sm text-brand-gray">{label}</div>
    </div>
  );
}
