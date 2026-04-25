"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Instagram, Dribbble, Github, Linkedin, Send, Twitter, Youtube, Globe, MapPin, Mail as MailIcon, Phone, MessageCircle, Clock } from "lucide-react";
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
  contactEmail: "",
  contactPhone: "",
  contactWhatsapp: "",
  contactLocation: "",
  showDubaiTime: true,
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

// ── Dubai time ────────────────────────────────────────────────
function DubaiTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className="flex items-center gap-1.5 text-xs text-white/50">
      <Clock size={11} />
      Dubai {time}
    </span>
  );
}

// ── Contact strip ─────────────────────────────────────────────
function ContactStrip({ footer }: { footer: FooterSettings }) {
  const email    = footer.contactEmail    ?? "";
  const phone    = footer.contactPhone    ?? "";
  const whatsapp = footer.contactWhatsapp ?? "";
  const location = footer.contactLocation ?? "";
  const showTime = footer.showDubaiTime   ?? true;

  const hasAny = email || phone || whatsapp || location || showTime;
  if (!hasAny) return null;

  return (
    <div className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-x-8 gap-y-2">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <MailIcon size={11} />
            {email}
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <Phone size={11} />
            {phone}
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <MessageCircle size={11} />
            WhatsApp
          </a>
        )}
        {location && (
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin size={11} />
            {location}
          </span>
        )}
        {showTime && (
          <span className="ml-auto">
            <DubaiTime />
          </span>
        )}
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-full border-2 border-white/40 text-white/80 text-sm">
        <Send size={14} className="shrink-0" />
        <span>Newsletter coming soon — you&apos;re on the list!</span>
      </div>
    );
  }

  return (
    <form className="grid grid-cols-[1fr_auto] gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="px-3 py-2 rounded-full bg-transparent border-2 border-white placeholder-white/60 text-white focus:outline-none focus:border-white/80"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-full border-2 border-white px-4 py-2 inline-flex items-center gap-2 hover:bg-white hover:text-black transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60"
      >
        {state === "loading"
          ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <Send size={16} />}
        <span>Subscribe</span>
      </button>
      {state === "error" && (
        <p className="col-span-2 text-xs text-red-400 px-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
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
              className="rounded-full border-2 border-white px-6 py-3 inline-flex items-center gap-2 text-base hover:bg-white hover:text-black transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right — Links + socials */}
        <div className="grid gap-6">
          {/* Newsletter */}
          <NewsletterForm />

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
                  className="p-2 rounded-full border border-white/40 hover:border-white transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SocialIcon platform={s.platform} size={15} />
                </a>
              ))}
            </div>
          )}

          <div className="text-xs opacity-70">{copyright}</div>
        </div>
      </div>

      {/* Contact strip */}
      <ContactStrip footer={f} />
    </footer>
  );
}
