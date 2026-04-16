"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  Instagram,
  Dribbble,
  Github,
  Linkedin,
  Send,
} from "lucide-react";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={
        "mt-16 border-t-2 border-black bg-black text-white " + className
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-2">
        <div>
          <div className="text-4xl md:text-6xl tracking-tight leading-[0.95]">
            You have a project?
          </div>
          <div className="mt-4 opacity-80 text-sm">
            Let&apos;s build something sharp. Strategy, systems, identity.
          </div>
          <div className="mt-6">
            <Link
              href="/contact"
              className="rounded-full border-2 border-white px-6 py-3 inline-flex items-center gap-2 text-base"
            >
              <span>Let&apos;s do stuff</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="grid gap-6">
          <form
            className="grid grid-cols-[1fr_auto] gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="grid gap-2">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/work" className="hover:underline">
                Work
              </Link>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-full border-2 border-white"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Dribbble"
                className="p-2 rounded-full border-2 border-white"
              >
                <Dribbble size={16} />
              </a>
              <a
                href="#"
                aria-label="Github"
                className="p-2 rounded-full border-2 border-white"
              >
                <Github size={16} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-full border-2 border-white"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          <div className="text-xs opacity-70">
            © {new Date().getFullYear()} Aymen Doin Stuff. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
