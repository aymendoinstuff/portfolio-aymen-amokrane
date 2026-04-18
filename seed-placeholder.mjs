import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: "portfolio-aymen-amokrane",
    clientEmail: "firebase-adminsdk-fbsvc@portfolio-aymen-amokrane.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDX2cdVpw51CXu2
i4JWWE7ZDD2jSePJn91kimHJuhymLAVNBc0h6LdmCb+tyAzPXW66jsDoa5Rb8JS+
FqoAP2tPak8L2Ze9/sI4cFBFZqyQX+NVBbQ9AG3wihEDtB3E1QSG3Qf0K8Ce90WI
yu+s2yV5al1QIeuWj+jkZAmNIcXrRBoBTXCSlzTKnk00zTO5gLd2hWb9eyj9IcHb
D3d6vXIy7TWz5RH7T70Sanxb9agJHVZJlLyxZ4cmVPYvc+QRHWaSbLn+vYIdd53j
rA4JeyOHISzdkuRhNlSZYtQDe1uBaVlEmLyGKuJ47JU307yO2pE6OT3FBNXznpk4
YgdGXJerAgMBAAECggEABPA5mRV4xWeEvUXVCVt9ELnKXmyeJoqR/e8TxhHyl9nh
lF2+nLj+gS1V6+7r906TuvbxjB++xcyFfd5DRqNgAotT6NlLzHZoqr8YrXQ06U5L
g2V3AzJGuAsgnboTa3s7Xq6HgQ5pml/dgMyyNEoE26tGtg+gnGtvqgU6TR1QGIE5
AtYvHCe0D2FBPhal75/uRjFYxJLUArD/aItsw19uiUzz6UDcbs9ZTdcVTO1P50ym
7TOSVVvB1n+vpHR7y6c14UCE74nwbR/5Wd4eJbp+or/arpm/QmopMAlnIV0eZkuL
YPy04eRcQXui7SFdvdCjOoOkvaUCAAsRkDbXYKig2QKBgQDuI6Tl1mKyDwiCpFx8
7AUJTPzboIjx0pieMRyHexXlQDm+0uVXFKjhyLixgnU21IC2Mn5JHTtqfppLul7M
Sy+pgb4tapukKqNUJSBmXvwk/5SFV4I23WgcIeQlcgQfH9zCw3qMMMWDpdO5b4oY
/qsOH7dA4T3O9zreAUlsbBWZZQKBgQDoCi/XZ9NcIedu0ihi9ZgtGYPN/1mUxtv2
f0swZnjRoRMS7frDmKnGFZ9c9n2I1VCtkbFadWPxYaNr+nkiik6XQPdAC5mO4yfd
72XrghfO4wxKXIDXJYWxJITvufSp/ZOKkImr8ihTEhUiimXDhyyi5xHxMkpH20FY
G0P5FM3jzwKBgG+/5ke8vP/VsiasPoKYtxxQNnBR+zGPo/LIFR02k2XLJ832ZYzh
swaRDKqwD5U1T1kwhLaGszUcSAe1Y3r25Vzj93yUhIkbQR3hdjzT4fryvJ1+HSrl
508cUFWKFYkNiKkU1lMnJ+jJTnu8bc+g4mB0XahiioCu378CV5Q7fD9JAoGBANgu
dXgYcSCLLdVf0uSvr4GFHflUB5/GzbQP0HtdXP7hNKYUNeb5WmMETh8MPtS2+J1c
+YEvkVeYAetdxnHZrXLZwgFXTU+EbuYkXi5WW9wSSKcXG6pWeQIa5gd6lmmxqD4W
f01FJTCPzkUJ79mFHJ8A7QRsOCxOJ8jwThnHujKdAoGBALaKyxh93xkcNaRsNV9O
VBLe2Ed7dCjqLiNoW3/KC3R83MdbFmeQ1y3yhpd0viHKsLWU7OQE+88iZrBkV7qQ
POyB2Zekam53wKbKyPDtDDY0j4qI1o3EThquz79g/YyQ01761DPnkAF68cYsYISB
PXLqx/cOosBN9p9YEnoWc12u
-----END PRIVATE KEY-----
`,
  }),
});

const db = getFirestore(app);

// Colored placeholder: placehold.co/WxH/bg/text
const col = (w, h, hex, label = "+") =>
  `https://placehold.co/${w}x${h}/${hex.replace("#", "")}/ffffff?text=${encodeURIComponent(label)}`;

