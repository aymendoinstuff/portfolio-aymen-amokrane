export const dynamic = "force-dynamic";

import { getServerSiteSettings } from "@/lib/settings/server";
import ContactClient from "@/components/public/contact/ContactClient";

export default async function ContactPage() {
  const settings = await getServerSiteSettings();
  const contact = settings.contact;

  return (
    <main className="min-h-screen">
      {/* Page title */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-2">
        <h1 className="text-4xl md:text-6xl tracking-tight leading-[0.95]">
          Let&apos;s Do Stuff
        </h1>
      </div>

      {/* All sections rendered by the client component (handles interactivity) */}
      <ContactClient contact={contact} />
    </main>
  );
}
