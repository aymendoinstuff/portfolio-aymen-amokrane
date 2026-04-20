"use client";
import Link from "next/link";
import { ArrowUpRight, Instagram, Dribbble, Github, Linkedin, Send, Twitter, Youtube, Globe } from "lucide-react";
import type { SiteSettings } from "@/app/admin/settings/schema";

type FooterSettings = SiteSettings["footer"];

interface FooterProps {
  className?: string;
  footer?: FooterSettings;
}

const DEFAULT_FOOTER: FooterSettings = {
  ctaHeadline: "You have a project?",
  ctaSubtext: "Let's build something sharp. Strategy, systems, identity.",
  ctaButton: { label: "Let's do stuff", href: "/contact" },
  links: [
    { label: "Home",  href: "/" },
    { label: "About", href: "/about" },
    { label: "Work",  href: "/work" },
    { label: "Blog",  href: "/blog" },
  ],
  socialLinks: [],
  copyright: `© ${new Date().getFullYear()} Aymen Doin Stuff. All rights reserved.`,
};

// Maps platform key → lucide icon
function SocialIcon({ platform, size = 15 }: { platform: string; size?: number }) {
  switch (platform.toLowerCase()) {
    case "instagram":  return <Instagram size={size} />;
    case "dribbble":   return <Dribbble size={size} />;
    case "github":     return <Github size={size} />;
    case "linkedin":   return <Linkedin size={size} />;
    case "twitter":    return <Twitter size={size} />;
    case "youtube":    return <Youtube size={size} />;
    default:           return <Globe size={size} />;
  }
}

// Maps platform key → readable label for aria-label
function platformLabel(platform: string) {
  const map: Record<string, string> = {
    instagram: "Instagram", dribbble: "Dribbble", github: "GitHub",
    linkedin: "LinkedIn", twitter: "X / Twitter", youtube: "YouTube",
    tiktok: "TikTok", pinterest: "Pinterest", behance: "Behance",
  };
  return map[platform.toLowerCase()] ?? platform;
}

export default function Footer({ className = "", footer }: FooterProps) {
  const f = footer ?? DEFAULT_FOOTER;

  const ctaHeadline = f.ctaHeadline  || DEFAULT_FOOTER.ctaHeadline;
  const ctaSubtext  = f.ctaSubtext   || DEFAULT_FOOTER.ctaSubtext;
  const ctaLabel    = f.ctaButton?.label || DEFAULT_FOOTER.ctaButton.label;
  const ctaHref     = f.ctaButton?.href  || DEFAULT_FOOTER.ctaButton.href;
  const footerLinks = f.links?.length > 0 ? f.links : DEFAULT_FOOTER.links;
  const socialLinks = f.socialLinks ?? [];
  const copyright   = f.copyright
    ? f.copyright.replace("{year}", String(new Date().getFullYear()))
    : DEFAULT_FOOTER.copyright;

  return (
    <footer className={"mt-16 border-t-2 border-black bg-black text-white " + className}>
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-2">

        {/* Left — CTA */}
        <div>
          <div className="text-4xl md:text-6xl tracking-tight leading-[0.95]">
            {ctaHeadline}
          </div>
          <div className="mt-4 opacity-80 text-sm">{ctaSubtext}</div>
          <div className="mt-6">
            <Link
              href={ctaHref}
              className="rounded-full border-2 border-white px-6 py-3 inline-flex items-center gap-2 text-base"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right — Links + socials */}
        <div className="grid gap-6">
          {/* Newsletter stub */}
          <form className="grid grid-cols-[1fr_auto] gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@email.com"
              className="px-3 py-2 rounded-full bg-transparent border-2 border-white placeholder-white/60 text-white"
            />
            <button
              type="button"
              className="rounded-full border-2 border-white px-4 py-2 inline-flex items-center gap-2"
            >
              <Send size={16} />
              <span>Subscribe</span>
            </button>
          </form>

          {/* Nav links — horizontal */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="opacity-70 hover:opacity-100 hover:underline transition-opacity uppercase tracking-[0.15em] text-[11px]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social icons — from settings, or hide if none configured */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platformLabel(s.platform)}
                  className="p-2 rounded-full border border-white/40 hover:border-white transition-colors"
                >
                  <SocialIcon platform={s.platform} size={15} />
                </a>
              ))}
            </div>
          )}

          <div className="text-xs opacity-70">{copyright}</div>
        </div>
      </div>
    </footer>
  );
}
