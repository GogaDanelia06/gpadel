"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import ReservationTable from "@/components/admin/ReservationTable";
import WeekGrid from "@/components/admin/WeekGrid";
import BlockForm from "@/components/admin/BlockForm";
import Filters, { FilterState } from "@/components/admin/Filters";
import { Reservation } from "@/types";

type Tab = "today" | "week" | "all" | "block";

interface Stats {
  todayCount: number;
  weekCount: number;
  todayRevenue: number;
  pendingCount: number;
}

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mondayOfThisWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("today");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);

  const [todayList, setTodayList] = useState<Reservation[]>([]);
  const [weekList, setWeekList] = useState<Reservation[]>([]);

  // All Bookings tab state
  const [filters, setFilters] = useState<FilterState>({
    from: "",
    to: "",
    court: "all",
    status: "all",
    q: "",
  });
  const [allList, setAllList] = useState<Reservation[]>([]);
  const [allLoading, setAllLoading] = useState(false);

  // Block tab state
  const [blockCounter, setBlockCounter] = useState(0);
  const [prefillSlot, setPrefillSlot] = useState<{
    date: string;
    start: string;
    courtId: 1 | 2;
  } | null>(null);

  const weekStart = useMemo(() => mondayOfThisWeek(), []);
  const weekStartStr = useMemo(() => toDateOnly(weekStart), [weekStart]);
  const weekEndStr = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    return toDateOnly(end);
  }, [weekStart]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) {
        setStatsErr("Failed to load stats");
        return;
      }
      const data = (await res.json()) as Stats;
      setStats(data);
      setStatsErr(null);
    } catch {
      setStatsErr("Network error");
    }
  }, []);

  const fetchToday = useCallback(async () => {
    const res = await fetch(`/api/admin/reservations?date=${todayStr()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { reservations: Reservation[] };
      setTodayList(data.reservations);
    }
  }, []);

  const fetchWeek = useCallback(async () => {
    const res = await fetch(
      `/api/admin/reservations?from=${weekStartStr}&to=${weekEndStr}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = (await res.json()) as { reservations: Reservation[] };
      setWeekList(data.reservations);
    }
  }, [weekStartStr, weekEndStr]);

  const fetchAll = useCallback(async () => {
    setAllLoading(true);
    const params = new URLSearchParams();
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.court !== "all") params.set("court", filters.court);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);
    try {
      const res = await fetch(`/api/admin/reservations?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { reservations: Reservation[] };
        setAllList(data.reservations);
      }
    } finally {
      setAllLoading(false);
    }
  }, [filters]);

  // Initial loads
  useEffect(() => {
    fetchStats();
    fetchToday();
    fetchWeek();
  }, [fetchStats, fetchToday, fetchWeek]);

  // Refetch All when filters change (debounce search a bit)
  useEffect(() => {
    if (tab !== "all") return;
    const t = setTimeout(() => {
      fetchAll();
    }, 200);
    return () => clearTimeout(t);
  }, [tab, fetchAll]);

  const refreshAll = useCallback(() => {
    fetchStats();
    fetchToday();
    fetchWeek();
    if (tab === "all") fetchAll();
  }, [fetchStats, fetchToday, fetchWeek, fetchAll, tab]);

  const exportCsv = () => {
    window.open("/api/admin/reservations/export", "_blank");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "week", label: "Week" },
    { id: "all", label: "All Bookings" },
    { id: "block", label: "Block Time" },
  ];

  return (
    <div className="min-h-screen bg-brand-surface">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Today's bookings"
            value={stats?.todayCount ?? "—"}
            hint="Today"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            label="This week"
            value={stats?.weekCount ?? "—"}
            hint="Week"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            }
          />
          <StatCard
            label="Today's revenue"
            value={`${stats?.todayRevenue ?? 0}₾`}
            hint="Paid"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0 0v2m0-10V6m9 6a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Pending payments"
            value={stats?.pendingCount ?? "—"}
            hint="Pending"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </section>

        {statsErr && (
          <div className="text-sm text-red-600">{statsErr}</div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-brand-line">
          {tabs.map((tb) => {
            const active = tab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "text-primary-500"
                    : "text-brand-gray hover:text-brand-ink"
                }`}
              >
                {tb.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "today" && (
          <ReservationTable
            reservations={todayList}
            onChange={refreshAll}
            emptyHint="No bookings today."
          />
        )}

        {tab === "week" && (
          <WeekGrid
            reservations={weekList}
            weekStart={weekStart}
            onEmptyClick={(date, slot, courtId) => {
              setPrefillSlot({ date, start: slot, courtId });
              setTab("block");
            }}
          />
        )}

        {tab === "all" && (
          <div className="space-y-4">
            <Filters value={filters} onChange={setFilters} onExport={exportCsv} />
            {allLoading ? (
              <div className="text-center py-10 text-brand-gray">Loading…</div>
            ) : (
              <ReservationTable
                reservations={allList}
                onChange={() => {
                  fetchAll();
                  fetchStats();
                }}
                emptyHint="No reservations match these filters."
              />
            )}
          </div>
        )}

        {tab === "block" && (
          <div className="max-w-xl">
            <BlockForm
              key={blockCounter}
              initialCourtId={prefillSlot?.courtId}
              initialDate={prefillSlot?.date}
              initialStart={prefillSlot?.start}
              onCreated={() => {
                setBlockCounter((n) => n + 1);
                setPrefillSlot(null);
                refreshAll();
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
