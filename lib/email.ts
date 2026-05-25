import { Resend } from "resend";

interface SendBookingConfirmationArgs {
  to: string;
  customerName: string;
  date: string;
  timeSlots: string[];
  courtId: 1 | 2;
  players: 4;
  total: number;
  reservationId: string;
}

interface EmailTemplateArgs extends SendBookingConfirmationArgs {
  timeRange: string;
  courtLabel: string;
}

function orderIndex(s: string): number {
  const [h] = s.split(":");
  const n = parseInt(h, 10);
  // 09–23 -> 9..23 ; 00 -> 24 ; 01 -> 25
  return n >= 9 ? n : n + 24;
}

function formatTimeRange(timeSlots: string[]): string {
  if (timeSlots.length === 0) return "—";
  const sorted = [...timeSlots].sort((a, b) => orderIndex(a) - orderIndex(b));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const [lh] = last.split(":");
  const endHour = (parseInt(lh, 10) + 1) % 24;
  const end = `${String(endHour).padStart(2, "0")}:00`;
  return `${first} – ${end}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHTML(args: EmailTemplateArgs): string {
  const name = escapeHtml(args.customerName);
  const date = escapeHtml(args.date);
  const time = escapeHtml(args.timeRange);
  const court = escapeHtml(args.courtLabel);
  const id = escapeHtml(args.reservationId);
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("10 Grigol Abashidze St, Tskneti 0179, Georgia");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Booking Confirmed — GPadel</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F7F7F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#54595F;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F7F8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #E5E5E9;border-radius:16px;overflow:hidden;">
            <!-- Header with gradient -->
            <tr>
              <td style="background:linear-gradient(180deg,#ffffff 0%,#E8F8EC 100%);padding:40px 32px;text-align:center;">
                <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:#61CE70;line-height:64px;text-align:center;color:#ffffff;font-size:32px;font-weight:bold;">
                  ✓
                </div>
                <h1 style="margin:20px 0 8px;font-size:26px;color:#4FB45E;font-weight:800;">
                  Booking Confirmed
                </h1>
                <p style="margin:0;color:#7A7A7A;font-size:15px;">
                  Your padel court is reserved.
                </p>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:24px 32px 8px;">
                <p style="margin:0;font-size:16px;color:#54595F;">
                  Hi <strong>${name}</strong>,
                </p>
                <p style="margin:8px 0 0;font-size:15px;line-height:1.5;color:#7A7A7A;">
                  Thanks for booking with GPadel. Here are your reservation details:
                </p>
              </td>
            </tr>

            <!-- Details card -->
            <tr>
              <td style="padding:16px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F8;border:1px solid #E5E5E9;border-radius:12px;">
                  <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E5E9;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;">Date</div>
                    <div style="font-size:16px;color:#54595F;font-weight:600;margin-top:2px;">${date}</div>
                  </td></tr>
                  <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E5E9;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;">Time</div>
                    <div style="font-size:16px;color:#54595F;font-weight:600;margin-top:2px;">${time}</div>
                  </td></tr>
                  <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E5E9;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;">Court</div>
                    <div style="font-size:16px;color:#54595F;font-weight:600;margin-top:2px;">${court}</div>
                  </td></tr>
                  <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E5E9;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;">Players</div>
                    <div style="font-size:16px;color:#54595F;font-weight:600;margin-top:2px;">${args.players}</div>
                  </td></tr>
                  <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E5E9;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;">Total Paid</div>
                    <div style="font-size:20px;color:#4FB45E;font-weight:800;margin-top:2px;">${args.total}₾</div>
                  </td></tr>
                  <tr><td style="padding:14px 20px;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;">Reservation ID</div>
                    <div style="font-size:13px;color:#7A7A7A;font-family:monospace;margin-top:2px;word-break:break-all;">${id}</div>
                  </td></tr>
                </table>
              </td>
            </tr>

            <!-- Address -->
            <tr>
              <td style="padding:16px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #E5E5E9;border-radius:12px;">
                  <tr><td style="padding:16px 20px;">
                    <div style="font-size:12px;color:#A7AAAD;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Location</div>
                    <div style="font-size:15px;color:#54595F;line-height:1.5;">
                      10 გრიგოლ აბაშიძის ქუჩა,<br/>Tskneti 0179, Georgia
                    </div>
                    <a href="${mapsUrl}" style="display:inline-block;margin-top:10px;color:#4FB45E;font-size:14px;font-weight:600;text-decoration:none;">
                      Open in Google Maps →
                    </a>
                  </td></tr>
                </table>
              </td>
            </tr>

            <!-- Reschedule note -->
            <tr>
              <td style="padding:8px 32px 24px;">
                <p style="margin:0;font-size:14px;color:#7A7A7A;line-height:1.5;">
                  Need to reschedule? Call us at
                  <a href="tel:+995599261322" style="color:#4FB45E;text-decoration:none;font-weight:600;">+995 599 261 322</a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 32px;border-top:1px solid #E5E5E9;text-align:center;">
                <p style="margin:0;font-size:12px;color:#A7AAAD;">
                  GPadel · <a href="https://gpadel.ge" style="color:#A7AAAD;text-decoration:underline;">gpadel.ge</a>
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:18px 0 0;font-size:11px;color:#A7AAAD;">
            You're receiving this because you booked a court at GPadel.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendBookingConfirmation(
  args: SendBookingConfirmationArgs
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not set, skipping email");
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || "GPadel <onboarding@resend.dev>";

  const timeRange = formatTimeRange(args.timeSlots);
  const start = args.timeSlots.length > 0
    ? [...args.timeSlots].sort((a, b) => orderIndex(a) - orderIndex(b))[0]
    : "";
  const courtLabel =
    args.courtId === 1 ? "Court 1 (Outdoor)" : "Court 2 (Panorama)";

  const html = buildEmailHTML({ ...args, timeRange, courtLabel });

  await resend.emails.send({
    from,
    to: args.to,
    subject: `GPadel Booking Confirmed — ${args.date} ${start}`,
    html,
  });
}
