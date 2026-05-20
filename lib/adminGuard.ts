import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

/**
 * Returns null when the request is authorized, otherwise a 401 NextResponse.
 * Use as the first line of every admin API route handler:
 *
 *     const unauthorized = await requireAdmin(request);
 *     if (unauthorized) return unauthorized;
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token);
  if (!ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
