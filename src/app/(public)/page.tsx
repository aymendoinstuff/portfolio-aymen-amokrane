import { repoGetPublishedProjects } from "@/lib/repositories/projects";
import { repoGetPublishedArticles } from "@/lib/repositories/articles";
import { getServerSiteSettings } from "@/lib/settings/server";
import EdgeLabel from "@/components/EdgeLabel";
import ScrollReveal from "@/components/ScrollReveal";
import PageIntroTransition from "@/components/public/home/PageIntroTransition";
import HeroSection from "@/components/public/home/HeroSection";
import FeaturedProjectsSection from "@/components/public/home/FeaturedProjectsSection";
import ClientsSection from "@/components/public/home/ClientsSection";
import ArticlesSection from "@/components/public/home/ArticlesSection";
import TestimonialsSection from "@/components/public/home/TestimonialsSection";
import NumbersSection from "@/components/public/home/NumbersSection";
import HeavyScroller from "@/components/public/home/HeavyScroller";

export default async function HomePage() {
  // Fetch data
  const [projects, articles, settings] = await Promise.all([
    repoGetPublishedProjects(10),
    repoGetPublishedArticles(3),
    getServerSiteSettings(),
  ]);

  // Organize sections by order and visibility
  const sections = (settings.home?.sections ?? []).sort(
    (a, b) => a.order - b.order
  );

  const sectionMap = new Map(sections.map((s) => [s.id, s]));

  const renderSection = (
    sectionId: "hero" | "featured_projects" | "clients" | "articles" | "testimonials" | "numbers"
  ) => {
    const section = sectionMap.get(sectionId);
    if (!section || !section.visible) return null;

    switch (sectionId) {
      case "hero":
        return (
          <HeroSection
            key="hero"
            projects={projects}
            heroCta={settings.home?.heroCta}
            heroMainText={settings.home?.heroMainText}
            heroFontWeight={settings.home?.heroFontWeight}
            heroRotateWords={settings.home?.heroRotateWords}
          />
        );
      case "featured_projects":
        return (
          <ScrollReveal key="featured_projects" delay={0.05}>
            <FeaturedProjectsSection
              projects={projects}
              featuredProjectIds={settings.home?.featuredProjectIds ?? []}
            />
          </ScrollReveal>
        );
      case "clients":
        return (
          <ScrollReveal key="clients" delay={0.05}>
            <ClientsSection clients={settings.home?.clients ?? []} />
          </ScrollReveal>
        );
      case "articles":
        return (
          <ScrollReveal key="articles" delay={0.05}>
            <ArticlesSection articles={articles} />
          </ScrollReveal>
        );
      case "testimonials":
        return (
          <ScrollReveal key="testimonials" delay={0.05}>
            <TestimonialsSection testimonials={settings.home?.testimonials ?? []} />
          </ScrollReveal>
        );
      case "numbers":
        return (
          <ScrollReveal key="numbers" delay={0.05}>
            <NumbersSection statIndices={settings.home?.numberStatIndices ?? [0, 1, 2, 3]} />
          </ScrollReveal>
        );
      default:
        return null;
    }
  };

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

        durationMs: 2100,

        bgFadeStartAtMs: 1800,
        bgFadeDurationMs: 500,

        overlayHideAtMs: 1200,

        shakeIntensity: 4,
        sweep: {
          enabled: true,
          color: "rgba(0,0,0,0.5)",
          angleDeg: 135,
          widthPct: 18,
        },

        glow: {
          enabled: true,
          color: "#ffffff",
          blurPx: 5,
          spreadPx: 2,
          opacity: 0.3,
        },

        disableTint: true,
        tintOpacity: 0.35,
      }}
    >
      <HeavyScroller>
        <main className="relative">
          <EdgeLabel>Scroll v</EdgeLabel>

          {/* Render sections in the order defined by admin (sorted by `order`) */}
          {sections.map((s) =>
            renderSection(
              s.id as
                | "hero"
                | "featured_projects"
                | "clients"
                | "articles"
                | "testimonials"
                | "numbers"
            )
          )}
        </main>
      </HeavyScroller>
    </PageIntroTransition>
  );
}
