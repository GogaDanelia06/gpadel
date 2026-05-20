"use client";

export interface FilterState {
  from: string;
  to: string;
  court: "all" | "1" | "2";
  status: "all" | "paid" | "pending" | "failed" | "blocked";
  q: string;
}

interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onExport: () => void;
}

export default function Filters({ value, onChange, onExport }: FiltersProps) {
  return (
    <div className="bg-white border border-brand-line rounded-2xl p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-brand-gray font-semibold mb-1">
            From
          </label>
          <input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-brand-gray font-semibold mb-1">
            To
          </label>
          <input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Court
          </label>
          <select
            value={value.court}
            onChange={(e) =>
              onChange({ ...value, court: e.target.value as FilterState["court"] })
            }
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All</option>
            <option value="1">Court 1</option>
            <option value="2">Court 2</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Status
          </label>
          <select
            value={value.status}
            onChange={(e) =>
              onChange({ ...value, status: e.target.value as FilterState["status"] })
            }
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-[11px] uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Search
          </label>
          <input
            type="text"
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
            placeholder="name / phone / email"
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-brand-mute"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onExport}
            className="w-full px-3 py-2 border border-brand-line hover:border-primary-400 text-brand-ink hover:text-primary-500 font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
