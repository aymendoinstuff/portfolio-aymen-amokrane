import React from "react";
import Link from "next/link";

type Crumb = { label: string; href?: string };

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  /** set to false if you don't want it sticky in some pages */
  sticky?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  sticky = true,
  className = "",
}: PageHeaderProps) {
  const stickyClasses = sticky
    ? "sticky top-0 z-20 bg-white mb-8 backdrop-blur-sm border-b border-gray-100"
    : "mb-8";

  return (
    <header className={`${stickyClasses} ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 pt-3 px-4 md:px-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-gray-500">
            {breadcrumbs.map((c, i) => (
              <li key={`${c.label}-${i}`} className="flex items-center">
                {c.href ? (
                  <Link
                    href={c.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium">{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <span className="mx-2 select-none">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="px-4 md:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-gray-600 max-w-prose">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
