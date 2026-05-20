"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { DiscountCode } from "@/types";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@/components/ui/Skeleton";

interface NewCodeForm {
  code: string;
  type: "percent" | "fixed";
  value: number;
  maxUses?: number | null;
  expiresAt?: string;
}

const EMPTY_FORM: NewCodeForm = {
  code: "",
  type: "percent",
  value: 10,
  maxUses: null,
  expiresAt: "",
};

function statusOf(c: DiscountCode): {
  label: string;
  className: string;
} {
  if (!c.active) {
    return {
      label: "Disabled",
      className: "bg-brand-line text-brand-gray",
    };
  }
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) {
    return {
      label: "Expired",
      className: "bg-amber-50 text-amber-600",
    };
  }
  if (c.maxUses != null && c.uses >= c.maxUses) {
    return {
      label: "Used up",
      className: "bg-amber-50 text-amber-600",
    };
  }
  return {
    label: "Active",
    className: "bg-primary-50 text-primary-600",
  };
}

export default function DiscountCodes() {
  const toast = useToast();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<NewCodeForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyCode, setBusyCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discount-codes", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { codes: DiscountCode[] };
        setCodes(data.codes);
      } else {
        toast.error("Failed to load codes");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setCreating({ ...EMPTY_FORM });
  }

  function cancelCreate() {
    setCreating(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!creating) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        code: creating.code,
        type: creating.type,
        value: creating.value,
        active: true,
      };
      if (creating.maxUses && creating.maxUses > 0)
        payload.maxUses = creating.maxUses;
      if (creating.expiresAt) payload.expiresAt = creating.expiresAt;

      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success("Code created");
      setCreating(null);
      await load();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c: DiscountCode) {
    setBusyCode(c.code);
    try {
      const res = await fetch(`/api/admin/discount-codes/${c.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !c.active }),
      });
      if (res.ok) {
        toast.success(c.active ? "Code disabled" : "Code enabled");
        await load();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusyCode(null);
    }
  }

  async function deleteCode(code: string) {
    if (!confirm(`Delete code ${code}?`)) return;
    setBusyCode(code);
    try {
      const res = await fetch(`/api/admin/discount-codes/${code}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Code deleted");
        setCodes((cs) => cs.filter((c) => c.code !== code));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusyCode(null);
    }
  }

  function formatExpiry(c: DiscountCode): string {
    if (!c.expiresAt) return "—";
    try {
      return new Date(c.expiresAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return c.expiresAt;
    }
  }

  function formatValue(c: DiscountCode): string {
    return c.type === "percent" ? `${c.value}%` : `${c.value}₾`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-gray">
          Create promo codes customers can redeem at checkout.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary-400 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + Add code
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-brand-line rounded-2xl p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : codes.length === 0 ? (
        <div className="bg-white border border-brand-line rounded-2xl p-10 text-center text-brand-gray">
          No codes yet. Create your first discount.
        </div>
      ) : (
        <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-surface text-brand-gray uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Code</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Value</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Uses / Max
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Expires</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {codes.map((c) => {
                  const st = statusOf(c);
                  return (
                    <tr
                      key={c.code}
                      className="hover:bg-brand-surface/60 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-brand-ink font-semibold">
                        {c.code}
                      </td>
                      <td className="px-4 py-3 text-brand-gray capitalize">
                        {c.type}
                      </td>
                      <td className="px-4 py-3 text-brand-ink font-semibold">
                        {formatValue(c)}
                      </td>
                      <td className="px-4 py-3 text-brand-gray">
                        {c.uses}
                        {c.maxUses != null ? ` / ${c.maxUses}` : ""}
                      </td>
                      <td className="px-4 py-3 text-brand-gray">
                        {formatExpiry(c)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${st.className}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleActive(c)}
                          disabled={busyCode === c.code}
                          className="text-[12px] font-semibold px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:opacity-50"
                        >
                          {c.active ? "Disable" : "Enable"}
                        </button>{" "}
                        <button
                          type="button"
                          onClick={() => deleteCode(c.code)}
                          disabled={busyCode === c.code}
                          className="text-[12px] font-semibold px-2.5 py-1 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create modal */}
      {creating && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) cancelCreate();
          }}
        >
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl border border-brand-line max-w-md w-full p-6 shadow-xl"
          >
            <h3 className="text-brand-ink font-bold text-lg mb-4">
              New discount code
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                  Code
                </label>
                <input
                  type="text"
                  required
                  value={creating.code}
                  onChange={(e) =>
                    setCreating({
                      ...creating,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  placeholder="SUMMER25"
                  className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm font-mono text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    Type
                  </label>
                  <select
                    value={creating.type}
                    onChange={(e) =>
                      setCreating({
                        ...creating,
                        type: e.target.value as "percent" | "fixed",
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed (₾)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={creating.type === "percent" ? 100 : undefined}
                    required
                    value={creating.value}
                    onChange={(e) =>
                      setCreating({
                        ...creating,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    Max uses (optional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={creating.maxUses ?? ""}
                    onChange={(e) =>
                      setCreating({
                        ...creating,
                        maxUses: e.target.value
                          ? parseInt(e.target.value, 10)
                          : null,
                      })
                    }
                    placeholder="∞"
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-brand-mute"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    Expires (optional)
                  </label>
                  <input
                    type="date"
                    value={creating.expiresAt || ""}
                    onChange={(e) =>
                      setCreating({ ...creating, expiresAt: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelCreate}
                disabled={saving}
                className="px-4 py-2 border border-brand-line hover:border-brand-gray text-brand-gray hover:text-brand-ink font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-primary-400 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-colors"
              >
                {saving ? "Saving…" : "Create code"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
