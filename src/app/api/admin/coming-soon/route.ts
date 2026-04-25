import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdminApi } from "@/server/auth/apiGuard";

/** GET — returns current comingSoon state */
export async function GET() {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const snap = await adminDb.collection("site").doc("settings").get();
    const comingSoon = snap.exists ? (snap.data()?.comingSoon ?? false) : false;
    return NextResponse.json({ comingSoon });
  } catch {
    return NextResponse.json({ comingSoon: false });
  }
}

/** POST { comingSoon: boolean } — sets the flag */
export async function POST(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const { comingSoon } = await req.json();
    await adminDb
      .collection("site")
      .doc("settings")
      .set({ comingSoon: Boolean(comingSoon) }, { merge: true });
    return NextResponse.json({ ok: true, comingSoon: Boolean(comingSoon) });
  } catch (err) {
    console.error("[coming-soon] POST error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
