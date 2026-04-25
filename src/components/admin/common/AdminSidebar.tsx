// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CalendarDays,
  Globe,
  Mail,
  ExternalLink,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import LogoutButton from "../LogoutButton";
import { logoutAction } from "@/server/actions/auth";
import ComingSoonToggle from "./ComingSoonToggle";

type AdminLink = { href: string; label: string; icon: LucideIcon };

const LINKS: AdminLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/inbox", label: "Inbox", icon: Mail },
  { href: "/admin/studio", label: "Calendar", icon: CalendarDays },
  { href: "/admin/settings", label: "Site Editor", icon: Globe },
  { href: "/admin/clients", label: "Client Vault", icon: Users },
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
    <aside className="sticky top-0 flex h-[100vh] flex-col bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-tight">
              Aymen
            </div>
            <div className="text-[10px] text-gray-400 leading-tight">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin">
        <div className="grid gap-0.5">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-black",
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon
                  size={17}
                  className={active ? "text-white" : "text-gray-400"}
                  aria-hidden
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Coming Soon toggle + View site */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid gap-0.5">
          <ComingSoonToggle />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <ExternalLink size={17} className="text-gray-400" aria-hidden />
            View site
          </Link>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <LogoutButton action={logoutAction} />
      </div>
    </aside>
  );
}
