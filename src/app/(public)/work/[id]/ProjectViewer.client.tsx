"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import Placeholder from "@/components/public/common/Placeholder";
import { Btn } from "@/components/public/common/ui";

import type { MediaItem } from "@/lib/types/common";
import type { Project } from "@/lib/types/project";
import { BlocksRenderer } from "./BlocksRenderer";

/**
 * ProjectViewer – aspect-aware grid + vertical notes
 * - Gallery uses a 2-col grid with ratio-based sizing:
 *   - 1400x700 (≈2:1) → full-width row (col-span-2)
 *   - 700x700 (1:1)   → two squares side-by-side
 *   - square + span2  → square featured across both columns
 * - Notes are a single vertical stack (Overview / Scope / Meta / Story)
 * - Gallery pane scales horizontally only to avoid “top margin” illusion
 */
export default function ProjectViewer({
  project,
}: {
  project: Project;
}) {
  const [aboutOpen, setAboutOpen] = useState(false);

  const { general, main } = project;

  // Quotes + gallery mapping
  const quotes = general.quotes ?? [];
  const q0 = quotes[0] ?? "Make it simple, make it scale.";
  const q1 = quotes[1] ?? "Systems that look good and behave well.";

  const gallery = main.gallery as MediaItemWithDims[];
  const hasGallery = gallery.length > 0;

  // Close panel with Escape
  useEscapeClose(aboutOpen, () => setAboutOpen(false));

  return (
    <main className="min-h-screen">
      <ProjectHeader
        title={general.title}
        year={general.year}
        aboutOpen={aboutOpen}
        onToggleAbout={() => setAboutOpen((v) => !v)}
      />

      {/* Content + Notes */}
      <div className="relative">
        <div className="flex gap-0">
          <motion.section
            initial={false}
            animate={{
              width: aboutOpen ? "55%" : "100%",
              scaleX: aboutOpen ? 0.94 : 1, // horizontal-only to avoid top gap
              scaleY: 1,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="origin-top-right"
            aria-label="Project gallery"
          >
            <div className="max-w-6xl mx-auto px-4">
              <MediaFlow
                title={general.title}
                brief={main.brief}
                gallery={gallery}
                quoteA={q0}
                quoteB={q1}
                hasGallery={hasGallery}
              />
            </div>
          </motion.section>

          <AnimatePresence>
            {aboutOpen && (
              <NotesDrawer onClose={() => setAboutOpen(false)}>
                <NotesTabs project={project} />
              </NotesDrawer>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

/* --------------------------------- Header -------------------------------- */
function ProjectHeader({
  title,
  year,
  aboutOpen,
  onToggleAbout,
}: {
  title: string;
  year: string | number;
  aboutOpen: boolean;
  onToggleAbout: () => void;
}) {
  return (
    <header className="max-w-6xl mx-auto px-4 pt-20 pb-8 flex items-center justify-between">
      <Link href="/work" aria-label="Back to work">
        <Btn className="px-3 py-1.5 text-sm">
          <ArrowLeft size={16} /> Back to work
        </Btn>
      </Link>

      <h1 className="text-xl md:text-3xl font-semibold tracking-tight">
        {title} <span className="opacity-60">- {year}</span>
      </h1>

      <Btn
        onClick={onToggleAbout}
        className="px-3 py-1.5 text-sm"
        aria-expanded={aboutOpen}
        aria-controls="project-notes"
      >
        Project Notes
      </Btn>
    </header>
  );
}

/* ------------------------------- Media Flow ------------------------------- */

type MediaItemWithDims = MediaItem & {
  dimensions?: { w: number; h: number };
  span2?: boolean; // for square “feature” rows
};

type FlowNode =
  | { kind: "image"; item: MediaItemWithDims; i: number }
  | { kind: "text"; text: string };

function MediaFlow({
  title,
  brief,
  gallery,
  quoteA,
  quoteB,
  hasGallery,
}: {
  title: string;
  brief: string;
  gallery: MediaItemWithDims[];
  quoteA: string;
  quoteB: string;
  hasGallery: boolean;
}) {
  const verticalFlow: FlowNode[] = useMemo(() => {
    const flow: FlowNode[] = [];
    gallery.forEach((item, i) => {
      if (i === 0) flow.push({ kind: "text", text: brief });
      if (i === 1) flow.push({ kind: "text", text: quoteA });
      flow.push({ kind: "image", item, i });
      if (i === 2) flow.push({ kind: "text", text: quoteB });
    });
    return flow;
  }, [gallery, quoteA, quoteB]);

  if (!hasGallery) {
    return (
      <div className="grid gap-8">
        <div className="h-[80vh] rounded-[2px] overflow-hidden">
          <Placeholder className="w-full h-full" />
        </div>
        <Quote text={quoteA} />
        <div className="h-[90vh] rounded-[2px] overflow-hidden">
          <Placeholder className="w-full h-full" />
        </div>
      </div>
    );
  }

  // 2-column responsive grid; quotes take full width
  return (
    <div className="grid grid-cols-2 gap-6">
      {verticalFlow.map((node, idx) =>
        node.kind === "text" ? (
          <div key={`txt-${idx}`} className="col-span-2">
            <Quote text={node.text} />
          </div>
        ) : (
          <MediaCell
            key={`img-${node.item.url}-${node.i}`}
            item={node.item}
            i={node.i}
            title={title}
          />
        )
      )}
    </div>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <div className="py-12">
      <div className="text-2xl md:text-4xl font-semibold leading-[1] tracking-tight">
        {text}
      </div>
    </div>
  );
}

/* --------------------------- Aspect + Media Cell -------------------------- */

function getAspectMeta(item: MediaItemWithDims) {
  // Prefer explicit dimensions if present
  const w = item.dimensions?.w;
  const h = item.dimensions?.h;

  if (w && h) {
    if (w === h) return { kind: "square" as const, span2: !!item.span2 };
    const ratio = w / h;
    // treat near-2:1 as wide (covers 1400x700)
    if (ratio >= 1.8) return { kind: "wide" as const, span2: false };
    // if almost square, treat as square
    if (Math.abs(ratio - 1) < 0.1) return { kind: "square" as const, span2: !!item.span2 };
  }

  // If no dimensions: assume wide for videos; square pairs for images
  if (item.type === "video") return { kind: "wide" as const, span2: false };
  return { kind: "square" as const, span2: !!item.span2 };
}

function MediaCell({
  item,
  i,
  title,
}: {
  item: MediaItemWithDims;
  i: number;
  title: string;
}) {
  const meta = getAspectMeta(item);
  const isSquare = meta.kind === "square";
  const isWide = meta.kind === "wide";
  const span2 = isSquare && meta.span2;

  const colClass = span2 || isWide ? "col-span-2" : "col-span-1";
  const aspectClass = isSquare ? "aspect-square" : "aspect-[2/1]";

  const variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  } as const;

  if (item.type === "image") {
    return (
      <motion.figure
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={`${colClass} ${aspectClass} relative rounded-[2px] overflow-hidden border border-black/5 bg-white`}
      >
        <Image
          src={item.url}
          alt={item.alt ?? title}
          fill
          quality={90}
          sizes="(min-width: 1280px) 50vw, (min-width: 768px) 50vw, 100vw"
          className="w-full h-full object-cover object-center"
          priority={i <= 1}
          loading={i <= 1 ? "eager" : "lazy"}
        />
        <figcaption className="sr-only">{item.alt ?? title}</figcaption>
      </motion.figure>
    );
  }

  // Videos follow the same aspect & spanning rules
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={`${colClass} ${aspectClass} relative rounded-[2px] overflow-hidden border border-black/5 bg-black`}
    >
      <video
        src={item.url}
        className="absolute inset-0 w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
      />
    </motion.div>
  );
}

/* ------------------------------- Notes Drawer ------------------------------ */
function NotesDrawer({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.aside
      id="project-notes"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "45%", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="border-l-2 border-black bg-white overflow-y-auto sticky top-[var(--nav-h,64px)] h-[calc(100vh-var(--nav-h,64px))]"
      aria-label="Project notes and details"
    >
      <div className="px-5 py-4 sticky top-0 bg-white border-b-2 border-black flex items-center justify-between z-10">
        <div className="font-medium">Project Notes</div>
        <button
          className="rounded-full border-2 p-1 hover:bg-black hover:text-white"
          onClick={onClose}
          aria-label="Close notes"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-5 py-5 text-sm grid gap-5">{children}</div>
    </motion.aside>
  );
}

/* --------------------------------- Notes ---------------------------------- */
function NotesTabs({ project }: { project: Project }) {
  const { main, extra } = project;
  const d = main.details;

  const hasLinks = !!(
    d.links &&
    (d.links.behance || d.links.caseStudy || d.links.liveSite || d.links.repo)
  );

  return (
    <div className="w-full space-y-8" role="region" aria-label="Project notes, vertical layout">
      {/* Overview */}
      <section>
        <SectionLabel>Overview</SectionLabel>
        <div className="mt-3 space-y-3">
          <DetailRow label="Client" value={d.client} />
          <DetailRow label="Sector" value={d.sector} />
          <DetailRow label="Discipline" value={d.discipline.join(" / ")} />
          {d.tagline ? <DetailRow label="Tagline" value={d.tagline} /> : null}
          {d.summary ? (
            <div>
              <SectionLabel>Summary</SectionLabel>
              <p>{d.summary}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Scope */}
      <section>
        <SectionLabel>Scope</SectionLabel>
        <div className="mt-3 space-y-3">
          {d.services?.length ? <ListRow label="Services" items={d.services} /> : null}
          {d.deliverables?.length ? <ListRow label="Deliverables" items={d.deliverables} /> : null}
          {d.team?.length ? (
            <div>
              <SectionLabel>Team</SectionLabel>
              <ul className="list-disc pl-5 space-y-1">
                {d.team.map((m) => (
                  <li key={`${m.name}-${m.role}`}>
                    {m.name} — {m.role}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Meta */}
      <section>
        <SectionLabel>Meta</SectionLabel>
        <div className="mt-3 space-y-3">
          {d.timeline ? (
            "label" in d.timeline ? (
              <DetailRow label="Timeline" value={d.timeline.label} />
            ) : (
              <DetailRow
                label="Timeline"
                value={`${d.timeline.start}${d.timeline.end ? ` → ${d.timeline.end}` : ""}`}
              />
            )
          ) : null}
          {d.location ? <DetailRow label="Location" value={d.location} /> : null}
          {hasLinks ? (
            <div>
              <SectionLabel>Links</SectionLabel>
              <div className="flex flex-col gap-1">
                {d.links?.behance ? <ExtLink href={d.links.behance} label="Behance" /> : null}
                {d.links?.caseStudy ? <ExtLink href={d.links.caseStudy} label="Case Study" /> : null}
                {d.links?.liveSite ? <ExtLink href={d.links.liveSite} label="Live Site" /> : null}
                {d.links?.repo ? <ExtLink href={d.links.repo} label="Repo" /> : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Story */}
      <section>
        <SectionLabel>Story</SectionLabel>
        <div className="mt-3">
          {extra?.blocks?.length ? (
            <BlocksRenderer blocks={extra.blocks} />
          ) : (
            <div className="opacity-60">No story provided.</div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ----------------------------- Reusable atoms ----------------------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="uppercase tracking-wider text-[10px] opacity-70 mb-1">{children}</div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <SectionLabel>{label}</SectionLabel>
      <div>{value}</div>
    </div>
  );
}

function ListRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mb-3">
      <SectionLabel>{label}</SectionLabel>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((s) => (
          <li key={s}>{s}</li>
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
      className="inline-flex items-center gap-1 underline hover:opacity-80"
    >
      {label} <ExternalLink size={14} />
    </a>
  );
}

/* ----------------------------- Accessibility ------------------------------ */
/** Attaches a global Escape key handler when `active` is true. */
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
