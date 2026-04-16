/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.isAdmin)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const data = await req.formData();
  const offerId = String(data.get("offerId") || "");
  const to = String(data.get("to") || "");
  const subject = String(data.get("subject") || "");
  const body = String(data.get("body") || "");
  if (!offerId || !to || !subject || !body)
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const userS = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  if (!host || !userS || !pass || !from)
    return NextResponse.json({ error: "SMTP not configured" }, { status: 500 });
  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: { user: userS, pass },
  });
  try {
    const info = await transporter.sendMail({ from, to, subject, html: body });
    await adminDb
      .collection("offers")
      .doc(offerId)
      .set(
        {
          status: "responded",
          responseHistory: adminDb.FieldValue.arrayUnion({
            at: Date.now(),
            to,
            subject,
            body,
          }),
        },
        { merge: true } as any
      );
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "send failed" },
      { status: 500 }
    );
  }
}
