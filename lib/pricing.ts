import { PricingRule } from "@/types";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "pricing-rules.json");

const DEFAULT_RULES: PricingRule[] = [
  {
    id: "1",
    label: "Off-peak weekday",
    days: [1, 2, 3, 4, 5],
    startHour: 9,
    endHour: 17,
    pricePerHour: 40,
    fourPlayerMultiplier: 2,
  },
  {
    id: "2",
    label: "Weekday evening",
    days: [1, 2, 3, 4, 5],
    startHour: 17,
    endHour: 22,
    pricePerHour: 60,
    fourPlayerMultiplier: 2,
  },
  {
    id: "3",
    label: "Weekend",
    days: [6, 7],
    startHour: 9,
    endHour: 22,
    pricePerHour: 80,
    fourPlayerMultiplier: 2,
  },
  {
    id: "4",
    label: "Late night",
    days: [1, 2, 3, 4, 5, 6, 7],
    startHour: 22,
    endHour: 26,
    pricePerHour: 50,
    fourPlayerMultiplier: 2,
  },
];

export async function readPricingRules(): Promise<PricingRule[]> {
  try {
    const data = await fs.readFile(FILE, "utf8");
    return JSON.parse(data) as PricingRule[];
  } catch {
    await writePricingRules(DEFAULT_RULES);
    return DEFAULT_RULES;
  }
}

export async function writePricingRules(rules: PricingRule[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rules, null, 2));
}

export function priceForSlot(
  rules: PricingRule[],
  date: string,
  timeSlot: string,
  players: 4
): { price: number; ruleLabel: string } {
  const d = new Date(date + "T00:00:00");
  const jsDay = d.getDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;
  const hour = parseInt(timeSlot.split(":")[0], 10);
  const effectiveHour = hour < 9 ? hour + 24 : hour;

  for (const rule of rules) {
    if (!rule.days.includes(dayOfWeek)) continue;

    if (effectiveHour >= rule.startHour && effectiveHour < rule.endHour) {
      return {
        price: rule.pricePerHour * rule.fourPlayerMultiplier,
        ruleLabel: rule.label,
      };
    }
  }

  return {
    price: 120,
    ruleLabel: "Standard",
  };
}

export async function calculateBookingPrice(
  date: string,
  timeSlots: string[],
  players: 4
): Promise<{
  subtotal: number;
  breakdown: Array<{ time: string; price: number; ruleLabel: string }>;
}> {
  void date;
  void players;

  const breakdown = timeSlots.map((time) => ({
    time,
    price: 80,
    ruleLabel: "Fixed 4-player price",
  }));

  const subtotal = timeSlots.length * 80;

  return { subtotal, breakdown };
}