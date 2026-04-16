  "use client";

  import Link from "next/link";
  import {
    usePathname,
    useSelectedLayoutSegments,
    useRouter,
  } from "next/navigation";
  import { useState } from "react";
  import {
    LogOut,
    Home,
    FileText,
    Image as ImageIcon,
    Mail,
    Users,
    Settings,
    type LucideIcon,
  } from "lucide-react";
  import { cn } from "@/lib/utils/cn";
  import { signOut } from "firebase/auth";
  import { auth } from "@/lib/firebase/client";

  // Keep data up top; simple, typed, and easy to scan
  type AdminLink = { href: string; label: string; icon: LucideIcon };

  const links: AdminLink[] = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/projects", label: "Projects", icon: ImageIcon },
    { href: "/admin/articles", label: "Articles", icon: FileText },
    { href: "/admin/inbox", label: "Inbox", icon: Mail },
    { href: "/admin/collaborations", label: "Collaborations", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  export default function AdminShell({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // Best practice for App Router: segments are robust with nested routes/interception
    const segments = useSelectedLayoutSegments();
    const pathname = usePathname(); // small fallback & for aria-current match
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const isActive = (href: string) => {
      // Root admin tab (/admin) is active when there are no deeper segments
      if (href === "/admin") return segments.length === 0;
      // Any deeper link is active when pathname starts with its href
      return pathname.startsWith(href);
    };

    async function doLogout() {
      try {
        setLoggingOut(true);
        await fetch("/api/session", { method: "DELETE" });
        try {
          await signOut(auth);
        } catch {
          // ignore firebase signOut errors; session was already cleared
        }
        router.push("/login");
        router.refresh();
      } finally {
        setLoggingOut(false);
      }
    }

    return (
      <div className="grid min-h-[100vh] md:grid-cols-[240px_1fr]">
        <aside className="sticky flex flex-col justify-between top-0 h-[100vh] border-r-2 border-black bg-white p-4">
          <div>
            <div className="mb-4 text-lg font-semibold">Admin</div>

            <nav aria-label="Admin" className="grid gap-2 text-sm">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md  py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black",
                      active
                        ? "font-semibold underline"
                        : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div>
            <div className="mt-6">
              <button
                type="button"
                onClick={doLogout}
                disabled={loggingOut}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full border-2 border-black px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60",
                  loggingOut ? "cursor-wait" : "hover:bg-black hover:text-white"
                )}
              >
                <LogOut size={16} aria-hidden="true" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>

            <div className="mt-6 text-xs opacity-60">
              Tip: open any public page with <code>?edit=1</code> to edit inline.
            </div>
          </div>
        </aside>

        <main className="p-6">{children}</main>
      </div>
    );
  }
