"use client";

import { SettingsSchema, type SiteSettings } from "../schema";
import { experiences, education, skills, tools, stats } from "@/lib/data/about";
import { DEFAULT_WISHLIST, DEFAULT_SERVICES } from "../tabs/ContactTab";

export const DEFAULT_SETTINGS: SiteSettings = SettingsSchema.parse({});

/**
 * Fill in any fields that are empty with their real hardcoded defaults,
 * so the Site Editor shows meaningful starting values instead of blank boxes.
 */
function hydrateSettings(s: SiteSettings): SiteSettings {
  // ── Nav ──────────────────────────────────────────────────────────────────
  const nav: SiteSettings["nav"] = {
    brand: s.nav.brand || "We Doing",
    logoUrl: s.nav.logoUrl ?? "",
    links: s.nav.links.length > 0 ? s.nav.links : [
      { label: "Home",  href: "/" },
      { label: "About", href: "/about" },
      { label: "Work",  href: "/work" },
      { label: "Blog",  href: "/blog" },
    ],
  };

  // ── Home ─────────────────────────────────────────────────────────────────
  const home: SiteSettings["home"] = {
    ...s.home,
    heroMainText:   s.home.heroMainText   || "WE DOING",
    heroFontWeight: s.home.heroFontWeight || "bold",
    heroRotateWords: s.home.heroRotateWords?.length > 0 ? s.home.heroRotateWords : [
      "THINKING", "BRANDING", "STRATEGY", "SYSTEMS", "LOGOS", "STUFF",
    ],
    heroCta: {
      label: s.home.heroCta?.label || "AVAILABLE FOR WORK",
      href:  s.home.heroCta?.href  || "/contact",
    },
  };

  // ── Footer ───────────────────────────────────────────────────────────────
  const footer: SiteSettings["footer"] = {
    ctaHeadline: s.footer.ctaHeadline || "You have a project?",
    ctaSubtext:  s.footer.ctaSubtext  || "Let's build something sharp. Strategy, systems, identity.",
    ctaButton: {
      label: s.footer.ctaButton?.label || "Let's do stuff",
      href:  s.footer.ctaButton?.href  || "/contact",
    },
    links: s.footer.links.length > 0 ? s.footer.links : [
      { label: "Home",  href: "/" },
      { label: "About", href: "/about" },
      { label: "Work",  href: "/work" },
      { label: "Blog",  href: "/blog" },
    ],
    socialLinks: s.footer.socialLinks ?? [],
    copyright: s.footer.copyright || "© {year} Aymen Doin Stuff. All rights reserved.",
  };

  // ── About ────────────────────────────────────────────────────────────────
  const aboutEmpty =
    s.about.experiences.length === 0 &&
    s.about.skills.length === 0 &&
    s.about.tools.length === 0 &&
    s.about.stats.length === 0;

  const about: SiteSettings["about"] = {
    ...s.about,
    personal: {
      name:     s.about.personal.name     || "Aymen Doin Stuff",
      role:     s.about.personal.role     || "Senior Brand Designer",
      location: s.about.personal.location || "Dubai",
    },
    intro: s.about.intro || "Designer focused on strategy-led brand systems. I help teams ship identities that scale — from positioning to guidelines and design ops.",
    ...(aboutEmpty ? { experiences, education, skills, tools, stats } : {}),
  };

  // ── Contact ──────────────────────────────────────────────────────────────────
  const contact: SiteSettings["contact"] = {
    sections: s.contact?.sections?.length > 0 ? s.contact.sections : [
      { id: "wishlist", visible: true, order: 0 },
      { id: "services", visible: true, order: 1 },
      { id: "inquiry",  visible: true, order: 2 },
    ],
    wishlistTitle:    s.contact?.wishlistTitle    || "2026 Wishlist",
    wishlistSubtitle: s.contact?.wishlistSubtitle ?? "",
    wishlistProjects: s.contact?.wishlistProjects?.length > 0
      ? s.contact.wishlistProjects
      : (DEFAULT_WISHLIST as SiteSettings["contact"]["wishlistProjects"]),
    servicesTitle: s.contact?.servicesTitle || "My Services",
    services: s.contact?.services?.length > 0
      ? s.contact.services
      : (DEFAULT_SERVICES as SiteSettings["contact"]["services"]),
    inquiryTitle: s.contact?.inquiryTitle || "General Inquiry",
  };

  return { ...s, nav, home, footer, about, contact };
}

/**
 * Load settings via the admin API route (uses Admin SDK → bypasses Firestore
 * security rules, so it always returns the real saved data instead of falling
 * back to DEFAULT_SETTINGS when the client SDK is blocked).
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch("/api/admin/settings/load", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json() as { settings: unknown };
    const result = SettingsSchema.safeParse(json.settings);
    const parsed = result.success ? result.data : SettingsSchema.parse({});
    return hydrateSettings(parsed);
  } catch {
    return hydrateSettings(DEFAULT_SETTINGS);
  }
}

export async function resetSiteSettingsFromJson(): Promise<void> {
  const res = await fetch("/admin/settings/reset", { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset settings from JSON defaults.");
}
