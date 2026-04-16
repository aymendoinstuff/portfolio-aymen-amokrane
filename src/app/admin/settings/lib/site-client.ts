"use client";

import { firestore } from "@/lib/firebase/client";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { SettingsSchema, type SiteSettings } from "../schema";

export const DEFAULT_SETTINGS: SiteSettings = SettingsSchema.parse({});
const REF = () => doc(firestore, "site", "settings");

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(REF());
    if (snap.exists()) return SettingsSchema.parse(snap.data());
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(data: SiteSettings): Promise<void> {
  const validated = SettingsSchema.parse(data);
  await setDoc(REF(), { ...validated, updatedAt: Date.now() }, { merge: true });
}

export async function getAvailableCollaborationIds(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(firestore, "collaborations"));
    return snap.docs.map((d) => d.id);
  } catch {
    return [];
  }
}

export async function resetSiteSettingsFromJson(): Promise<void> {
  const res = await fetch("/admin/settings/reset", { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset settings from JSON defaults.");
}
