"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ArticleDoc } from "@/lib/types/article";
import { BookOpen, Clock, Eye, ThumbsUp } from "lucide-react";

function formatDate(ts?: number) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function readingTime(body?: string, readTime?: number) {
  if (readTime) return `${readTime} min read`;
  if (!body) return "";
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

interface ArticleListProps {
  articles: ArticleDoc[];
  categories: string[];
}

type SortKey = "recent" | "views" | "likes";

export default function ArticleList({ articles, categories }: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    let list = activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

    if (sort === "recent") {
      list = [...list].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } else if (sort === "views") {
      list = [...list].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else if (sort === "likes") {
      list = [...list].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }

    return list;
  }, [articles, activeCategory, sort]);

  const allCats = ["All", ...categories];

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                activeCategory === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="recent">Most Recent</option>
          <option value="views">Most Viewed</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      {/* Article cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No articles found.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((article) => (
            <ArticleCard key={article.id ?? article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleDoc }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex gap-6 py-8 items-start hover:no-underline"
    >
      {/* Cover thumbnail */}
      <div className="hidden sm:block shrink-0 w-48 md:w-56 aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
        {article.coverUrl ? (
          <img
            src={article.coverUrl}
            alt={article.title}
            style={{ objectPosition: article.coverPosition ?? "center" }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <BookOpen size={28} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category + date */}
        <div className="flex items-center gap-3 mb-2">
          {article.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {article.category}
            </span>
          )}
          {article.createdAt && (
            <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:underline underline-offset-4 decoration-2 transition-all">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>

        {/* Meta row */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {readingTime(article.body, article.readTime)}
          </span>
          {(article.views ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {article.views?.toLocaleString()} views
            </span>
          )}
          {(article.likes ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <ThumbsUp size={12} />
              {article.likes?.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Mobile thumbnail */}
      {article.coverUrl && (
        <div className="sm:hidden shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-100">
          <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </Link>
  );
}
