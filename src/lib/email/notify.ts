/**
 * Email notifications via Resend (https://resend.com)
 * Uses fetch directly — no extra package needed.
 *
 * Required env var: RESEND_API_KEY
 * Optional:         NOTIFY_EMAIL (defaults to hello@stuffbyaymen.com)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "hello@stuffbyaymen.com";
// Resend requires a verified sender domain. Using onboarding@resend.dev works
// on the free plan for testing. Once you verify stuffbyaymen.com in Resend dashboard,
// change this to: hello@stuffbyaymen.com
const FROM_EMAIL = "Stuff by Aymen <onboarding@resend.dev>";

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
    .filter(([k]) => k !== "type")
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
          <p style="margin:0;font-size:12px;color:#888">Reply to this email to reach <strong>${name}</strong> at <a href="mailto:${email}" style="color:#111">${email}</a></p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}

export async function sendBookingNotification(data: Record<string, unknown>) {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const { subject, html } = formatBookingEmail(data);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_EMAIL],
        reply_to: String(data.email ?? NOTIFY_EMAIL),
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", err);
    } else {
      console.log(`[email] Sent via Resend → ${NOTIFY_EMAIL}`);
    }
  } catch (err) {
    console.error("[email] Failed to send:", err);
  }
}
