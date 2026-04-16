// app/content/page.tsx (or any Next.js route)
// Drop this file into a Next.js 13+ /app project. It renders the provided
// `contentBlocks` in visual order, styled with Tailwind CSS.
// - Groups by meta.section (if present)
// - Maps each `type` to a presentational component
// - Provides sensible fallbacks for unknown types
// - Minimal, clean UI with accessible semantics

import React from "react";

// ===== 1) Types =====
export type BlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "list"
  | "button"
  | "stat"
  | "image"
  | "icon"
  | "chart"
  | "quote"
  | "footer"
  | "link";

export type Block = {
  type: BlockType;
  content: string;
  order: number;
  meta?: {
    alt?: string;
    url?: string;
    label?: string;
    section?: string;
  };
};

// ===== 2) Sample data (replace with your imported data) =====
// You can import your real data: `import { contentBlocks } from "@/lib/content"`.
export const contentBlocks: Block[] = [
  { type: "heading", content: "WeeWee - Branding Case Study", order: 1 },

  // Intro meta
  { type: "stat", content: "Client: WeeWee", order: 2, meta: { label: "Client", section: "Page 01" } },
  { type: "stat", content: "Region: Algeria", order: 3, meta: { label: "Region", section: "Page 01" } },
  { type: "stat", content: "Industry: Logistics, Digital Solutions", order: 4, meta: { label: "Industry", section: "Page 01" } },
  { type: "stat", content: "Year: 2023", order: 5, meta: { label: "Year", section: "Page 01" } },

  // Intro paragraph + full-page visual
  { type: "paragraph", content: "WeeWee is a next-generation delivery service redefining logistics in Algeria through technology, efficiency, and a customer-first approach. More than just a courier company, WeeWee leverages smart logistics solutions to ensure faster, more reliable deliveries while fostering a sustainable future.", order: 6, meta: { section: "Page 01" } },
  { type: "image", content: "weewee_page_01.png", order: 7, meta: { alt: "Behance case study header with project meta and introduction", section: "Page 01" } },

  // Scope / Challenge / Outcome (+ page image)
  { type: "subheading", content: "Project Scope", order: 8 },
  { type: "list", content: "Rebranding, Brand strategy, Visual Identity & Logo Design", order: 9 },
  { type: "subheading", content: "Challenge", order: 10 },
  { type: "paragraph", content: "WeeWee delivery started as a basic logistics service focused on fast and affordable deliveries. As the company grew, it needed to stand out in a highly competitive market. The original brand lacked innovation, emotional connection, and a distinct identity, making it harder to build trust and recognition. The old road-inspired logo symbolized movement but not technology, adaptability, or long-term sustainability.", order: 11 },
  { type: "subheading", content: "Outcome", order: 12 },
  { type: "paragraph", content: "The rebrand transformed WeeWee into a tech-driven, customer-first logistics brand. The Maknin (European Finch) mascot replaced the road-based logo, symbolizing speed, intelligence, and adaptability while embedding sustainability into the brand’s long-term vision. The new identity shifts from basic delivery to smart logistics with a bold, recognizable design and a friendly yet professional tone that appeals to B2B and B2C.", order: 13 },
  { type: "image", content: "weewee_page_02.png", order: 14, meta: { alt: "Project scope, challenge, outcome section of the case study", section: "Page 02" } },

  // Visual Exploration (+ logo before/after, moodboard page)
  { type: "heading", content: "Visual Exploration", order: 15 },
  { type: "paragraph", content: "We moved to a mascot-based identity because the original road-inspired logo was too generic and limiting—it represented movement but not the technology, intelligence, or innovation behind WeeWee’s vision.", order: 16 },
  { type: "paragraph", content: "The Maknin (European Goldfinch) was chosen for its cultural significance in Algeria and traits of speed, adaptability, and precision. Integrating it adds emotional resonance and subtly reinforces sustainability.", order: 17 },
  { type: "paragraph", content: "The mascot makes the identity more recognizable and ownable versus abstract or purely typographic marks, giving WeeWee personality, warmth, and trustworthiness.", order: 18 },
  { type: "image", content: "weewee_page_03.png", order: 19, meta: { alt: "Logo before/after, new logo presentation (June 2023), moodboard composite", section: "Page 03" } },

  // Brand Strategy overview (+ page image)
  { type: "subheading", content: "Brand Strategy", order: 20 },
  { type: "paragraph", content: "The rebranding transforms WeeWee from a basic delivery service into a modern, tech-driven logistics brand. By redefining visual language, mascot, and core messaging, the new identity builds emotional connection and future-readiness.", order: 21 },
  { type: "list", content: "Benefits & Value, Brand Goals, Target Audience, Mission, Vision, Personality, Voice, Tone, Attributes, Archetype", order: 22 },
  { type: "image", content: "weewee_page_04.png", order: 23, meta: { alt: "Brand strategy overview page", section: "Page 04" } },

  // Benefits & Value (+ page image)
  { type: "subheading", content: "Benefits & Value", order: 24 },
  { type: "paragraph", content: "Fast, reliable, customer-centric delivery that protects customer rights with user-friendly experiences and sustainability. Supports e-commerce growth with international-standard logistics solutions, emphasizing trust, innovation, and a hassle-free experience.", order: 25 },
  { type: "image", content: "weewee_page_05.png", order: 26, meta: { alt: "Benefits & Value, Brand Goals, Target Audience page", section: "Page 05" } },

  // Goals / Target Audience
  { type: "subheading", content: "Brand Goals", order: 27 },
  { type: "paragraph", content: "Become Algeria’s leading tech-driven logistics startup, revolutionizing e-logistics and e-commerce while inspiring the next generation. Commit to customer rights, service excellence, reliability, and innovation.", order: 28 },
  { type: "subheading", content: "Target Audience", order: 29 },
  { type: "list", content: "Medical analysis centers; E-commerce businesses; Administrative facilities; General consumers (18–65), with 18–35 a priority segment for talent and partnerships.", order: 30 },

  // Mission / Vision (+ page image)
  { type: "subheading", content: "Brand Mission", order: 31 },
  { type: "heading", content: "Delivering Smarter, Moving Faster, Caring More.", order: 32 },
  { type: "paragraph", content: "Foster an honest, trustworthy marketplace with exceptional delivery prioritizing both sellers and buyers. Provide a transparent, hassle-free experience and build long-term relationships based on trust and mutual success.", order: 33 },
  { type: "subheading", content: "Brand Vision", order: 34 },
  { type: "heading", content: "Delivery Done Differently.", order: 35 },
  { type: "paragraph", content: "Transform delivery via innovative, sustainable solutions that prioritize customers. Leverage technology for an efficient, reliable, and eco-friendly experience and set new standards for excellence.", order: 36 },
  { type: "image", content: "weewee_page_06.png", order: 37, meta: { alt: "Mission and Vision with typographic callouts", section: "Page 06" } },

  // Personality / Voice (+ page image)
  { type: "subheading", content: "Brand Personality Traits", order: 38 },
  { type: "list", content: "Balanced feminine–masculine, Youthful, Friendly, Playful, Approachable, Innovative, Simple yet Intelligent", order: 39 },
  { type: "subheading", content: "Brand Voice", order: 40 },
  { type: "paragraph", content: "Friendly, approachable, and intelligently innovative; shows care while staying at the forefront of technology, sustainability, and innovation.", order: 41 },
  { type: "image", content: "weewee_page_07.png", order: 42, meta: { alt: "Brand personality traits and voice page", section: "Page 07" } },

  // Tone / Attributes / Archetype (+ page image)
  { type: "subheading", content: "Brand Tone", order: 43 },
  { type: "paragraph", content: "Engaging and trustworthy; adapts to general consumers, eCommerce partners, and specialized clients. Communication remains clear, approachable, and customer-focused.", order: 44 },
  { type: "subheading", content: "Brand Attributes", order: 45 },
  { type: "list", content: "Caring, Dynamic, Smart, Sustainable, Imaginative, Innovative, Youthful", order: 46 },
  { type: "subheading", content: "Brand Archetype", order: 47 },
  { type: "paragraph", content: "Innovator/Creator: creativity and technology-forward; curious, nonconformist, and impact-driven—aligned with excellence, sustainability, and partnership.", order: 48 },
  { type: "image", content: "weewee_page_08.png", order: 49, meta: { alt: "Tone, attributes, archetype page", section: "Page 08" } },

  // Brand Application + Key Visuals (+ page image)
  { type: "heading", content: "Brand Application", order: 50 },
  { type: "paragraph", content: "Identity applied across real-world touchpoints via mockups and service simulations—illustrating innovative, future-forward delivery experiences.", order: 51 },
  { type: "quote", content: "Your partner of success in your business & beyond.", order: 52, meta: { section: "Brand Key Visual" } },
  { type: "image", content: "weewee_page_09.png", order: 53, meta: { alt: "Brand application: key visual, tagline, service cards", section: "Page 09" } },

  // KPI-style cards (stats) surfaced as text + page image covers them too
  { type: "stat", content: "Trustworthy Delivery — Delivered safe and fast as promised, every second", order: 54, meta: { label: "Reliability", section: "Brand Application" } },
  { type: "stat", content: "Low Return Rate — Our system gets it right the first time", order: 55, meta: { label: "Performance", section: "Brand Application" } },

  // Wrap-up / Credits (+ final page image)
  { type: "heading", content: "Wrap-Up", order: 56 },
  { type: "paragraph", content: "More than a rebrand: redefining what delivery can stand for. Through strategy, design, and storytelling, WeeWee becomes a symbol of trust, innovation, and cultural pride—aligning speed with meaning and connection.", order: 57 },
  { type: "footer", content: "Credits: Visual Identity & Art Direction – Aymen Amokrane; Brand Strategy – Aymen Amokrane; Motion Graphics – Fouzi Merabet; 2D Illustrations – Sara Boufligha", order: 58 },
  { type: "link", content: "work@stufbyaymen.com", order: 59, meta: { url: "mailto:work@stufbyaymen.com", label: "Contact" } },
  { type: "link", content: "LinkedIn | Facebook | Instagram", order: 60, meta: { url: "https://www.behance.net/gallery/221756111/WeeWee-branding-case-study", label: "Social Links" } },
  { type: "image", content: "weewee_page_10.png", order: 61, meta: { alt: "Final wrap-up and credits layout", section: "Page 10" } }
];