// Real photo: picsum
const pic = (w, h, seed) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const now = Date.now();

// ─────────────────────────────────────────────────────────────
// PROJECT 1 — Nebula AI  (Tech brand, dark/complex)
// ─────────────────────────────────────────────────────────────
const nebula = {
  general: {
    id: "nebula-brand-identity",
    title: "Nebula — Brand Identity",
    slug: "nebula-brand-identity",
    year: 2024,
    tags: ["Branding", "Motion", "Digital", "Print"],
    industry: "Technology",
    heroUrl: col(1600, 700, "0a0e1a", "Nebula"),
    published: true,
    createdAt: now - 5 * 86400000,
    updatedAt: now - 5 * 86400000,
  },
  main: {
    brief: "Full brand identity for a next-gen AI infrastructure company — from logomark to motion language to design system.",
    gallery: [],
    details: {
      client: "Nebula AI",
      sector: "Technology / SaaS",
      discipline: ["Brand Identity", "Motion Design", "Design System"],
      tagline: "Building the visual language of a company that thinks in light-years.",
      summary: "Complete brand system for an AI startup — logo, type, motion, and a 240-component Figma design system.",
      team: [
        { name: "Aymen Amokrane", role: "Creative Director" },
        { name: "Sara Mendes", role: "Brand Designer" },
        { name: "Kenji Watanabe", role: "Motion Designer" },
      ],
      services: ["Brand Strategy", "Visual Identity", "Motion Design", "Brand Guidelines"],
      deliverables: ["Logo System", "Brand Guidelines (120pp)", "Motion Toolkit", "Design System"],
      timeline: { start: "2024-01", end: "2024-06" },
      location: "Paris, France",
      links: { behance: "https://www.behance.net/" },
    },
  },
  extra: {
    blocks: [
      { id: "n1", type: "heading", level: 1, text: "The Brief", style: { size: "4xl", bold: true } },
      { id: "n2", type: "paragraph", text: "Nebula's founding team had a deck full of technical diagrams and zero visual identity. Their Series A was six months away. The brief: build a brand that communicates speed, intelligence, and trust — without the clichéd blue-gradient-robot aesthetic that dominates the AI space.\n\nWe started with a two-week discovery sprint, interviewing founders, engineers, and prospective customers. The core insight: Nebula's differentiator isn't just what their product does — it's how quietly it does it. Invisible infrastructure. Effortless power.", style: { size: "base" } },
      { id: "n3", type: "image", item: { type: "image", url: col(1600, 900, "0a0e1a", "Hero — Dark"), alt: "Hero" }, caption: "Brand territory exploration — 'deep space meets precision engineering'." },
      { id: "n4", type: "heading", level: 2, text: "Logomark & Wordmark", style: { size: "2xl", bold: true } },
      { id: "n5", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 700, "0a0e1a", "Logo — Dark"), alt: "Dark" },
        { type: "image", url: col(900, 700, "f5f4f0", "Logo — Light"), alt: "Light" },
      ], caption: "Logo on deep space (primary) and solar (reverse) backgrounds." },
      { id: "n6", type: "paragraph", text: "The logomark is a stylised orbital path — a single continuous line forming an implicit 'N' while evoking satellite trajectories and atomic structure. The wordmark pairs it with a custom-spaced geometric sans, slightly tightened to feel proprietary.", style: { size: "base" } },
      { id: "n7", type: "quote", text: "We didn't want a logo that announced itself. We wanted one that made people feel like they'd always known it.", cite: "— Marcus Chen, CEO, Nebula AI", style: { size: "xl", italic: true, color: "#3b82f6" } },
      { id: "n8", type: "heading", level: 2, text: "Colour System", style: { size: "2xl", bold: true } },
      { id: "n9", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 400, "0a0e1a", "Deep Space\n#0A0E1A"), alt: "Deep Space" },
        { type: "image", url: col(600, 400, "3b82f6", "Pulsar Blue\n#3B82F6"), alt: "Pulsar Blue" },
        { type: "image", url: col(600, 400, "f5f4f0", "Solar White\n#F5F4F0"), alt: "Solar White" },
      ], caption: "Three-colour palette: depth, energy, clarity." },
      { id: "n10", type: "heading", level: 2, text: "Typography", style: { size: "2xl", bold: true } },
      { id: "n11", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 500, "1a1a2e", "GT Alpina — Display"), alt: "Display" },
        { type: "image", url: col(900, 500, "2d2d3a", "Inter — UI & Body"), alt: "Body" },
      ], caption: "GT Alpina for display, Inter for UI — set on an 8pt baseline grid." },
      { id: "n12", type: "image", item: { type: "image", url: col(1600, 1000, "111827", "Brand Guidelines — 120 pages"), alt: "Guidelines" }, caption: "A spread from the 120-page brand guidelines document." },
      { id: "n13", type: "heading", level: 2, text: "Motion Language", style: { size: "2xl", bold: true } },
      { id: "n14", type: "paragraph", text: "Three motion principles: fluidity, precision, restraint. Transitions ease in with a custom cubic-bezier that evokes the smoothness of Nebula's infrastructure — nothing bounces, nothing spins gratuitously. The logo animation draws the orbital path from a single point, assembles the mark, then fades the wordmark in. Total duration: 1.2s.", style: { size: "base" } },
      { id: "n15", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 600, "0f172a", "Logo Reveal\n1.2s"), alt: "Logo" },
        { type: "image", url: col(600, 600, "1e293b", "Page Transition\n0.4s"), alt: "Page" },
        { type: "image", url: col(600, 600, "334155", "Data Load\n0.8s"), alt: "Data" },
      ], caption: "Three core motion moments: logo reveal, page transition, data load." },
      { id: "n16", type: "heading", level: 2, text: "Print & Collateral", style: { size: "2xl", bold: true } },
      { id: "n17", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 1100, "0a0e1a", "Business Cards\nSpot UV"), alt: "Cards" },
        { type: "image", url: col(900, 1100, "111827", "Letterhead\n& Envelope"), alt: "Letter" },
      ], caption: "Business cards with spot UV on deep space, letterhead on uncoated stock." },
      { id: "n18", type: "image", item: { type: "image", url: col(1600, 700, "0a0e1a", "Environmental — Lobby Signage"), alt: "Signage" }, caption: "Environmental application — lobby signage at Nebula HQ, Paris." },
      { id: "n19", type: "heading", level: 2, text: "Design System", style: { size: "2xl", bold: true } },
      { id: "n20", type: "grid", columns: 3, items: [
        { type: "image", url: col(800, 600, "1e3a5f", "Components\n240 total"), alt: "Components" },
        { type: "image", url: col(800, 600, "1a365d", "Dashboard UI\nDark mode"), alt: "Dashboard" },
        { type: "image", url: col(800, 600, "153450", "Mobile App\niOS & Android"), alt: "Mobile" },
      ], caption: "240 Figma components across 12 categories — dark/light mode with one toggle." },
      { id: "n21", type: "quote", text: "Six months, one brand, zero compromises.", cite: "— Studio", style: { size: "3xl", bold: true, align: "center" } },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PROJECT 2 — Forma Architecture  (Architecture firm)
