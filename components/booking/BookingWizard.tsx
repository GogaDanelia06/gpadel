"use client";

import { useState } from "react";
import { Language, translations, BookingState } from "@/types";
import StepDate from "./StepDate";
import StepContact from "./StepContact";
import StepPayment from "./StepPayment";

interface BookingWizardProps {
  lang: Language;
}

export default function BookingWizard({ lang }: BookingWizardProps) {
  const t = translations[lang];

  const [booking, setBooking] = useState<BookingState>({
    step: 1,
    date: "",
    timeSlot: "",
    name: "",
    phone: "",
    email: "",
    players: 2,
    paymentMethod: "bog",
  });

  const steps = [
    { num: 1, label: t.book_step1 },
    { num: 2, label: t.book_step2 },
    { num: 3, label: t.book_step3 },
  ];

  const goNext = () =>
    setBooking((b) => ({ ...b, step: (Math.min(b.step + 1, 3) as 1 | 2 | 3) }));
  const goBack = () =>
    setBooking((b) => ({ ...b, step: (Math.max(b.step - 1, 1) as 1 | 2 | 3) }));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          {/* Track */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-line z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary-400 z-0 transition-all duration-500"
            style={{ width: `${((booking.step - 1) / 2) * 100}%` }}
          />

          {steps.map((step) => {
            const done = booking.step > step.num;
            const active = booking.step === step.num;
            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${done ? "bg-primary-400 text-white" : ""}
                    ${active ? "bg-primary-400 text-white ring-4 ring-primary-100 scale-110" : ""}
                    ${!done && !active ? "bg-brand-line text-brand-gray" : ""}
                  `}
                >
                  {done ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`text-xs font-medium text-center max-w-[80px] leading-tight ${
                    active ? "text-primary-500" : done ? "text-brand-ink" : "text-brand-mute"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step panels */}
      <div className="bg-white border border-brand-line rounded-2xl shadow-sm p-6 sm:p-8">
        {booking.step === 1 && (
          <StepDate
            lang={lang}
            selectedDate={booking.date}
            selectedTime={booking.timeSlot}
            onDateChange={(d) => setBooking((b) => ({ ...b, date: d }))}
            onTimeChange={(t) => setBooking((b) => ({ ...b, timeSlot: t }))}
            onNext={goNext}
          />
        )}
        {booking.step === 2 && (
          <StepContact
            lang={lang}
            name={booking.name}
            phone={booking.phone}
            email={booking.email}
            players={booking.players}
            onNameChange={(v) => setBooking((b) => ({ ...b, name: v }))}
            onPhoneChange={(v) => setBooking((b) => ({ ...b, phone: v }))}
            onEmailChange={(v) => setBooking((b) => ({ ...b, email: v }))}
            onPlayersChange={(v) => setBooking((b) => ({ ...b, players: v }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {booking.step === 3 && (
          <StepPayment
            lang={lang}
            booking={booking}
            onPaymentMethodChange={(m) => setBooking((b) => ({ ...b, paymentMethod: m }))}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}
