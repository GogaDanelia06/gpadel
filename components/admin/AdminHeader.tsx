"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 text-brand-ink hover:text-primary-500 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-400 flex items-center justify-center text-white font-black">
            G
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-black">GPadel</span>
            <span className="text-[10px] uppercase tracking-widest text-brand-mute">
              Admin
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-sm text-brand-gray">
            <span className="w-7 h-7 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center text-xs font-bold">
              G
            </span>
            GogaDanelia06
          </span>
          <Link
            href="/"
            className="text-sm text-brand-gray hover:text-primary-500 transition-colors"
          >
            View site
          </Link>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="px-3.5 py-2 text-sm font-semibold border border-brand-line hover:border-brand-gray text-brand-ink rounded-lg transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