// ─────────────────────────────────────────────────────────────
const forma = {
  general: {
    id: "forma-architecture",
    title: "Forma — Architecture Identity",
    slug: "forma-architecture",
    year: 2024,
    tags: ["Architecture", "Branding", "Wayfinding", "Print"],
    industry: "Architecture",
    heroUrl: col(1600, 700, "c8b99a", "Forma"),
    published: true,
    createdAt: now - 4 * 86400000,
    updatedAt: now - 4 * 86400000,
  },
  main: {
    brief: "Brand identity and wayfinding system for a boutique architecture studio specialising in adaptive reuse of industrial buildings.",
    gallery: [],
    details: {
      client: "Forma Studio",
      sector: "Architecture / Real Estate",
      discipline: ["Brand Identity", "Wayfinding", "Publication Design"],
      tagline: "An identity as honest and structural as the buildings they design.",
      summary: "Brand identity, wayfinding, and monograph design for a boutique architecture studio.",
      team: [
        { name: "Aymen Amokrane", role: "Art Director" },
        { name: "Inès Lefebvre", role: "Graphic Designer" },
      ],
      services: ["Brand Identity", "Wayfinding System", "Monograph Design", "Signage"],
      deliverables: ["Logo System", "Wayfinding Kit", "200pp Monograph", "Signage Templates"],
      timeline: { start: "2023-09", end: "2024-02" },
      location: "Lyon, France",
      links: {},
    },
  },
  extra: {
    blocks: [
      { id: "f1", type: "image", item: { type: "image", url: col(1600, 1000, "c8b99a", "Forma HQ — Converted Warehouse"), alt: "HQ" }, caption: "Forma's studio occupies a converted textile warehouse in Lyon's Confluence district." },
      { id: "f2", type: "heading", level: 1, text: "Structure as Identity", style: { size: "4xl", bold: true } },
      { id: "f3", type: "paragraph", text: "Forma came to us with a problem most studios envy: too much work, not enough brand. Their portfolio was extraordinary — adaptive reuse projects that turned derelict factories into schools, warehouses into cultural centres, silos into housing. But their identity was a mess of inconsistent typefaces and a logo that looked like it was made in 2003.\n\nThe brief was to create something that felt as structurally rigorous as their buildings — nothing decorative for decoration's sake.", style: { size: "base" } },
      { id: "f4", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 800, "d4c5b0", "Before — Old Logo"), alt: "Before" },
        { type: "image", url: col(600, 800, "b8a898", "Process — Sketches"), alt: "Sketches" },
        { type: "image", url: col(600, 800, "8b7355", "After — New Logo"), alt: "After" },
      ], caption: "Before / process / after — three months of iteration condensed into three frames." },
      { id: "f5", type: "heading", level: 2, text: "The Mark", style: { size: "2xl", bold: true } },
      { id: "f6", type: "paragraph", text: "The logomark is derived from structural section drawings — the kind architects use to show how a building is cut. Two overlapping rectangles, offset by a single line weight, forming an 'F' that implies depth, layering, and construction. It works at any scale, from a 3mm emboss on a business card to a 3m sign on a building facade.", style: { size: "base" } },
      { id: "f7", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 700, "f5f0e8", "Logo — Warm White"), alt: "White" },
        { type: "image", url: col(900, 700, "3d3530", "Logo — Charcoal"), alt: "Dark" },
      ], caption: "Two primary expressions: warm white for print, charcoal for digital." },
      { id: "f8", type: "quote", text: "The new identity finally matches the quality of what we build. Clients notice immediately.", cite: "— Claire Aumont, Founding Partner, Forma", style: { size: "xl", italic: true, color: "#8b7355" } },
      { id: "f9", type: "heading", level: 2, text: "Wayfinding System", style: { size: "2xl", bold: true } },
      { id: "f10", type: "paragraph", text: "Forma's largest project — the Roux-Combaluzier building conversion — needed a full wayfinding system. We designed a modular signage family using raw aluminium panels with routed letters. No paint, no vinyl — the material IS the message.", style: { size: "base" } },
      { id: "f11", type: "image", item: { type: "image", url: col(1600, 800, "a09080", "Wayfinding — Roux-Combaluzier Building"), alt: "Wayfinding" }, caption: "Wayfinding system across 6 floors — raw aluminium, routed letterforms." },
      { id: "f12", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 600, "c4b8a8", "Floor Directories"), alt: "Dir" },
        { type: "image", url: col(600, 600, "b0a090", "Room Numbering"), alt: "Rooms" },
        { type: "image", url: col(600, 600, "9c8c7c", "Exit & Safety"), alt: "Exit" },
      ], caption: "Three sign families: directory, room ID, safety — all from the same aluminium module." },
      { id: "f13", type: "heading", level: 2, text: "The Monograph", style: { size: "2xl", bold: true } },
      { id: "f14", type: "paragraph", text: "To celebrate 15 years of practice, we designed a 200-page monograph documenting eight key projects. Printed on uncoated stock with a linen-bound hardcover, the book is as much an object as it is a document. Section dividers use translucent tracing paper — a nod to the architectural drawings that started each project.", style: { size: "base" } },
      { id: "f15", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 1200, "d8cfc4", "Monograph Cover\nLinen-bound"), alt: "Cover" },
        { type: "image", url: col(900, 1200, "c4b8aa", "Monograph Spread\nProject chapter"), alt: "Spread" },
      ], caption: "200-page monograph — linen hardcover, uncoated interior, tracing paper dividers." },
      { id: "f16", type: "quote", text: "Honest materials. Structural thinking. Nothing added that isn't necessary.", cite: "— Design principle, Forma project", style: { size: "2xl", bold: true, align: "center" } },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PROJECT 3 — Pulse Records  (Music label rebrand)
