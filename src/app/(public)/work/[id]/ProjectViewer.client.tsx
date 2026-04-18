"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types/project";
import { BlocksRenderer } from "./BlocksRenderer";

export default function ProjectViewer({ project }: { project: Project }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const { general, main, extra } = project;

  useEscapeClose(notesOpen, () => setNotesOpen(false));

  return (
    <main className="min-h-screen bg-white">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
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
            <span className="text-gray-400 font-normal ml-2">{general.year}</span>
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

          {/* Project title block */}
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-20 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              {main.details.client} — {general.year}
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1] mb-5">
              {general.title}
            </h1>
            {main.details.tagline && (
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
                {main.details.tagline}
              </p>
            )}

            {/* Tags */}
            {general.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
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
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 border-l border-gray-200 bg-white sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-30"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <span className="text-sm font-semibold">Project Notes</span>
                <button
                  onClick={() => setNotesOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-5 space-y-7 text-sm">
                <NotesSection label="Overview">
                  <NoteRow label="Client" value={main.details.client} />
                  <NoteRow label="Sector" value={main.details.sector} />
                  <NoteRow label="Discipline" value={main.details.discipline?.join(" / ")} />
                  {main.details.summary && (
                    <NoteRow label="Summary" value={main.details.summary} />
                  )}
                  {main.brief && (
                    <div>
                      <NoteLabel>Brief</NoteLabel>
                      <p className="text-gray-600 leading-relaxed">{main.brief}</p>
                    </div>
                  )}
                </NotesSection>

                {(main.details.services?.length || main.details.deliverables?.length) && (
                  <NotesSection label="Scope">
                    {main.details.services?.length ? (
                      <NoteList label="Services" items={main.details.services} />
                    ) : null}
                    {main.details.deliverables?.length ? (
                      <NoteList label="Deliverables" items={main.details.deliverables} />
                    ) : null}
                  </NotesSection>
                )}

                {main.details.team?.length ? (
                  <NotesSection label="Team">
                    <ul className="space-y-1.5">
                      {main.details.team.map((m, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="font-medium text-gray-800">{m.name}</span>
                          <span className="text-gray-400">{m.role}</span>
                        </li>
                      ))}
                    </ul>
                  </NotesSection>
                ) : null}

                <NotesSection label="Details">
                  {main.details.timeline && (
                    <NoteRow
                      label="Timeline"
                      value={
                        "label" in main.details.timeline
                          ? main.details.timeline.label
                          : `${main.details.timeline.start}${main.details.timeline.end ? ` → ${main.details.timeline.end}` : ""}`
                      }
                    />
                  )}
                  {main.details.location && (
                    <NoteRow label="Location" value={main.details.location} />
                  )}
                </NotesSection>

                {main.details.links && Object.values(main.details.links).some(Boolean) && (
                  <NotesSection label="Links">
                    <div className="flex flex-col gap-2">
                      {main.details.links.behance && (
                        <ExtLink href={main.details.links.behance} label="Behance" />
                      )}
                      {main.details.links.caseStudy && (
                        <ExtLink href={main.details.links.caseStudy} label="Case Study" />
                      )}
                      {main.details.links.liveSite && (
                        <ExtLink href={main.details.links.liveSite} label="Live Site" />
                      )}
                      {main.details.links.repo && (
                        <ExtLink href={main.details.links.repo} label="Repository" />
                      )}
                    </div>
                  </NotesSection>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
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

function NoteList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <NoteLabel>{label}</NoteLabel>
      <ul className="space-y-0.5">
        {items.map((s, i) => (
          <li key={i} className="text-gray-700 flex items-start gap-1.5">
            <span className="text-gray-300 mt-1">—</span> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExtLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 text-gray-700 hover:text-black underline underline-offset-2 transition-colors"
    >
      {label} <ExternalLink size={12} />
    </a>
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
