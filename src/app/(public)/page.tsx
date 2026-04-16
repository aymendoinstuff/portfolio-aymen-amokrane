import SectionTitle from "@/components/SectionTitle";
import Placeholder from "@/components/public/common/Placeholder";
import MarqueeClients from "@/components/public/home/MarqueeClients";
import BigWordRotator from "@/components/public/home/BigWordRotator";
import { Btn } from "@/components/public/common/ui";
import EdgeLabel from "@/components/EdgeLabel";
import { ROTATE_WORDS } from "@/lib/data/general";
import Link from "next/link";
import PageIntroTransition from "@/components/public/home/PageIntroTransition"; // import it

export default function HomePage() {
  return (
    <PageIntroTransition
      config={{
        bgColor: "#000",
        rectColor: "#fff",
        rectSize: { w: 300, h: 100 },
        borderRadius: 0,
        imageUrl: "/images/common/logo.jpg",
        imageFit: "cover",
        imagePosition: "50% 45%",

        durationMs: 2100, // legacy baseline (still used for expand timing heuristic)

        // NEW: background visibility timing
        bgFadeStartAtMs: 1800, // start fading the black background at 600ms
        bgFadeDurationMs: 500, // fade the background over 300ms

        // NEW: when to remove overlay entirely (independent)
        overlayHideAtMs: 1200, // hide overlay shortly after the pop/expand

        // motion
        shakeIntensity: 4,
        sweep: {
          enabled: true,
          color: "rgba(0,0,0,0.5)",
          angleDeg: 135,
          widthPct: 18,
        },

        // NEW: glow border
        glow: {
          enabled: true,
          color: "#ffffff", // can be any CSS color (#hex, rgb, rgba, named)
          blurPx: 5,
          spreadPx: 2,
          opacity: 0.3,
        },

        // optional image tint
        disableTint: true,
        tintOpacity: 0.35,
      }}
    >
      <main className="relative">
        <EdgeLabel>Scroll v</EdgeLabel>

        {/* HERO */}
        <section className="relative h-[88vh] min-h-[620px] flex items-center justify-center">
          <div className="absolute inset-0 -z-10">
            <Placeholder className="w-full h-full" />
          </div>
          <div className="text-center px-4 max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-semibold leading-[0.9] tracking-tight">
              WE DOING
            </h1>
            <div className="mt-1 text-6xl md:text-8xl font-semibold tracking-tight">
              <BigWordRotator words={ROTATE_WORDS as unknown as string[]} />
            </div>
            <div className="mt-8">
              <Link href="/contact" className="inline-block">
                <Btn className="px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base uppercase tracking-[0.2em]">
                  AVAILABLE FOR WORK
                </Btn>
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[linear-gradient(#000_1px,transparent_1px)] bg-[length:100%_6px]" />
        </section>

        {/* FEATURED PROJECTS */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <SectionTitle>Featured projects</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="relative rounded-[2px] overflow-hidden group"
              >
                <Placeholder className="w-full aspect-[2/1]" />
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition text-black">
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      Project Title {i + 1}
                    </div>
                    <div className="text-sm opacity-80 mt-1">
                      Short tagline about the project
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition text-[10px] tracking-[0.2em] uppercase bg-white/90 px-2 py-1 rounded-full">
                  Branding
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CLIENTS */}
        <MarqueeClients />

        {/* ARTICLES */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <SectionTitle>Articles</SectionTitle>
          <div className="grid gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid md:grid-cols-[220px_1fr] gap-4 items-start"
              >
                <Placeholder className="h-28 w-full rounded-xl" />
                <div>
                  <div className="font-medium text-lg">
                    Article Title {i + 1}
                  </div>
                  <p className="text-sm opacity-80 mt-1">
                    Short description of the article as a two-line teaser to
                    invite reading.
                  </p>
                  <div className="mt-3">
                    <Link href="/blog">
                      <Btn className="px-3 py-1 text-sm">Read more</Btn>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/blog">
              <Btn className="px-4 py-2 text-sm">Check more</Btn>
            </Link>
          </div>
        </section>
      </main>
    </PageIntroTransition>
  );
}