// ===== 3) Utilities =====
function groupBySection(blocks: Block[]): Record<string, Block[]> {
  const groups: Record<string, Block[]> = {};
  for (const b of blocks.sort((a, b) => a.order - b.order)) {
    const key = b.meta?.section ?? "Ungrouped";
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  }
  return groups;
}

function splitListContent(content: string): string[] {
  // Supports comma-delimited or newline-delimited lists from OCR
  const parts = content
    .split(/\n|,\s*/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [content];
}

// ===== 4) Presentational components =====
const Heading: React.FC<{ text: string }> = ({ text }) => (
  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{text}</h1>
);

const Subheading: React.FC<{ text: string }> = ({ text }) => (
  <h2 className="text-xl md:text-2xl font-semibold mt-6">{text}</h2>
);

const Paragraph: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-base leading-7 text-gray-800/90">{text}</p>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc pl-6 space-y-1">
    {items.map((item, i) => (
      <li key={i} className="text-base leading-7 text-gray-800/90">{item}</li>
    ))}
  </ul>
);

const CTAButton: React.FC<{ label: string; href?: string }> = ({ label, href }) => (
  <div>
    {href ? (
      <a
        href={href}
        className="inline-block rounded-2xl px-4 py-2 border border-gray-200 shadow-sm hover:shadow transition"
      >
        {label}
      </a>
    ) : (
      <button className="rounded-2xl px-4 py-2 border border-gray-200 shadow-sm hover:shadow transition">
        {label}
      </button>
    )}
  </div>
);