// ─────────────────────────────────────────────────────────────
const pulse = {
  general: {
    id: "pulse-records-rebrand",
    title: "Pulse Records — Rebrand",
    slug: "pulse-records-rebrand",
    year: 2023,
    tags: ["Branding", "Music", "Packaging", "Digital"],
    industry: "Entertainment",
    heroUrl: col(1600, 700, "e63946", "Pulse"),
    published: true,
    createdAt: now - 3 * 86400000,
    updatedAt: now - 3 * 86400000,
  },
  main: {
    brief: "Full rebrand of an independent electronic music label — new identity, vinyl packaging system, and digital presence.",
    gallery: [],
    details: {
      client: "Pulse Records",
      sector: "Music / Entertainment",
      discipline: ["Brand Identity", "Packaging", "Digital Design"],
      tagline: "A label identity that sounds as good as it looks.",
      summary: "Complete rebrand for an independent electronic music label — identity, vinyl packaging, and digital.",
      team: [
        { name: "Aymen Amokrane", role: "Creative Director" },
        { name: "Nour Belhadj", role: "Designer" },
        { name: "Tom Vickers", role: "Illustrator" },
      ],
      services: ["Brand Strategy", "Visual Identity", "Packaging", "Web Design"],
      deliverables: ["Logo System", "Vinyl Sleeve Template", "Website", "Social Kit", "Press Kit"],
      timeline: { start: "2023-03", end: "2023-09" },
      location: "Berlin, Germany",
      links: { liveSite: "https://example.com/" },
    },
  },
  extra: {
    blocks: [
      { id: "p1", type: "heading", level: 1, text: "Sound Meets Vision", style: { size: "4xl", bold: true, color: "#e63946" } },
      { id: "p2", type: "paragraph", text: "Pulse Records has been releasing electronic music since 2009. Fourteen years of incredible output — and a brand that hadn't evolved since their MySpace era. The founders knew it was time. The ask: honour the label's roots in Berlin's underground scene while positioning them for the streaming and vinyl-revival era simultaneously.", style: { size: "base" } },
      { id: "p3", type: "image", item: { type: "image", url: col(1600, 900, "e63946", "Identity Overview"), alt: "Identity" }, caption: "The new identity in full: aggressive, rhythmic, unmistakably Pulse." },
      { id: "p4", type: "heading", level: 2, text: "The Logo", style: { size: "2xl", bold: true } },
      { id: "p5", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 600, "e63946", "Red — Primary"), alt: "Red" },
        { type: "image", url: col(600, 600, "1a1a1a", "Black — Secondary"), alt: "Black" },
        { type: "image", url: col(600, 600, "f1faee", "White — Reverse"), alt: "White" },
      ], caption: "Three colour expressions — red is primary, black and white for flexibility." },
      { id: "p6", type: "paragraph", text: "The mark is a waveform abstracted to its minimal form — four vertical bars of increasing height that together spell a beat, a pulse, a rise. It's immediately readable as music without resorting to notes or headphones. At small sizes it functions as a favicon and social avatar. Animated, the bars pulse in sequence.", style: { size: "base" } },
      { id: "p7", type: "quote", text: "It looks like it could be on a warehouse wall at 3am. That's exactly what we wanted.", cite: "— Daniel Krug, A&R Director, Pulse Records", style: { size: "xl", italic: true, color: "#e63946" } },
      { id: "p8", type: "heading", level: 2, text: "Vinyl Packaging System", style: { size: "2xl", bold: true } },
      { id: "p9", type: "paragraph", text: "Vinyl is the label's flagship format — they press limited runs of 500 for every release. The packaging system had to work as both a product and a collectable. We designed a modular sleeve template where the label's grid system defines composition, but each artist and release can own a distinct colour and visual world within it.", style: { size: "base" } },
      { id: "p10", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 900, "e63946", "Release 001\n12\" Sleeve"), alt: "001" },
        { type: "image", url: col(900, 900, "457b9d", "Release 002\n12\" Sleeve"), alt: "002" },
      ], caption: "First two releases using the new sleeve system — same grid, different worlds." },
      { id: "p11", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 600, "e63946", "Sleeve Front"), alt: "Front" },
        { type: "image", url: col(600, 600, "c1121f", "Sleeve Back"), alt: "Back" },
        { type: "image", url: col(600, 600, "9d0208", "Inner Sleeve"), alt: "Inner" },
      ], caption: "Front, back, and inner sleeve — the full 12\" unboxing experience." },
      { id: "p12", type: "heading", level: 2, text: "Digital Presence", style: { size: "2xl", bold: true } },
      { id: "p13", type: "image", item: { type: "image", url: col(1600, 900, "1a1a1a", "Website — Dark Theme"), alt: "Website" }, caption: "Website redesign — dark, immersive, release-forward." },
      { id: "p14", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 600, "111111", "Release Page — Desktop"), alt: "Desktop" },
        { type: "image", url: col(900, 600, "1a1a1a", "Artist Page — Mobile"), alt: "Mobile" },
      ], caption: "Release and artist pages — designed for discovery and streaming hand-off." },
      { id: "p15", type: "quote", text: "The identity finally sounds like our music.", cite: "— Pulse Records", style: { size: "3xl", bold: true, align: "center", color: "#e63946" } },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PROJECT 4 — Verdant Packaging  (Sustainable brand)
