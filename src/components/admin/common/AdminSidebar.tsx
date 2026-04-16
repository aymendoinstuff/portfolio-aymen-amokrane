// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";
import {
  Home,
  FileText,
  Image as ImageIcon,
  Mail,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn"; // OK: passing server action as prop
import LogoutButton from "../LogoutButton";
import { logoutAction } from "@/server/actions/auth";

type AdminLink = { href: string; label: string; icon: LucideIcon };

const LINKS: AdminLink[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/projects", label: "Projects", icon: ImageIcon },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/inbox", label: "Inbox", icon: Mail },
  { href: "/admin/collaborations", label: "Collaborations", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname() || "";

  const isActive = useMemo(
    () => (href: string) =>
      href === "/admin" ? segments.length === 0 : pathname.startsWith(href),
    [segments, pathname]
  );

  return (
    <aside className="sticky top-0 flex h-[100vh] flex-col justify-between border-r-2 border-black bg-white p-4">
      <div>
        <div className="mb-4 text-lg font-semibold">Admin</div>

        <nav aria-label="Admin" className="grid gap-2 text-sm">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md py-1 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-black",
                  active
                    ? "font-semibold underline opacity-100"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <Icon size={20} aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Server Action form */}
        <div className="mt-6">
          <LogoutButton action={logoutAction} />
        </div>

        <p className="mt-6 text-xs opacity-60">
          Tip: open any public page with <code>?edit=1</code> to edit inline.
        </p>
      </div>
    </aside>
  );
}
