"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export async function getGoogleIdToken(): Promise<string> {
  await signInWithPopup(auth, googleProvider);
  const u = auth.currentUser;
  if (!u) throw new Error("No user after popup");
  return u.getIdToken(true);
}