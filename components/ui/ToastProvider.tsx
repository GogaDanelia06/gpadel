"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  show: (type: ToastType, message: string) => void;
  success: (m: string) => void;
  error: (m: string) => void;
  info: (m: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_MS = 3500;
const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((arr) => arr.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, type, message }].slice(-MAX_VISIBLE));
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, DISMISS_MS);
    },
    []
  );

  const success = useCallback((m: string) => show("success", m), [show]);
  const error = useCallback((m: string) => show("error", m), [show]);
  const info = useCallback((m: string) => show("info", m), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => {
          const borderColor =
            t.type === "success"
              ? "border-primary-400"
              : t.type === "error"
              ? "border-red-400"
              : "border-brand-blue";
          const iconBg =
            t.type === "success"
              ? "bg-primary-50 text-primary-500"
              : t.type === "error"
              ? "bg-red-50 text-red-500"
              : "bg-blue-50 text-brand-blue";
          const iconChar =
            t.type === "success" ? "✓" : t.type === "error" ? "!" : "i";
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => dismiss(t.id)}
              className={`pointer-events-auto bg-white rounded-xl shadow-lg border border-brand-line border-l-4 ${borderColor} px-4 py-3 min-w-[280px] max-w-sm flex items-center gap-3 cursor-pointer text-left animate-slide-up hover:shadow-xl transition-shadow`}
              aria-label="Dismiss notification"
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${iconBg}`}
                aria-hidden="true"
              >
                {iconChar}
              </span>
              <span className="text-sm font-medium text-brand-ink flex-1">
                {t.message}
              </span>
            </button>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
