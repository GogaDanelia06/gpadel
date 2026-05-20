"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { PricingRule } from "@/types";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@/components/ui/Skeleton";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_KEYS = [1, 2, 3, 4, 5, 6, 7];

function formatHour(h: number): string {
  const normalized = h % 24;
  const wrap = h >= 24 ? " (+1d)" : "";
  return `${String(normalized).padStart(2, "0")}:00${wrap}`;
}

interface FormState {
  id?: string;
  label: string;
  days: number[];
  startHour: number;
  endHour: number;
  pricePerHour: number;
  fourPlayerMultiplier: number;
}

const EMPTY_FORM: FormState = {
  label: "",
  days: [1, 2, 3, 4, 5],
  startHour: 9,
  endHour: 17,
  pricePerHour: 40,
  fourPlayerMultiplier: 2,
};

export default function PricingRules() {
  const toast = useToast();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { rules: PricingRule[] };
        setRules(data.rules);
      } else {
        toast.error("Failed to load pricing rules");
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
    setEditing({ ...EMPTY_FORM });
  }

  function openEdit(rule: PricingRule) {
    setEditing({
      id: rule.id,
      label: rule.label,
      days: [...rule.days],
      startHour: rule.startHour,
      endHour: rule.endHour,
      pricePerHour: rule.pricePerHour,
      fourPlayerMultiplier: rule.fourPlayerMultiplier,
    });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const method = editing.id ? "PATCH" : "POST";
      const url = editing.id
        ? `/api/admin/pricing/${editing.id}`
        : "/api/admin/pricing";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editing.label,
          days: editing.days,
          startHour: editing.startHour,
          endHour: editing.endHour,
          pricePerHour: editing.pricePerHour,
          fourPlayerMultiplier: editing.fourPlayerMultiplier,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(editing.id ? "Rule updated" : "Rule created");
      setEditing(null);
      await load();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRule(id: string) {
    if (!confirm("Delete this pricing rule?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Rule deleted");
        setRules((rs) => rs.filter((r) => r.id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusyId(null);
    }
  }

  function toggleDay(d: number) {
    if (!editing) return;
    setEditing({
      ...editing,
      days: editing.days.includes(d)
        ? editing.days.filter((x) => x !== d)
        : [...editing.days, d].sort((a, b) => a - b),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-gray">
          Define which hours and days each price applies to.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary-400 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + Add rule
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-brand-line rounded-2xl p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 flex-1 max-w-[180px]" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="bg-white border border-brand-line rounded-2xl p-10 text-center text-brand-gray">
          No rules yet. Add your first pricing rule.
        </div>
      ) : (
        <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-surface text-brand-gray uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Label</th>
                  <th className="px-4 py-3 text-left font-semibold">Days</th>
                  <th className="px-4 py-3 text-left font-semibold">Hours</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Price/hr (2p)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    4p mult.
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {rules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-brand-surface/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-brand-ink font-medium">
                      {rule.label}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {DAY_KEYS.map((d, i) => {
                          const on = rule.days.includes(d);
                          return (
                            <span
                              key={d}
                              className={`w-6 h-6 inline-flex items-center justify-center text-[10px] font-bold rounded-md ${
                                on
                                  ? "bg-primary-50 text-primary-600"
                                  : "bg-brand-surface text-brand-mute"
                              }`}
                            >
                              {DAY_LABELS[i]}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-ink">
                      {formatHour(rule.startHour)}–
                      {formatHour(rule.endHour)}
                    </td>
                    <td className="px-4 py-3 text-brand-ink font-semibold">
                      {rule.pricePerHour}₾
                    </td>
                    <td className="px-4 py-3 text-brand-gray">
                      ×{rule.fourPlayerMultiplier}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEdit(rule)}
                        disabled={busyId === rule.id}
                        className="text-[12px] font-semibold px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:opacity-50"
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => deleteRule(rule.id)}
                        disabled={busyId === rule.id}
                        className="text-[12px] font-semibold px-2.5 py-1 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) cancelEdit();
          }}
        >
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl border border-brand-line max-w-lg w-full p-6 shadow-xl"
          >
            <h3 className="text-brand-ink font-bold text-lg mb-4">
              {editing.id ? "Edit rule" : "New pricing rule"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                  Label
                </label>
                <input
                  type="text"
                  required
                  value={editing.label}
                  onChange={(e) =>
                    setEditing({ ...editing, label: e.target.value })
                  }
                  placeholder="e.g. Weekend evening"
                  className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                  Days
                </label>
                <div className="flex gap-2">
                  {DAY_KEYS.map((d, i) => {
                    const on = editing.days.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                          on
                            ? "bg-primary-400 text-white"
                            : "bg-brand-surface text-brand-gray hover:bg-brand-line"
                        }`}
                      >
                        {DAY_LABELS[i]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    Start hour (0-25)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    required
                    value={editing.startHour}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        startHour: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    End hour (1-26)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={26}
                    required
                    value={editing.endHour}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        endHour: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
              <p className="text-[11px] text-brand-mute -mt-2">
                End above 24 means after-midnight (e.g. 26 = 02:00 next day).
                End is exclusive.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    Price / hour (2 players, ₾)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={editing.pricePerHour}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        pricePerHour: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
                    4-player multiplier
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    required
                    value={editing.fourPlayerMultiplier}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        fourPlayerMultiplier:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
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
                {saving ? "Saving…" : editing.id ? "Save changes" : "Create rule"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
