"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      // Hard navigation so the browser sends the freshly-set cookie on the next
      // request. router.replace() would do a client-side nav and the middleware
      // wouldn't see the cookie in time, causing a redirect loop back to /login
      // (which manifests as a stuck "Signing in…" state).
      window.location.href = "/admin";
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 text-brand-ink hover:text-primary-500 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-400 flex items-center justify-center text-white font-black text-lg">
            G
          </div>
          <span className="text-2xl font-black">GPadel</span>
        </Link>

        <div className="bg-white border border-brand-line rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-brand-ink">Admin Sign In</h1>
            <p className="text-brand-gray text-sm mt-2">
              Enter the admin password to manage bookings.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="sr-only"
              >
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-3 bg-white border border-brand-line focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-xl text-brand-ink placeholder:text-brand-mute outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-6 py-3 bg-primary-400 hover:bg-primary-500 disabled:bg-brand-line disabled:text-brand-mute disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-mute mt-6">
          GPadel admin · authorized personnel only
        </p>
      </div>
    </div>
  );
}
