"use client";
import { firestore } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { SiteSettings } from "./types/site";
import { DEFAULT_SETTINGS } from "./types/site";
const REF = () => doc(firestore, "site", "global");
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(REF());
    return snap.exists() ? (snap.data() as SiteSettings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
export async function saveSiteSettings(data: SiteSettings) {
  await setDoc(REF(), { ...data, updatedAt: Date.now() }, { merge: true });
}
