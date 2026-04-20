import { unstable_noStore as noStore } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { SettingsSchema } from "@/app/admin/settings/schema";
import type { SiteSettings } from "@/app/admin/settings/schema";
import { experiences, education, skills, tools, stats } from "@/lib/data/about";
import { DEFAULT_WISHLIST, DEFAULT_SERVICES } from "@/app/admin/settings/tabs/ContactTab";

const DEFAULT_SETTINGS: SiteSettings = SettingsSchema.parse({});

/**
 * Fill in any fields that are empty with their real hardcoded defaults,
 * so the public site always looks right even before the admin has edited anything,
 * and so the Site Editor shows meaningful starting values.
 */
function hydrateSettings(s: SiteSettings): SiteSettings {
  // ── Nav ─────────────────────────────────────────────────────────────────
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

  // ── Home ────────────────────────────────────────────────────────────────
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

  // ── Footer ──────────────────────────────────────────────────────────────
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

  // ── About ───────────────────────────────────────────────────────────────
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

  // ── Contact ─────────────────────────────────────────────────────────────────
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

export async function getServerSiteSettings(): Promise<SiteSettings> {
  noStore(); // prevent Next.js from caching — settings must always be fresh
  try {
    const snap = await adminDb.collection("site").doc("settings").get();
    if (!snap.exists) return hydrateSettings(DEFAULT_SETTINGS);
    const parsed = SettingsSchema.parse(snap.data());
    return hydrateSettings(parsed);
  } catch (error) {
    console.error("[getServerSiteSettings] error:", error);
    return hydrateSettings(DEFAULT_SETTINGS);
  }
}
