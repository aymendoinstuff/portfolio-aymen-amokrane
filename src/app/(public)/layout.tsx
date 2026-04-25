// app/(public)/layout.tsx — server component, fetches settings once per request
// force-dynamic: prevents Next.js from caching this layout so settings changes
// appear immediately after saving in the admin panel
export const dynamic = "force-dynamic";

import { getServerSiteSettings } from "@/lib/settings/server";
import Footer from "@/components/public/common/Footer";
import NavBar from "@/components/public/common/Navbar";
import HeavyScroller from "@/components/public/home/HeavyScroller";
import ComingSoon from "@/components/public/ComingSoon";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getServerSiteSettings();

  // ── Coming Soon gate ──────────────────────────────────────────────────────
  if (settings.comingSoon) {
    return (
      <>
        {/* Preload logo so it's in browser cache before React hydrates */}
        {settings.nav.logoUrl && (
          <link rel="preload" as="image" href={settings.nav.logoUrl} />
        )}
        <ComingSoon settings={{ nav: settings.nav, footer: settings.footer }} />
      </>
    );
  }

  return (
    <HeavyScroller>
      <NavBar
        brand={settings.nav.brand}
        logoUrl={settings.nav.logoUrl}
        links={settings.nav.links}
      />
      {/* paddingTop compensates for fixed navbar; on homepage the navbar hides so we keep a small offset */}
      <div style={{ paddingTop: "var(--nav-h, 0px)" }}>{children}</div>
      <Footer footer={settings.footer} />
    </HeavyScroller>
  );
}
