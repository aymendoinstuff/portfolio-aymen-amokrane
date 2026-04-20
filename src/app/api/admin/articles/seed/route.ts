import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

const PLACEHOLDER_ARTICLES = [
  {
    id: "brand-identity-guide",
    title: "What Makes a Strong Brand Identity?",
    slug: "brand-identity-guide",
    excerpt: "A brand is more than a logo — it's the full system of how a company shows up in the world. Here's how to build one that lasts.",
    category: "Branding",
    tags: ["brand identity", "strategy", "design systems"],
    body: `A strong brand identity starts with clarity. Before you design anything, you need to know who you are, who you're talking to, and what you stand for. From there, everything — the logo, the colors, the typography, the tone of voice — should follow.

The most memorable brands are consistent. They show up the same way whether you're on their website, holding their packaging, or reading their email newsletter. That consistency is what builds trust over time. People don't consciously think "this brand is consistent" — they just feel a sense of familiarity and reliability.

Design is the expression of strategy. Without a solid strategic foundation, even beautiful design falls flat. Start with the strategy, then let the visuals do their job.

## The Five Elements of Brand Identity

**1. Purpose** — Why does your brand exist beyond making money? The strongest brands have a clear reason for being. Apple wants to put powerful creative tools in everyone's hands. Patagonia is on a mission to save the planet. Your purpose doesn't need to be grandiose, but it does need to be genuine.

**2. Positioning** — Where do you sit in the market relative to your competitors? Positioning is about making clear choices. You can't be the cheapest and the most premium. You can't be for everyone. The more specific your positioning, the more powerfully you connect with the right people.

**3. Personality** — If your brand were a person, how would they speak, dress, and behave? Brand personality translates directly into tone of voice, visual style, and the kind of stories you tell. It's the difference between Nike's bold, athletic energy and Aesop's quiet, intellectual sophistication.

**4. Visual Identity** — Logo, color palette, typography, photography style, illustration system, iconography. These elements should work together as a coherent system, not a collection of separate choices.

**5. Verbal Identity** — Your brand name, tagline, messaging architecture, and tone of voice guidelines. How you write is just as important as how you look.

## The Most Common Branding Mistakes

The biggest mistake is starting with the visual before the strategy. A logo designed before you understand your audience and position will need to be redesigned as soon as you figure those things out.

The second biggest mistake is inconsistency. Every touchpoint is a chance to reinforce or dilute your brand. Even something as small as an out-of-office email should feel on-brand.

Third: designing for yourself instead of your audience. Your personal aesthetic preferences are irrelevant. What matters is what resonates with the people you're trying to reach.

## How to Know If Your Brand Identity Is Working

Ask your customers to describe you without using your company name or product category. What words do they use? Are those the words you'd want them to use? If yes, your brand is working. If not, there's a gap between your intent and your execution — and that's where the work is.

A strong brand identity doesn't happen by accident. It's the result of intentional strategy, disciplined execution, and ongoing attention.`,
    coverUrl: "",
    published: true,
    views: 0,
    likes: 0,
    dislikes: 0,
    readTime: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "color-in-branding",
    title: "The Psychology of Color in Branding",
    slug: "color-in-branding",
    excerpt: "Color is one of the fastest ways to communicate emotion. Understanding how different hues affect perception can make or break a brand.",
    category: "Design",
    tags: ["color theory", "branding", "psychology"],
    body: `Color is often the first thing people notice about a brand, and it communicates before any words are read. Red signals urgency and passion. Blue builds trust and calm. Black conveys luxury and authority. But context matters as much as the color itself.

The key is not to pick colors you personally like — it's to pick colors that resonate with your target audience and align with your brand values. A luxury skincare brand and a children's toy company might both use the same shade of pink, but they'd pair it with completely different typographic and photographic choices.

## Understanding Color Psychology

Colors are cultural — what a color means in one market might mean something completely different in another. White represents purity and cleanliness in Western markets; in parts of Asia, it's associated with mourning. Red is lucky in China but associated with danger in other contexts. If you're building a global brand, research your color choices carefully.

**Warm colors** (red, orange, yellow) — These tend to create energy, warmth, and urgency. Fast food brands love red and yellow because they stimulate appetite and create a sense of speed. Orange is energetic and approachable. Yellow is optimistic but harder to read in small sizes.

**Cool colors** (blue, green, purple) — Blue is the most universally trusted color. It's no coincidence that banks, tech companies, and healthcare brands favor it. Green connects to nature, health, and sustainability. Purple suggests creativity, luxury, or spirituality depending on the shade.

**Neutrals** (black, white, gray) — Black signals sophistication and authority. White feels clean and minimal. Gray can be neutral and professional. These work best as the foundation of a color system, not as the hero.

## Building a Color Palette

A practical brand color palette usually includes:

- One or two primary brand colors — the ones that immediately make people think of you
- Two or three secondary colors — used for variety and flexibility in design
- Functional colors — success (green), warning (yellow), error (red), and neutral grays for UI work

The key is not just picking the colors, but defining how they're used together. A strong palette has clear rules: which colors are primary, which are accents, which never appear together.

## Testing Your Palette

Always test your palette in context. Colors behave differently on screen versus print, in light mode versus dark mode, and when placed next to each other. What looks perfect in a color picker can look completely wrong when applied to an actual layout.

Print a page of your brand in full color and in black and white. Ask people who don't know your brand what they think the brand does based on the color alone. The answers will tell you a lot.`,
    coverUrl: "",
    published: true,
    views: 0,
    likes: 0,
    dislikes: 0,
    readTime: 6,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "typography-fundamentals",
    title: "Typography Fundamentals Every Designer Should Know",
    slug: "typography-fundamentals",
    excerpt: "Type is everywhere, and most people never notice it — until it goes wrong. These are the fundamentals that separate good design from great.",
    category: "Design",
    tags: ["typography", "type design", "layout"],
    body: `Typography is one of the most underappreciated disciplines in design. When it's done well, it's invisible — the reader just absorbs the message. When it's done poorly, everything feels off, even if the reader can't explain why.

The basics: hierarchy, spacing, and contrast. A clear hierarchy tells the eye where to go first. Generous line spacing makes text breathable and readable. Contrast between type sizes helps the reader scan and find what they need.

## Understanding Type Classification

**Serif fonts** feel classic, established, and trustworthy. The small strokes (serifs) at the ends of letterforms create a visual rhythm that many readers find easy to follow for long passages. Think: The New York Times, Vogue, Rolex.

**Sans-serif fonts** feel modern, clean, and approachable. Without the decorative serifs, they tend to look better on screens at small sizes. Think: Google, Spotify, Airbnb.

**Monospace fonts** feel technical, precise, and digital-native. They're typically reserved for code samples, data displays, or brands that want to feel like they're built for developers.

**Display fonts** are made for large sizes only — headlines, posters, packaging. They're full of personality but almost always illegible at body size.

## The Rules of Typographic Hierarchy

Hierarchy is about creating a clear reading path. The eye needs to know where to start and where to go next. A page with everything the same size and weight has no hierarchy — it's just noise.

A simple hierarchy: a large, bold headline grabs attention. A medium-weight subheading provides context. Regular-weight body text delivers the content. Small captions and labels provide supporting information.

Rule of thumb: don't use more than three or four different type sizes on a single page. If you need a fifth, that's a sign the hierarchy has broken down.

## Spacing: The Most Underrated Tool

Line height (the vertical space between lines) dramatically affects readability. Too tight and the text feels suffocating. Too loose and the eye loses its place. For body text, 1.5× the font size is a good starting point.

Letter spacing (tracking) should almost never be adjusted on body text — it's set by the type designer for a reason. But for uppercase headlines and labels, adding a small amount of letter spacing (+5 to +15%) often makes them feel more polished.

Word spacing is handled automatically by the type system, but be aware that justified text (aligned to both left and right margins) can create awkward rivers of white space. Left-aligned text is almost always safer.

## How to Mix Typefaces

The safest approach: use one typeface for everything and create hierarchy through weight and size alone. This almost always works.

If you want to mix typefaces, pair a serif with a sans-serif. Use the serif for headlines and the sans-serif for body, or vice versa. Make sure the two fonts have a visual relationship — similar proportions, similar mood — but enough contrast to feel intentional rather than accidental.

Never mix two similar typefaces. It just looks like a mistake.`,
    coverUrl: "",
    published: true,
    views: 0,
    likes: 0,
    dislikes: 0,
    readTime: 7,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
  },
  {
    id: "rebrand-checklist",
    title: "The Rebrand Checklist: What to Do Before You Redesign",
    slug: "rebrand-checklist",
    excerpt: "Rebranding is a big decision. Before you throw out everything and start over, make sure you're solving the right problem.",
    category: "Strategy",
    tags: ["rebrand", "strategy", "brand audit"],
    body: `A rebrand can energize a company and attract new audiences — or it can alienate loyal customers and waste significant budget. The difference usually comes down to how well you understand the problem before you start solving it.

Ask yourself: Is the brand actually the problem? Sometimes what looks like a brand issue is actually a product issue, a positioning issue, or a communication issue. Redesigning the logo won't fix those.

## When a Rebrand Is the Right Answer

A rebrand makes sense when:

- Your brand was built for an older audience and you need to attract a new one
- Your positioning has fundamentally shifted and your visual identity no longer reflects it
- You've gone through a merger or acquisition and need to unify multiple brands
- Your brand looks dated compared to competitors and it's actively hurting you in sales conversations
- You're entering new markets where your current brand carries negative associations

A rebrand does not make sense when the real issue is marketing, product quality, pricing, or customer service. Fix the underlying problem first.

## The Discovery Phase

Before you touch a single design tool, spend time understanding the current brand and its context.

**Audit your existing brand** — Document everything. Every touchpoint. Your website, social profiles, email templates, business cards, signage, packaging. What's consistent? What's not? What still works and what feels embarrassing?

**Talk to your customers** — Ask your best customers why they chose you. What words do they use to describe you? What do they love? What do they wish were different? Their perception of your brand is more important than your internal perception.

**Audit your competitors** — Map out the visual and verbal landscape. Where is there visual whitespace? Where is everything starting to look the same? What does your target audience currently associate with your category?

**Define success** — What will be different after the rebrand? How will you measure it? Common metrics: aided brand awareness, brand sentiment scores, website conversion rates, sales cycle length.

## The Rebrand Process

Once you've done the discovery work, the rebrand process typically goes like this:

1. **Positioning and Strategy** — Define your brand platform: purpose, values, positioning, personality. This is the strategic foundation everything else is built on.

2. **Naming** (if applicable) — If you're changing your name, this is the hardest part. Names are hard to change later and have enormous legal implications.

3. **Visual Identity** — Logo design, color palette, typography, imagery style. This is where most of the visible work happens.

4. **Verbal Identity** — Tagline, messaging hierarchy, tone of voice guidelines.

5. **Brand Guidelines** — A comprehensive document (or digital guide) that ensures everyone uses the new brand correctly going forward.

6. **Rollout** — Phased rollout across all touchpoints. Don't try to change everything at once.

## What to Keep, What to Throw Away

The instinct in a rebrand is to throw everything out. Resist it. Brand equity — the recognition and associations you've built over years — has real value. The goal is usually to evolve, not demolish.

Ask what still works and what needs to change. Sometimes a brand just needs a color refresh and a new typeface. Sometimes the logo has to go. Sometimes the name itself is the problem. Every rebrand is different.

The most successful rebrands maintain a thread of continuity that allows existing customers to recognize the brand while feeling excited about the direction.`,
    coverUrl: "",
    published: true,
    views: 0,
    likes: 0,
    dislikes: 0,
    readTime: 8,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
  },
];

export async function POST() {
  try {
    const batch = adminDb.batch();
    let seeded = 0;

    for (const article of PLACEHOLDER_ARTICLES) {
      const ref = adminDb.collection("articles").doc(article.id);
      const snap = await ref.get();
      if (!snap.exists) {
        batch.set(ref, article);
        seeded++;
      }
    }

    await batch.commit();
    return NextResponse.json({ ok: true, seeded, message: `${seeded} article(s) created.` });
  } catch (err) {
    console.error("[POST /api/admin/articles/seed]", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
