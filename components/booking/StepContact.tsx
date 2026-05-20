"use client";

import { Language, translations } from "@/types";

interface StepContactProps {
  lang: Language;
  name: string;
  phone: string;
  email: string;
  players: 2 | 4;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPlayersChange: (v: 2 | 4) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepContact({
  lang,
  name,
  phone,
  email,
  players,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onPlayersChange,
  onNext,
  onBack,
}: StepContactProps) {
  const t = translations[lang];

  const canProceed =
    name.trim().length >= 2 &&
    phone.trim().length >= 6 &&
    email.includes("@");

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {t.book_your_name} <span className="text-green-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t.book_name_placeholder}
          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 focus:border-green-500 rounded-xl text-white placeholder-slate-500 outline-none transition-colors"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {t.book_your_phone} <span className="text-green-400">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={t.book_phone_placeholder}
          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 focus:border-green-500 rounded-xl text-white placeholder-slate-500 outline-none transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {t.book_your_email} <span className="text-green-400">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t.book_email_placeholder}
          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 focus:border-green-500 rounded-xl text-white placeholder-slate-500 outline-none transition-colors"
        />
      </div>

      {/* Players */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-3">
          {t.book_players} <span className="text-green-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {([2, 4] as const).map((n) => {
            const label = n === 2 ? t.book_players_2 : t.book_players_4;
            const sel = players === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onPlayersChange(n)}
                className={`
                  flex flex-col items-center justify-center gap-1 py-5 px-4 rounded-xl border-2 transition-all font-medium
                  ${sel
                    ? "border-green-500 bg-green-600/20 text-white"
                    : "border-slate-700/50 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                  }
                `}
              >
                <span className="text-2xl">{n === 2 ? "👥" : "👥👥"}</span>
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-slate-700/50 hover:border-slate-500 text-slate-400 hover:text-white font-semibold rounded-xl transition-all"
        >
          ← {t.book_back}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
        >
          {t.book_next} →
        </button>
      </div>
    </div>
  );
}
