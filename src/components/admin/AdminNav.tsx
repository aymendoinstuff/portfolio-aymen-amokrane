"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/collaborations", label: "Collaborations" },
];

export default function AdminNav() {
  // Best practice for App Router: segments are robust with nested routes/interception
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname(); // small fallback & for aria-current match

  const isActive = (href: string) => {
    // Root admin tab (/admin) is active when there are no deeper segments
    if (href === "/admin") return segments.length === 0;
    // Any deeper link is active when pathname starts with its href
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="Admin" className="flex flex-col gap-2 text-sm">
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2 py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black",
              active
                ? "font-semibold underline"
                : "opacity-70 hover:opacity-100"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
