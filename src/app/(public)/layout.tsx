// app/(public)/layout.tsx — server component, fetches settings once per request
// force-dynamic: prevents Next.js from caching this layout so settings changes
// appear immediately after saving in the admin panel
export const dynamic = "force-dynamic";

import { getServerSiteSettings } from "@/lib/settings/server";
import Footer from "@/components/public/common/Footer";
import NavBar from "@/components/public/common/Navbar";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getServerSiteSettings();

  return (
    <>
      <NavBar
        brand={settings.nav.brand}
        logoUrl={settings.nav.logoUrl}
        links={settings.nav.links}
      />
      {/* paddingTop compensates for fixed navbar; on homepage the navbar hides so we keep a small offset */}
      <div style={{ paddingTop: "var(--nav-h, 0px)" }}>{children}</div>
      <Footer footer={settings.footer} />
    </>
  );
}
