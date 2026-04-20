"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types/project";
import { BlocksRenderer } from "./BlocksRenderer";

export default function ProjectViewer({ project, relatedProjects = [] }: { project: Project; relatedProjects?: Project[] }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const { general, main, notes, extra } = project;

  useEscapeClose(notesOpen, () => setNotesOpen(false));

  return (
    <main className="min-h-screen bg-white">

      {/* ── Sticky header ── sits below the fixed navbar */}
      <header className="sticky top-[var(--nav-h,0px)] z-40 bg-white border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/work"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={15} />
            Work
          </Link>

          <span className="text-sm font-semibold tracking-tight truncate max-w-xs">
            {general.title}
            {general.year && (
              <span className="text-gray-400 font-normal ml-2">{general.year}</span>
            )}
          </span>

          <button
            onClick={() => setNotesOpen((v) => !v)}
            className="text-sm px-4 py-1.5 border border-gray-200 rounded-full hover:border-black hover:bg-black hover:text-white transition-all font-medium"
          >
            Project Notes
          </button>
        </div>
      </header>

      <div className="relative flex">

        {/* ── Main content — blocks ── */}
        <div className="flex-1 min-w-0">

          {/* Hero image */}
          {general.heroUrl && (
            <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
              <Image
                src={general.heroUrl}
                alt={general.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          {/* Project title block — title → tagline → summary → tags */}
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-20">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1] mb-4">
              {general.title}
            </h1>

            {main?.details?.tagline && (
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-4">
                {main.details.tagline}
              </p>
            )}

            {main?.details?.summary && (
              <p className="text-base text-gray-500 max-w-3xl leading-relaxed mb-6">
                {main.details.summary}
              </p>
            )}

            {/* Tags */}
            {general.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {general.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blocks — the actual page content */}
          {extra?.blocks?.length ? (
            <BlocksRenderer blocks={extra.blocks} />
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-20 text-gray-400 text-center">
              <p className="text-lg">No content blocks yet.</p>
              <p className="text-sm mt-1">Add blocks in the admin editor.</p>
            </div>
          )}

          {/* Bottom padding */}
          <div className="h-32" />
        </div>

        {/* ── Notes drawer ── */}
        <AnimatePresence>
          {notesOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "45vw", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 bg-white sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-30"
            >
              <div className="px-8 py-5 flex items-center justify-between sticky top-0 bg-white z-10">
                <span className="text-sm font-semibold tracking-tight">About the project</span>
                <button
                  onClick={() => setNotesOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="px-8 pb-10 text-sm space-y-8">

                {/* Brief — full width first */}
                {notes?.brief && (
                  <div>
                    <p className="text-gray-700 leading-relaxed">{notes.brief}</p>
                  </div>
                )}

                {/* 2-column grid for metadata */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {notes?.client && <NoteRow label="Client" value={notes.client} />}
                  {notes?.industry && <NoteRow label="Industry" value={notes.industry} />}
                  {(notes?.year || general.year) && (
                    <NoteRow label="Year" value={String(notes?.year || general.year)} />
                  )}
                  {notes?.region && <NoteRow label="Office" value={notes.region} />}
                  {notes?.deliverables && <NoteRow label="Deliverables" value={notes.deliverables} />}
                </div>

                {/* Services — full width as pills */}
                {notes?.services?.length ? (
                  <div>
                    <NoteLabel>Services</NoteLabel>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {notes.services.map((svc) => (
                        <span
                          key={svc}
                          className="px-2.5 py-1 border border-gray-200 rounded-full text-xs text-gray-600"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Related Projects ── */}
      {relatedProjects.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-gray-100">
          <h2 className="text-4xl md:text-6xl tracking-tight leading-[0.95] mb-8">
            Related Projects
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {relatedProjects.map((p) => (
              <Link
                key={p.general.id}
                href={`/work/${p.general.id}`}
                className="group block overflow-hidden rounded-2xl bg-gray-100"
              >
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden">
                  {p.general.heroUrl ? (
                    <Image
                      src={p.general.heroUrl}
                      alt={p.general.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h4 className="font-bold text-xl text-gray-900 group-hover:underline underline-offset-4 leading-snug">
                    {p.general.title}
                  </h4>
                  {p.general.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.general.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white text-gray-500 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// ── Small atoms ───────────────────────────────────────────────

function NotesSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function NoteLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{children}</p>;
}

function NoteRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <NoteLabel>{label}</NoteLabel>
      <p className="text-gray-700">{value}</p>
    </div>
  );
}

function useEscapeClose(active: boolean, onClose: () => void) {
  const handler = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    if (!active) return;
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, handler]);
}