const Stat: React.FC<{ value: string; label?: string }> = ({ value, label }) => (
  <div className="rounded-2xl border border-gray-200 p-4 shadow-sm">
    <div className="text-lg font-medium">{value}</div>
    {label ? <div className="text-sm text-gray-500">{label}</div> : null}
  </div>
);

const ImageBlock: React.FC<{ src: string; alt?: string }>= ({ src, alt }) => (
  // Using <img> so this works both inside and outside Next.js runtime
  <img src={src} alt={alt ?? ""} className="w-full rounded-2xl border border-gray-100" />
);

const IconBlock: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => (
  <img src={src} alt={alt ?? "icon"} className="h-10 w-10" />
);

const ChartBlock: React.FC<{ alt?: string }> = ({ alt }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
    Chart placeholder{alt ? `: ${alt}` : ""}
  </div>
);

const QuoteBlock: React.FC<{ text: string }> = ({ text }) => (
  <blockquote className="border-l-4 pl-4 italic text-gray-700">{text}</blockquote>
);

const FooterBlock: React.FC<{ text: string }> = ({ text }) => (
  <footer className="text-sm text-gray-500">{text}</footer>
);

const LinkBlock: React.FC<{ text: string; href?: string }> = ({ text, href }) => (
  <a href={href ?? "#"} className="text-blue-600 underline underline-offset-2">
    {text}
  </a>
);

