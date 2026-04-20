export const dynamic = "force-dynamic";

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

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl tracking-tight leading-[0.95]">Articles</h1>
        <p className="mt-3 text-gray-500 text-base">
          Thoughts on branding, design systems, and building things that last.
        </p>
      </div>

      <ArticleList articles={articles} categories={categories} />
    </main>
  );
}