// ─────────────────────────────────────────────────────────────
const verdant = {
  general: {
    id: "verdant-packaging",
    title: "Verdant — Sustainable Packaging",
    slug: "verdant-packaging",
    year: 2023,
    tags: ["Packaging", "Branding", "Sustainability", "Illustration"],
    industry: "Consumer Goods",
    heroUrl: col(1600, 700, "2d6a4f", "Verdant"),
    published: true,
    createdAt: now - 2 * 86400000,
    updatedAt: now - 2 * 86400000,
  },
  main: {
    brief: "Brand identity and packaging design for a zero-waste personal care brand — all packaging compostable or refillable.",
    gallery: [],
    details: {
      client: "Verdant Co.",
      sector: "Consumer Goods / Sustainability",
      discipline: ["Packaging Design", "Brand Identity", "Illustration"],
      tagline: "Beautiful packaging that disappears when you're done with it.",
      summary: "Brand identity and zero-waste packaging system for a sustainable personal care range.",
      team: [
        { name: "Aymen Amokrane", role: "Creative Director" },
        { name: "Maria Santos", role: "Packaging Designer" },
        { name: "Yuki Tanaka", role: "Illustrator" },
      ],
      services: ["Brand Identity", "Packaging Design", "Illustration", "Retail Strategy"],
      deliverables: ["Logo", "12-SKU Packaging System", "Illustration Library", "Retail Display"],
      timeline: { start: "2023-01", end: "2023-07" },
      location: "Amsterdam, Netherlands",
      links: {},
    },
  },
  extra: {
    blocks: [
      { id: "v1", type: "image", item: { type: "image", url: col(1600, 900, "2d6a4f", "Verdant Full Range"), alt: "Range" }, caption: "The full Verdant range — 12 SKUs, all compostable or refillable." },
      { id: "v2", type: "heading", level: 1, text: "Packaging That Disappears", style: { size: "4xl", bold: true, color: "#2d6a4f" } },
      { id: "v3", type: "paragraph", text: "Verdant's promise is radical: every piece of their packaging either composts in 90 days or can be refilled indefinitely. The design challenge was making that sustainability feel premium rather than preachy. Sustainable shouldn't mean boring.", style: { size: "base" } },
      { id: "v4", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 800, "40916c", "Shampoo Bar\nCompostable wrap"), alt: "Shampoo" },
        { type: "image", url: col(600, 800, "52b788", "Body Lotion\nRefillable glass"), alt: "Lotion" },
        { type: "image", url: col(600, 800, "74c69d", "Face Serum\nSeed-paper box"), alt: "Serum" },
      ], caption: "Three hero products — each packaging format serves a different sustainability purpose." },
      { id: "v5", type: "heading", level: 2, text: "The Illustration System", style: { size: "2xl", bold: true } },
      { id: "v6", type: "paragraph", text: "Each product in the range has its own botanical illustration — hand-drawn, then digitised at high resolution. The illustrations wrap around the packaging, creating a continuous scene when products are displayed together. The illustrative style references 19th-century botanical prints but with a contemporary flat-colour palette.", style: { size: "base" } },
      { id: "v7", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 700, "1b4332", "Illustration Process\nSketch to final"), alt: "Process" },
        { type: "image", url: col(900, 700, "2d6a4f", "Illustration Applied\nOn packaging"), alt: "Applied" },
      ], caption: "From sketch to packaging — botanical illustrations by Yuki Tanaka." },
      { id: "v8", type: "quote", text: "The packaging is so beautiful our customers frame it after use instead of composting it. We consider that a success.", cite: "— Sophie van der Berg, Founder, Verdant", style: { size: "xl", italic: true, color: "#2d6a4f" } },
      { id: "v9", type: "heading", level: 2, text: "Retail Display", style: { size: "2xl", bold: true } },
      { id: "v10", type: "image", item: { type: "image", url: col(1600, 800, "081c15", "Retail Display — Harrods"), alt: "Display" }, caption: "Retail display at Harrods, London — cork shelving, botanical backdrops." },
      { id: "v11", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 600, "1b4332", "Shelf Unit\nFront"), alt: "Shelf" },
        { type: "image", url: col(600, 600, "2d6a4f", "Detail\nLabels"), alt: "Labels" },
        { type: "image", url: col(600, 600, "40916c", "Point of Sale\nMaterials"), alt: "POS" },
      ], caption: "Retail detail — every material in the display is also compostable." },
      { id: "v12", type: "quote", text: "Sustainability is the brief. Beauty is the work.", cite: "— Studio", style: { size: "2xl", bold: true, align: "center", color: "#2d6a4f" } },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PROJECT 5 — Atlas Magazine  (Editorial design)
