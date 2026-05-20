import { DiscountCode } from "@/types";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "discount-codes.json");

export async function readCodes(): Promise<DiscountCode[]> {
  try {
    const data = await fs.readFile(FILE, "utf8");
    return JSON.parse(data) as DiscountCode[];
  } catch {
    return [];
  }
}

export async function writeCodes(codes: DiscountCode[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(codes, null, 2));
}

export async function findCode(input: string): Promise<DiscountCode | null> {
  const codes = await readCodes();
  return codes.find((c) => c.code === input.toUpperCase()) ?? null;
}

export function isValidCode(code: DiscountCode | null): code is DiscountCode {
  if (!code) return false;
  if (!code.active) return false;
  if (code.expiresAt && new Date(code.expiresAt) < new Date()) return false;
  if (code.maxUses != null && code.uses >= code.maxUses) return false;
  return true;
}

export function applyDiscount(
  subtotal: number,
  code: DiscountCode
): { discount: number; total: number } {
  let discount = 0;
  if (code.type === "percent") {
    discount = Math.round((subtotal * code.value) / 100);
  } else {
    discount = Math.min(code.value, subtotal);
  }
  return { discount, total: subtotal - discount };
}

export async function incrementUse(codeStr: string): Promise<void> {
  const codes = await readCodes();
  const idx = codes.findIndex((c) => c.code === codeStr.toUpperCase());
  if (idx >= 0) {
    codes[idx].uses += 1;
    await writeCodes(codes);
  }
}