// ===== 5) Main renderer =====
const BlockRenderer: React.FC<{ block: Block }> = ({ block }) => {
  const { type, content, meta } = block;
  switch (type) {
    case "heading":
      return <Heading text={content} />;
    case "subheading":
      return <Subheading text={content} />;
    case "paragraph":
      return <Paragraph text={content} />;
    case "list":
      return <BulletList items={splitListContent(content)} />;
    case "button":
      return <CTAButton label={meta?.label ?? content} href={meta?.url} />;
    case "stat":
      return <Stat value={content} label={meta?.label} />;
    case "image":
      return <ImageBlock src={content} alt={meta?.alt} />;
    case "icon":
      return <IconBlock src={content} alt={meta?.alt} />;
    case "chart":
      return <ChartBlock alt={meta?.alt} />;
    case "quote":
      return <QuoteBlock text={content} />;
    case "footer":
      return <FooterBlock text={content} />;
    case "link":
      return <LinkBlock text={content} href={meta?.url} />;
    default:
      return (
        <div className="rounded-xl border p-4 text-sm text-gray-500">
          Unknown block type: <code>{type}</code>
        </div>
      );
  }
};

// ===== 6) Page layout =====
export default function ContentPage() {
  const groups = groupBySection(contentBlocks);
  const sectionKeys = Object.keys(groups);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Content Preview</h1>
        <p className="text-sm text-gray-600">Mapping structured OCR content into UI blocks.</p>
      </header>

      {/* Render sections if any exist; otherwise render a flat list */}
      {sectionKeys.length > 1 || sectionKeys[0] !== "Ungrouped" ? (
        <div className="space-y-12">
          {sectionKeys.map((section) => (
            <section key={section} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border border-gray-300" />
                <h2 className="text-lg font-medium tracking-tight">{section}</h2>
              </div>
              <div className="space-y-4">
                {groups[section].map((b) => (
                  <BlockRenderer key={`${b.type}-${b.order}`} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {contentBlocks
            .sort((a, b) => a.order - b.order)
            .map((b) => (
              <BlockRenderer key={`${b.type}-${b.order}`} block={b} />
            ))}
        </div>
      )}
    </main>
  );
}
