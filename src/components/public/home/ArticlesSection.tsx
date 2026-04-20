import Link from "next/link";
import type { ArticleDoc } from "@/lib/types/article";

interface ArticlesSectionProps {
  articles: ArticleDoc[];
}

function formatDate(ts?: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  const displayArticles = articles.slice(0, 3);
  const showPlaceholder = displayArticles.length === 0;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* Header row: title + view all on the right */}
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-4xl md:text-6xl tracking-tight leading-[0.95]">Articles</h2>
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors shrink-0"
        >
          View all →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {showPlaceholder
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="bg-gray-200 rounded-xl aspect-[3/4] w-full animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-2/5 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              </div>
            ))
          : displayArticles.map((article) => (
              <article key={article.id} className="group flex flex-col gap-2.5">
                {/* Cover — always 3:4, full image shown (no crop) */}
                <Link href={`/blog/${article.slug}`} className="block overflow-hidden rounded-xl bg-gray-100">
                  {article.coverUrl ? (
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={article.coverUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                      No cover
                    </div>
                  )}
                </Link>

                {/* Title */}
                <Link href={`/blog/${article.slug}`}>
                  <h3 className="font-bold text-sm leading-snug hover:underline line-clamp-2 mt-1">
                    {article.title}
                  </h3>
                </Link>

                {/* Date + read time — only meta, no excerpt */}
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                  {article.createdAt && <span>{formatDate(article.createdAt)}</span>}
                  {article.createdAt && article.readTime && <span>·</span>}
                  {article.readTime && <span>{article.readTime} min read</span>}
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
