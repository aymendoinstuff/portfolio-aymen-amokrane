// app/login/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { getGoogleIdToken } from "@/lib/firebase/getGoogleIdToken";
import { loginAction } from "@/server/actions/auth";

function qp(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}
function reasonMsg(r?: string | null) {
  switch (r) {
    case "auth":
      return "Please sign in to continue.";
    case "expired":
      return "Your session expired. Please sign in again.";
    case "forbidden":
      return "This account doesn’t have admin access.";
    default:
      return null;
  }
}

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setMsg(reasonMsg(qp("reason"))), []);
  const nextPath = useMemo(() => {
    const raw = qp("next");
    return raw && raw.startsWith("/") ? raw : "/admin";
  }, []);

  const handleGoogle = async () => {
    if (busy) return;
    try {
      setBusy(true);
      const idToken = await getGoogleIdToken();
      const res = await loginAction(idToken, nextPath); // server sets cookie + redirects
      console.log(res)
      if (res?.ok === false) {
        setMsg(res.message || "Sign-in failed. Please try again.");
        setBusy(false);
      }
    } catch (e) {
      console.error(e);
      setMsg("Popup blocked or sign-in cancelled.");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[100vh] grid place-items-center px-4">
      <div className="max-w-sm w-full border-2 border-black rounded-xl p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm opacity-80 mt-1">
          Use your Google account. Admins are redirected to the dashboard.
        </p>

        {msg && (
          <p className="mt-3 text-sm p-2 border rounded bg-neutral-50">{msg}</p>
        )}

        <div className="mt-6">
          <button
            onClick={handleGoogle}
            disabled={busy}
            className="rounded-full border-2 border-black px-4 py-2 w-full disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in with Google"}
          </button>
        </div>
      </div>
    </main>
  );
}
