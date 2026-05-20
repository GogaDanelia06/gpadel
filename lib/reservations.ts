import fs from "fs";
import path from "path";
import { Reservation } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const RESERVATIONS_FILE = path.join(DATA_DIR, "reservations.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readReservations(): Reservation[] {
  ensureDataDir();
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(RESERVATIONS_FILE, "utf-8");
    return JSON.parse(raw) as Reservation[];
  } catch {
    return [];
  }
}

export function writeReservations(reservations: Reservation[]): void {
  ensureDataDir();
  fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), "utf-8");
}

export function addReservation(reservation: Reservation): void {
  const reservations = readReservations();
  reservations.push(reservation);
  writeReservations(reservations);
}

export function updateReservationStatus(
  id: string,
  status: Reservation["paymentStatus"],
  orderId?: string
): boolean {
  const reservations = readReservations();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  reservations[idx].paymentStatus = status;
  if (orderId) reservations[idx].orderId = orderId;
  writeReservations(reservations);
  return true;
}

export function getReservationsByDate(date: string): Reservation[] {
  return readReservations().filter((r) => r.date === date);
}

export function isSlotBooked(date: string, timeSlot: string): boolean {
  return readReservations().some(
    (r) =>
      r.date === date &&
      r.timeSlot === timeSlot &&
      r.paymentStatus !== "failed"
  );
}
