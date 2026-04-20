import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";
import { sendBookingNotification } from "@/lib/email/notify";

const BookingSchema = z.object({
  type: z.enum(["wishlist", "branding", "11-meet", "brand-audit", "team-training", "inquiry", "service"]),
  serviceId: z.string().optional(),
  serviceTitle: z.string().optional(),

  // Common fields
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().optional(),

  // Wishlist
  projectTitle: z.string().optional(),
  location: z.string().optional(),
  concept: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),

  // Branding
  brandName: z.string().optional(),
  industry: z.string().optional(),
  selectedTier: z.string().optional(),
  brief: z.string().optional(),

  // 1/1 Meet
  background: z.string().optional(),
  helpTopic: z.string().optional(),
  frequency: z.string().optional(),

  // Brand Audit
  website: z.string().optional(),
  issues: z.string().optional(),
  goals: z.string().optional(),

  // Team Training
  companyName: z.string().optional(),
  teamSize: z.string().optional(),
  workshopTopic: z.string().optional(),
  format: z.string().optional(),

  // Inquiry
  subject: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    await adminDb.collection("bookings").add({
      ...data,
      status: "new",
      createdAt: Date.now(),
      readAt: null,
    });

    // Fire-and-forget email — never blocks the response
    sendBookingNotification(data as Record<string, unknown>);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/public/booking] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
