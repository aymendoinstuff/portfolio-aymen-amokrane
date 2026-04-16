import { OfferCreateInput, repoCreateOffer } from "@/lib/repositories/contact";
import { NextResponse } from "next/server";
import { z } from "zod";


// ----------
// Validation (Zod)
// ----------
const OfferSchema = z.object({
  kind: z.enum(["collab", "job"]), // required
  name: z.string().min(2).max(120),
  email: z.string().email(),
  projectName: z.string().min(1).max(140),
  industry: z.string().min(1).max(140),
  budget: z.string().min(1).max(60), // e.g. "12k-20k"
  timeline: z.string().min(1).max(60), // e.g. "6-8 weeks"
  country: z.string().min(1).max(120), // e.g. "UAE"
  projectType: z.string().min(1).max(120),
  brief: z.string().min(1).max(5000),
  // optional linkage to your “priority” picker
  priorityKey: z
    .enum(["cafe", "esports", "fintech", "event", "logistics"])
    .optional(),
});

export async function POST(req: Request) {
  try {
    
    const json = await req.json();
    
    const parsed = OfferSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    const id = await repoCreateOffer(parsed.data as OfferCreateInput);
    console.log(id)
    return NextResponse.json({ id, status: "ok" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/contact] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
