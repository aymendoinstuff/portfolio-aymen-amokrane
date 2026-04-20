/**
 * Email notification utility using nodemailer.
 *
 * Required env vars (add to .env.local + Vercel):
 *   SMTP_HOST     — e.g. smtp.gmail.com  |  smtp.zoho.com
 *   SMTP_PORT     — 587 (TLS) or 465 (SSL)
 *   SMTP_USER     — your full email address used to send
 *   SMTP_PASS     — app password (not your login password)
 *   NOTIFY_EMAIL  — where to receive notifications (hello@stuffbyaymen.com)
 */

import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  NOTIFY_EMAIL = "hello@stuffbyaymen.com",
} = process.env;

function createTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function formatBookingEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const type = String(data.type ?? "inquiry");
  const name = String(data.name ?? "Unknown");
  const email = String(data.email ?? "");

  const typeLabels: Record<string, string> = {
    wishlist: "Wishlist Project Request",
    branding: "Branding Enquiry",
    "11-meet": "1/1 Meet Request",
    "brand-audit": "Brand Audit Request",
    "team-training": "Team Training Request",
    service: "Service Booking",
    inquiry: "General Inquiry",
  };

  const label = typeLabels[type] ?? "New Booking";
  const subject = `[stuffbyaymen.com] ${label} from ${name}`;

  const rows = Object.entries(data)
    .filter(([k]) => !["type"].includes(k))
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:6px 12px;background:#f9f9f9;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#888;white-space:nowrap;border-bottom:1px solid #eee">${k}</td>
          <td style="padding:6px 12px;font-size:14px;color:#111;border-bottom:1px solid #eee">${String(v ?? "—")}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">
      <div style="background:#111;padding:24px 28px">
        <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888">stuffbyaymen.com</p>
        <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em">${label}</h1>
      </div>
      <div style="padding:24px 28px">
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">
          ${rows}
        </table>
        <div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px">
          <p style="margin:0;font-size:12px;color:#888">Reply directly to this email to reach <strong>${name}</strong> at <a href="mailto:${email}" style="color:#111">${email}</a></p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}

export async function sendBookingNotification(data: Record<string, unknown>) {
  const transport = createTransport();

  if (!transport) {
    // SMTP not configured — log so it's visible in server logs
    console.warn("[email] SMTP not configured. Booking data:", data);
    return;
  }

  const { subject, html } = formatBookingEmail(data);

  try {
    await transport.sendMail({
      from: `"Stuff by Aymen" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: String(data.email ?? SMTP_USER),
      subject,
      html,
    });
    console.log(`[email] Notification sent → ${NOTIFY_EMAIL}`);
  } catch (err) {
    // Never crash the booking request because of email failure
    console.error("[email] Failed to send notification:", err);
  }
}
