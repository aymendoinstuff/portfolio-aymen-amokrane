export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Available for brand design projects. Let's build something sharp together.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Aymen Amokrane", url: "/contact", type: "website" },
};

import { getServerSiteSettings } from "@/lib/settings/server";
import ContactClient from "@/components/public/contact/ContactClient";
import ScrollReveal from "@/components/ScrollReveal";

export default async function ContactPage() {
  const settings = await getServerSiteSettings();
  const contact = settings.contact;

  // When wishlist is locked, strip all project data server-side so it
  // never reaches the client bundle or HTML source — not even blurred.
  const safeContact = contact.wishlistLocked
    ? { ...contact, wishlistProjects: [] }
    : contact;

  return (
    <main className="min-h-screen">
      {/* Page title */}
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-2">
          <h1 className="text-4xl md:text-6xl tracking-tight leading-[0.95]">
            {contact.pageTitle || "Let\u2019s Do Stuff"}
          </h1>
        </div>
      </ScrollReveal>

      {/* All sections rendered by the client component (handles interactivity) */}
      <ContactClient contact={safeContact} />
    </main>
  );
}
