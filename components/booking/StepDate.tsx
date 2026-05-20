"use client";

import { useState, useEffect } from "react";
import { format, addDays, isBefore, startOfDay, isToday, isSameDay } from "date-fns";
import { Language, translations } from "@/types";

interface StepDateProps {
  lang: Language;
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  // 09:00 to 01:00 (next day) inclusive — 17 slots
  for (let h = 9; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  slots.push("00:00");
  slots.push("01:00");
  return slots;
}

function generateCalendarDays(viewDate: Date): Date[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];
  // pad start
  const startPad = (firstDay.getDay() + 6) % 7; // Monday-first
  for (let i = startPad - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  // month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // pad end to multiple of 7
  while (days.length % 7 !== 0) {
    days.push(new Date(year, month + 1, days.length - lastDay.getDate() - startPad + 1));
  }
  return days;
}

const WEEKDAYS_KA = ["ორ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];
const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS_KA = [
  "იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი",
  "ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი",
];
const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function StepDate({
  lang,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onNext,
}: StepDateProps) {
  const t = translations[lang];
  const [viewDate, setViewDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const today = startOfDay(new Date());
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/reservations?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(data.bookedSlots || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const calDays = generateCalendarDays(viewDate);
  const weekdays = lang === "ka" ? WEEKDAYS_KA : WEEKDAYS_EN;
  const months = lang === "ka" ? MONTHS_KA : MONTHS_EN;

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDayClick = (day: Date) => {
    if (isBefore(startOfDay(day), today)) return;
    if (day.getMonth() !== viewDate.getMonth()) return;
    onDateChange(format(day, "yyyy-MM-dd"));
    onTimeChange("");
  };

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="space-y-8">
      {/* Date picker */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4">{t.book_select_date}</h3>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              disabled={viewDate <= today}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h4 className="text-white font-bold text-base">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h4>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-slate-500 text-xs font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, idx) => {
              const isCurrentMonth = day.getMonth() === viewDate.getMonth();
              const isPast = isBefore(startOfDay(day), today);
              const isSel = selectedDate === format(day, "yyyy-MM-dd");
              const isT = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  disabled={isPast || !isCurrentMonth}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                    ${!isCurrentMonth ? "opacity-20 cursor-default" : ""}
                    ${isPast && isCurrentMonth ? "text-slate-600 cursor-not-allowed" : ""}
                    ${!isPast && isCurrentMonth && !isSel ? "text-slate-300 hover:bg-slate-700 hover:text-white" : ""}
                    ${isSel ? "bg-green-600 text-white font-bold shadow-lg shadow-green-900/50" : ""}
                    ${isT && !isSel ? "ring-1 ring-green-500 text-green-400" : ""}
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">{t.book_select_time}</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-green-600" /> {t.book_available}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-slate-700" /> {t.book_booked}
              </span>
            </div>
          </div>

          {loadingSlots ? (
            <div className="text-center py-8 text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {timeSlots.map((slot) => {
                const booked = bookedSlots.includes(slot);
                const sel = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => !booked && onTimeChange(slot)}
                    disabled={booked}
                    className={`
                      py-2.5 px-3 rounded-lg text-sm font-medium transition-all
                      ${booked ? "bg-slate-700/50 text-slate-600 cursor-not-allowed" : ""}
                      ${!booked && !sel ? "bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:border-green-500/50 hover:text-white" : ""}
                      ${sel ? "bg-green-600 text-white border-transparent shadow-lg shadow-green-900/40" : ""}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
        >
          {t.book_next}
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}
