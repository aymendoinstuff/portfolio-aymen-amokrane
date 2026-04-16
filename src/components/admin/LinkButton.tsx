import React from "react";
import Link from "next/link";

export function LinkButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors";
  const styles =
    variant === "solid"
      ? "bg-black text-white hover:opacity-90"
      : "border border-gray-300 hover:bg-gray-50";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
