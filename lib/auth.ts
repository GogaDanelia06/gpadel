// Web-Crypto-based admin auth helpers.
// Uses globalThis.crypto so the same module is safe in Edge (middleware) and Node (route handlers).

export const ADMIN_COOKIE_NAME = "gpadel_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCrypto(): Crypto {
  // Available in Node 18+ and Edge runtime.
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || !c.subtle) {
    throw new Error("Web Crypto API is not available in this runtime");
  }
  return c;
}

function utf8ToArrayBuffer(str: string): ArrayBuffer {
  const u8 = new TextEncoder().encode(str);
  const ab = new ArrayBuffer(u8.byteLength);
  new Uint8Array(ab).set(u8);
  return ab;
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return ab;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  const normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary =
    typeof atob !== "undefined"
      ? atob(normalized)
      : Buffer.from(normalized, "base64").toString("binary");
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Set it in .env.local before using admin auth."
    );
  }
  return secret;
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const c = getCrypto();
  const key = await c.subtle.importKey(
    "raw",
    utf8ToArrayBuffer(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await c.subtle.sign("HMAC", key, utf8ToArrayBuffer(message));
  return new Uint8Array(sig);
}

async function sha256(message: string): Promise<Uint8Array> {
  const c = getCrypto();
  const digest = await c.subtle.digest("SHA-256", utf8ToArrayBuffer(message));
  return new Uint8Array(digest);
}

export async function verifyPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error("[auth] ADMIN_PASSWORD not configured");
    return false;
  }
  if (typeof input !== "string" || input.length === 0) return false;
  const a = await sha256(input);
  const b = await sha256(expected);
  return timingSafeEqualBytes(a, b);
}

interface SessionPayload {
  exp: number;
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const header = { alg: "HS256", typ: "JWT" };
  const payload: SessionPayload = {
    exp: Date.now() + SESSION_TTL_MS,
  };
  const headerB64 = bytesToBase64Url(new Uint8Array(utf8ToArrayBuffer(JSON.stringify(header))));
  const payloadB64 = bytesToBase64Url(new Uint8Array(utf8ToArrayBuffer(JSON.stringify(payload))));
  const signingInput = `${headerB64}.${payloadB64}`;
  const sig = await hmacSha256(secret, signingInput);
  const sigB64 = bytesToBase64Url(sig);
  return `${signingInput}.${sigB64}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, sigB64] = parts;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }

  let expected: Uint8Array;
  try {
    expected = await hmacSha256(secret, `${headerB64}.${payloadB64}`);
  } catch {
    return false;
  }

  let provided: Uint8Array;
  try {
    provided = base64UrlToBytes(sigB64);
  } catch {
    return false;
  }
  if (!timingSafeEqualBytes(expected, provided)) return false;

  try {
    const payloadBytes = base64UrlToBytes(payloadB64);
    const payloadStr = new TextDecoder().decode(bytesToArrayBuffer(payloadBytes));
    const payload = JSON.parse(payloadStr) as Partial<SessionPayload>;
    if (typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}
