export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { repoGetArticleBySlug, repoGetPublishedArticles } from "@/lib/repositories/articles";
import { getServerSiteSettings } from "@/lib/settings/server";
import ArticleInteractions from "@/components/public/blog/ArticleInteractions";
import type { ArticleBlock } from "@/lib/types/article";
import { ArrowLeft, Eye, Clock } from "lucide-react";

function formatDate(ts?: number) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function readingTime(body?: string, readTime?: number) {
  if (readTime) return `${readTime} min read`;
  if (!body) return "";
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** Renders block-based content (new editor format) */
function BlocksRenderer({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          // Handle **bold** inline
          const parts = b.text.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="text-base text-gray-700 leading-[1.8]">
              {parts.map((part, j) =>
                part.startsWith("**") && part.endsWith("**")
                  ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                  : part
              )}
            </p>
          );
        }
        if (b.type === "h2") return <h2 key={i} className="text-2xl font-bold text-gray-900 tracking-tight mt-10 mb-3">{b.text}</h2>;
        if (b.type === "h3") return <h3 key={i} className="text-lg font-bold text-gray-900 tracking-tight mt-8 mb-2">{b.text}</h3>;
        if (b.type === "quote") return (
          <blockquote key={i} className="border-l-4 border-black pl-5 py-1 my-6">
            <p className="text-lg text-gray-700 italic leading-relaxed">{b.text}</p>
            {b.author && <cite className="text-sm text-gray-400 mt-2 block not-italic">— {b.author}</cite>}
          </blockquote>
        );
        if (b.type === "image") return b.url ? (
          <figure key={i} className="my-8">
            <img src={b.url} alt={b.caption ?? ""} className="w-full rounded-2xl" />
            {b.caption && <figcaption className="text-xs text-gray-400 text-center mt-3">{b.caption}</figcaption>}
          </figure>
        ) : null;
        if (b.type === "divider") return <hr key={i} className="border-gray-100 my-10" />;
        return null;
      })}
    </div>
  );
}

/** Fallback renderer for legacy plain-text body */
function BodyRenderer({ body }: { body: string }) {
  return (
    <div className="space-y-5">
      {body.split(/\n\n+/).map((block, i) => {
        const t = block.trim();
        if (!t) return null;
        if (t.startsWith("### ")) return <h3 key={i} className="text-lg font-bold text-gray-900 tracking-tight mt-8 mb-2">{t.slice(4)}</h3>;
        if (t.startsWith("## "))  return <h2 key={i} className="text-2xl font-bold text-gray-900 tracking-tight mt-10 mb-3">{t.slice(3)}</h2>;
        const parts = t.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-base text-gray-700 leading-[1.8]">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

interface Props { params: Promise<{ slug: string }> }

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, settings, allArticles] = await Promise.all([
    repoGetArticleBySlug(slug),
    getServerSiteSettings(),
    repoGetPublishedArticles(20),
  ]);

  if (!article) notFound();

  // Pick 2 related articles: same category first, then any other published articles
  const related = allArticles
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      // Prefer same category
      const aMatch = article.category && a.category === article.category ? 1 : 0;
      const bMatch = article.category && b.category === article.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 2);

  const authorName   = settings.about?.personal?.name  || "Aymen Doin Stuff";
  const authorRole   = settings.about?.personal?.role   || "Brand Designer";
  const authorAvatar = settings.about?.heroAvatarUrl    || "";

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors mb-10">
        <ArrowLeft size={15} /> Back to Articles
      </Link>

      {/* Category */}
      {article.category && (
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{article.category}</div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-gray-900">{article.title}</h1>

      {/* Meta */}
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
            {authorAvatar
              ? <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">{authorName[0]?.toUpperCase() ?? "A"}</div>
            }
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800 leading-tight">{authorName}</div>
            <div className="text-xs text-gray-400">{authorRole}</div>
          </div>
        </div>
        <span className="text-gray-200">|</span>
        {article.createdAt && <span className="text-sm text-gray-400">{formatDate(article.createdAt)}</span>}
        <span className="flex items-center gap-1 text-sm text-gray-400">
          <Clock size={13} />{readingTime(article.body, article.readTime)}
        </span>
        {(article.views ?? 0) > 0 && (
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Eye size={13} />{article.views?.toLocaleString()} views
          </span>
        )}
      </div>

      {/* Cover */}
      {article.coverUrl && (
        <div className="mt-8 overflow-hidden rounded-2xl">
          <img src={article.coverUrl} alt={article.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      {/* Excerpt callout */}
      {article.excerpt && (
        <p className="mt-8 text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-black pl-5">
          {article.excerpt}
        </p>
      )}

      {/* Content — blocks first, fallback to body string */}
      <div className="mt-8">
        {article.blocks && article.blocks.length > 0
          ? <BlocksRenderer blocks={article.blocks} />
          : <BodyRenderer body={article.body ?? ""} />
        }
      </div>

      <hr className="my-12 border-gray-100" />

      {/* Reactions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Was this helpful?</p>
          <p className="text-xs text-gray-400 mt-0.5">Your reaction is anonymous</p>
        </div>
        <ArticleInteractions
          articleId={article.id!}
          initialLikes={article.likes ?? 0}
          initialDislikes={article.dislikes ?? 0}
        />
      </div>

      <div className="mt-12">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={15} /> All Articles
        </Link>
      </div>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-4xl md:text-6xl tracking-tight leading-[0.95] mb-8">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="group flex gap-4 items-start">
                {r.coverUrl && (
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={r.coverUrl}
                      alt={r.title}
                      style={{ objectPosition: r.coverPosition ?? "center" }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {r.category && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{r.category}</p>
                  )}
                  <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:underline underline-offset-4 line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.readTime ? `${r.readTime} min read` : ""}
                    {r.readTime && r.createdAt ? " · " : ""}
                    {r.createdAt ? formatDate(r.createdAt) : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
