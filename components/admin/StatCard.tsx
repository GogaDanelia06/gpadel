"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
}

export default function StatCard({ label, value, hint, icon }: StatCardProps) {
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
      <div className="text-3xl font-black text-brand-ink leading-none">
        {value}
      </div>
      <div className="mt-2 text-sm text-brand-gray">{label}</div>
    </div>
  );
}
