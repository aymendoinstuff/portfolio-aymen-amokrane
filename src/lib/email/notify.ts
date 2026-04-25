/**
 * Email notifications via Gmail SMTP (nodemailer).
 * Falls back to Resend if SMTP credentials are absent.
 *
 * Env vars needed (all present in .env.local):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   NOTIFY_EMAIL  — where to send admin notifications
 *   RESEND_API_KEY — fallback
 */

import nodemailer from "nodemailer";

const NOTIFY_EMAIL  = process.env.NOTIFY_EMAIL  ?? "admin@stuffbyaymen.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// ── SMTP transport (Gmail) ────────────────────────────────────

function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ── Email template ────────────────────────────────────────────

function buildEmail(data: Record<string, unknown>, source: "inquiry" | "booking") {
  const name  = String(data.name  ?? "Unknown");
  const email = String(data.email ?? "");

  const sourceLabels: Record<string, string> = {
    wishlist:        "Wishlist Project Request",
    branding:        "Branding Enquiry",
    "11-meet":       "1/1 Meet Request",
    "brand-audit":   "Brand Audit Request",
    "team-training": "Team Training Request",
    service:         "Service Booking",
    inquiry:         "General Inquiry",
    collab:          "Collab Request",
    job:             "Job Inquiry",
  };

  const typeKey  = String(data.type ?? data.kind ?? (source === "inquiry" ? "collab" : "inquiry"));
  const label    = sourceLabels[typeKey] ?? (source === "inquiry" ? "New Inquiry" : "New Booking");
  const subject  = `[stuffbyaymen.com] ${label} from ${name}`;

  const skipKeys = new Set(["type", "kind", "status", "createdAt", "updatedAt", "readAt"]);
  const rows = Object.entries(data)
    .filter(([k, v]) => !skipKeys.has(k) && v !== null && v !== undefined && String(v).trim() !== "")
    .map(([k, v]) =>
      `<tr>
        <td style="padding:6px 12px;background:#f9f9f9;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#888;white-space:nowrap;border-bottom:1px solid #eee">${k}</td>
        <td style="padding:6px 12px;font-size:14px;color:#111;border-bottom:1px solid #eee">${String(v)}</td>
      </tr>`
    )
    .join("");

  const sourceColor = source === "inquiry" ? "#0ea5e9" : "#7c3aed";
  const sourceLabel = source === "inquiry" ? "Inquiry" : "Booking";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">
      <div style="background:#111;padding:24px 28px">
        <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888">stuffbyaymen.com</p>
        <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em">${label}</h1>
          <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:${sourceColor}20;color:${sourceColor};border:1px solid ${sourceColor}40;letter-spacing:0.05em">${sourceLabel}</span>
        </div>
      </div>
      <div style="padding:24px 28px">
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">
          ${rows}
        </table>
        <div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px">
          <p style="margin:0;font-size:12px;color:#888">Reply to reach <strong>${name}</strong> at <a href="mailto:${email}" style="color:#111">${email}</a></p>
        </div>
        <div style="margin-top:12px">
          <a href="https://www.stuffbyaymen.com/admin/inbox" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none">
            View in Inbox →
          </a>
        </div>
      </div>
    </div>
  `;

  return { subject, html, replyTo: email };
}

// ── Send via SMTP ─────────────────────────────────────────────

async function sendViaSmtp(
  subject: string,
  html: string,
  replyTo: string
): Promise<boolean> {
  const transport = getSmtpTransport();
  if (!transport) return false;

  try {
    await transport.sendMail({
      from: `"Stuff by Aymen" <${process.env.SMTP_USER}>`,
      to:   NOTIFY_EMAIL,
      replyTo,
      subject,
      html,
    });
    console.log(`[email/smtp] Sent → ${NOTIFY_EMAIL}`);
    return true;
  } catch (err) {
    console.error("[email/smtp] Failed:", err);
    return false;
  }
}

// ── Send via Resend (fallback) ────────────────────────────────

async function sendViaResend(
  subject: string,
  html: string,
  replyTo: string
): Promise<boolean> {
  if (!RESEND_API_KEY) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Stuff by Aymen <onboarding@resend.dev>",
        to:   [NOTIFY_EMAIL],
        reply_to: replyTo,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[email/resend] Error:", await res.text());
      return false;
    }
    console.log(`[email/resend] Sent → ${NOTIFY_EMAIL}`);
    return true;
  } catch (err) {
    console.error("[email/resend] Failed:", err);
    return false;
  }
}

// ── Public API ────────────────────────────────────────────────

export async function sendNotification(
  data: Record<string, unknown>,
  source: "inquiry" | "booking" = "booking"
) {
  const { subject, html, replyTo } = buildEmail(data, source);

  // Try SMTP first (sends from your own Gmail), fall back to Resend
  const sent = await sendViaSmtp(subject, html, replyTo);
  if (!sent) await sendViaResend(subject, html, replyTo);
}

/** Legacy alias used by the booking route */
export async function sendBookingNotification(data: Record<string, unknown>) {
  return sendNotification(data, "booking");
}
