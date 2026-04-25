"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/types/project";
import { BlocksRenderer } from "./BlocksRenderer";

// no glass style needed — sidebar is plain white in-flow

export default function ProjectViewer({
  project,
  relatedProjects = [],
}: {
  project: Project;
  relatedProjects?: Project[];
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const { general, main, notes, extra } = project;

  useEscapeClose(notesOpen, () => setNotesOpen(false));

  return (
    <main className="min-h-screen bg-white">

      {/* ── Floating "Project Notes" pill — always visible ── */}
      <button
        onClick={() => setNotesOpen((v) => !v)}
        className="fixed z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-black/10 bg-white text-black shadow-sm transition-all hover:shadow-md"
        style={{ top: "calc(var(--nav-h, 64px) + 1.25rem)", right: "1.5rem" }}
      >
        {notesOpen && <X size={13} strokeWidth={2.5} />}
        {notesOpen ? "Close" : "Project Notes"}
      </button>

      {/* ── Page body: gallery (55%) + notes (45%) ── */}
      <div className="flex items-start">

        {/* Gallery column */}
        <div className="flex-1 min-w-0">

          {/* Title block */}
          <div className="max-w-5xl mx-auto pl-10 pr-6 md:pl-24 md:pr-10 pt-10 pb-8">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1] mb-3">
              {general.title}
            </h1>

            {main?.details?.tagline && (
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-3">
                {main.details.tagline}
              </p>
            )}

            {main?.details?.summary && (
              <p className="text-base text-gray-500 max-w-3xl leading-relaxed mb-4">
                {main.details.summary}
              </p>
            )}

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

          {/* Hero */}
          {general.heroUrl && (
            <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
              <Image src={general.heroUrl} alt={general.title} fill className="object-cover" sizes="100vw" priority />
            </div>
          )}

          {/* Content blocks */}
          {extra?.blocks?.length ? (
            <BlocksRenderer blocks={extra.blocks} />
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-12 text-gray-400 text-center">
              <p className="text-lg">No content blocks yet.</p>
              <p className="text-sm mt-1">Add blocks in the admin editor.</p>
            </div>
          )}

          <div className="h-16" />
        </div>

        {/* ── Notes sidebar ──────────────────────────────────────────────────
             No Framer Motion on the outer element — zero overflow conflicts.
             The aside itself is position:sticky + alignSelf:flex-start so it
             locks at the top once gallery scrolls past the notes content.
             overflow-y:auto on the aside lets very long briefs scroll inside
             the locked panel. The content fades/slides in via a wrapper div.
        ──────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {notesOpen && (
            <aside
              className="shrink-0 bg-white text-sm"
              style={{
                width: "45%",
                position: "sticky",
                top: "var(--nav-h, 64px)",
                alignSelf: "flex-start",
                willChange: "transform",
              }}
            >
              <motion.div
                key="notes-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Header */}
                <div className="px-8 pt-8 pb-5 border-b border-gray-100">
                  <span className="text-sm font-semibold tracking-tight text-gray-900">About the project</span>
                </div>

                {/* Content */}
                <div className="px-8 pt-6 pb-12 space-y-6">

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    {notes?.client       && <NoteRow label="Client"       value={notes.client} />}
                    {notes?.industry     && <NoteRow label="Industry"     value={notes.industry} />}
                    {notes?.year         && <NoteRow label="Year"         value={String(notes.year)} />}
                    {notes?.region       && <NoteRow label="Region"       value={notes.region} />}
                    {notes?.deliverables && <NoteRow label="Deliverables" value={notes.deliverables} />}
                  </div>

                  {/* Services */}
                  {notes?.services?.length ? (
                    <div>
                      <NoteLabel>Services</NoteLabel>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {notes.services.map((svc) => (
                          <span key={svc} className="px-2.5 py-1 border border-gray-200 rounded-full text-xs text-gray-600">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Custom notes */}
                  {notes?.customNotes?.filter(n => n.title || n.content).map((note, i) => (
                    <div key={i}>
                      {note.title && <NoteLabel>{note.title}</NoteLabel>}
                      {note.content && <p className="text-gray-700 whitespace-pre-line">{note.content}</p>}
                    </div>
                  ))}

                  {/* Brief — fully readable; panel scrolls internally if taller than viewport */}
                  {notes?.brief && (
                    <div className="border-t border-gray-100 pt-6 space-y-3">
                      {notes.brief.split(/\n\n+/).map((block, bi) => {
                        const trimmed = block.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("### "))
                          return <h4 key={bi} className="text-sm font-medium text-gray-700 mt-3 first:mt-0">{trimmed.slice(4)}</h4>;
                        if (trimmed.startsWith("## "))
                          return <h3 key={bi} className="text-base font-bold text-gray-900 mt-4 first:mt-0">{trimmed.slice(3)}</h3>;
                        return <p key={bi} className="text-gray-700 leading-relaxed whitespace-pre-line">{trimmed}</p>;
                      })}
                    </div>
                  )}

                </div>
              </motion.div>
            </aside>
          )}
        </AnimatePresence>

      </div>

      {/* ── Related Projects ── */}
      {relatedProjects.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 border-t border-gray-100">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[0.95] mb-6">
            Related Projects
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {relatedProjects.map((p) => (
              <a
                key={p.general.id}
                href={`/work/${p.general.id}`}
                className="group block overflow-hidden rounded-2xl bg-gray-100"
              >
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
                <div className="p-4">
                  <h4 className="font-bold text-xl text-gray-900 group-hover:underline underline-offset-4 leading-snug">
                    {p.general.title}
                  </h4>
                  {p.general.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.general.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white text-gray-500 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// ── Atoms ──────────────────────────────────────────────────────

function NoteLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
      {children}
    </p>
  );
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
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );
  useEffect(() => {
    if (!active) return;
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, handler]);
}
