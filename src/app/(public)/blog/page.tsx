export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on brand strategy, visual identity, and design systems by Aymen Amokrane.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog — Aymen Amokrane", url: "/blog", type: "website" },
};

import { repoGetPublishedArticles } from "@/lib/repositories/articles";
import { getServerSiteSettings } from "@/lib/settings/server";
import ArticleList from "@/components/public/blog/ArticleList";

export default async function BlogPage() {
  const [articles, settings] = await Promise.all([
    repoGetPublishedArticles(50),
    getServerSiteSettings(),
  ]);

  // Collect unique categories from actual articles + any defined in blog settings
  const articleCategories = [...new Set(articles.map((a) => a.category).filter(Boolean))] as string[];
  const settingCategories = settings.blog?.categories ?? [];
  const categories = [...new Set([...settingCategories, ...articleCategories])];

  const pageTitle    = settings.blog?.pageTitle    || "Articles";
  const pageSubtitle = settings.blog?.pageSubtitle || "Thoughts on branding, design systems, and building things that last.";

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl tracking-tight leading-[0.95]">{pageTitle}</h1>
        {pageSubtitle && (
          <p className="mt-3 text-gray-500 text-base">{pageSubtitle}</p>
        )}
      </div>

      <ArticleList articles={articles} categories={categories} />
    </main>
  );
}