// ─────────────────────────────────────────────────────────────
const atlas = {
  general: {
    id: "atlas-magazine",
    title: "Atlas — Magazine Design",
    slug: "atlas-magazine",
    year: 2022,
    tags: ["Editorial", "Typography", "Print", "Art Direction"],
    industry: "Media",
    heroUrl: col(1600, 700, "212529", "Atlas"),
    published: true,
    createdAt: now - 1 * 86400000,
    updatedAt: now - 1 * 86400000,
  },
  main: {
    brief: "Art direction and design of Atlas, a biannual print magazine about geography, migration, and cultural identity.",
    gallery: [],
    details: {
      client: "Atlas Media",
      sector: "Media / Publishing",
      discipline: ["Editorial Design", "Art Direction", "Typography"],
      tagline: "Where you're from shapes who you are — a magazine that takes that seriously.",
      summary: "Art direction and design for a biannual print magazine on geography and cultural identity.",
      team: [
        { name: "Aymen Amokrane", role: "Art Director" },
        { name: "Fatima El Idrissi", role: "Editorial Designer" },
      ],
      services: ["Art Direction", "Editorial Design", "Typography", "Photo Editing"],
      deliverables: ["3 Issues (Vol 4–6)", "Style Guide", "Digital Editions", "Cover System"],
      timeline: { label: "2022–ongoing" },
      location: "Paris, France",
      links: {},
    },
  },
  extra: {
    blocks: [
      { id: "a1", type: "heading", level: 1, text: "Three Issues, One Voice", style: { size: "4xl", bold: true } },
      { id: "a2", type: "paragraph", text: "Atlas approached us after three issues that felt visually inconsistent — each one designed differently as contributors changed. The editorial vision was strong; the visual language needed to match it. We took over art direction from Volume 4, establishing a rigorous typographic system and grid that could flex with the content while remaining unmistakably Atlas.", style: { size: "base" } },
      { id: "a3", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 800, "212529", "Vol 4 Cover\nMigration"), alt: "Vol4" },
        { type: "image", url: col(600, 800, "343a40", "Vol 5 Cover\nBorders"), alt: "Vol5" },
        { type: "image", url: col(600, 800, "495057", "Vol 6 Cover\nHome"), alt: "Vol6" },
      ], caption: "Three covers — same system, different themes: Migration, Borders, Home." },
      { id: "a4", type: "heading", level: 2, text: "The Grid", style: { size: "2xl", bold: true } },
      { id: "a5", type: "paragraph", text: "The underlying grid is a 12-column system with a generous outer margin — 23mm on A4 — that references the white space of academic journals while allowing for dramatic full-bleed photography. Text columns are set in groups of three or four depending on the section, with a consistent 5mm gutter.", style: { size: "base" } },
      { id: "a6", type: "image", item: { type: "image", url: col(1600, 900, "1a1d20", "Grid System Diagram"), alt: "Grid" }, caption: "The 12-column grid — rigid in structure, generous in execution." },
      { id: "a7", type: "heading", level: 2, text: "Typography", style: { size: "2xl", bold: true } },
      { id: "a8", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 600, "212529", "Tiempos — Display"), alt: "Display" },
        { type: "image", url: col(900, 600, "343a40", "Suisse Int'l — Body"), alt: "Body" },
      ], caption: "Tiempos for display (warmth, authority), Suisse Int'l for body (neutrality, precision)." },
      { id: "a9", type: "quote", text: "A good magazine grid is like good architecture: invisible when it's working, obvious when it's not.", cite: "— Internal design brief, Atlas Vol. 4", style: { size: "xl", italic: true } },
      { id: "a10", type: "heading", level: 2, text: "Spreads", style: { size: "2xl", bold: true } },
      { id: "a11", type: "image", item: { type: "image", url: col(1600, 1000, "1a1d20", "Vol 5 — Opening Spread"), alt: "Spread1" }, caption: "Opening spread, Vol 5: 'Borders' — full-bleed photograph, no headline." },
      { id: "a12", type: "grid", columns: 2, items: [
        { type: "image", url: col(900, 700, "2b2f33", "Essay spread — dense text"), alt: "Essay" },
        { type: "image", url: col(900, 700, "3d4347", "Photo essay — loose grid"), alt: "Photo" },
      ], caption: "Two modes: essay (dense, typographic) and photo essay (open, image-led)." },
      { id: "a13", type: "grid", columns: 3, items: [
        { type: "image", url: col(600, 800, "212529", "Pull quote\nlayout"), alt: "Pull" },
        { type: "image", url: col(600, 800, "343a40", "Data viz\nspread"), alt: "Data" },
        { type: "image", url: col(600, 800, "495057", "Portrait\nseries"), alt: "Portrait" },
      ], caption: "Three layout typologies — every spread has a deliberate mode." },
      { id: "a14", type: "heading", level: 2, text: "Vol 6: Home", style: { size: "2xl", bold: true } },
      { id: "a15", type: "paragraph", text: "The third issue we art-directed — 'Home' — was the most complex: 180 pages, 14 contributors, photography across 11 countries. We introduced a secondary paper stock (a warm cream uncoated) for the personal essay sections, differentiating them from the coated main body. The result is a magazine that feels different in your hands as you move through it.", style: { size: "base" } },
      { id: "a16", type: "image", item: { type: "image", url: col(1600, 900, "2b2f33", "Vol 6 — Full Layout"), alt: "Vol6Full" }, caption: "Vol 6 'Home' — 180 pages, two paper stocks, 11 countries." },
      { id: "a17", type: "quote", text: "Atlas reads like a conversation between the world's best photographers and the world's most careful typographer.", cite: "— Eye Magazine review, 2023", style: { size: "xl", italic: true, align: "center" } },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Write all 5 projects
// ─────────────────────────────────────────────────────────────
const projects = [nebula, forma, pulse, verdant, atlas];

for (const project of projects) {
  await db.collection("projects").doc(project.general.id).set(project, { merge: false });
  console.log(`✅  ${project.general.title}`);
}

console.log("\n🔗  URLs:");
for (const p of projects) {
  console.log(`   /work/${p.general.slug}`);
}

process.exit(0);
