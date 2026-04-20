/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { Plus, Eye, EyeOff, Pencil, ExternalLink } from "lucide-react";
import SeedArticlesButton from "./SeedArticlesButton";

export const dynamic = "force-dynamic";

export default async function ArticlesAdmin() {
  const snap = await adminDb
    .collection("articles")
    .orderBy("updatedAt", "desc")
    .limit(50)
    .get()
    .catch(() => adminDb.collection("articles").limit(50).get());

  const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header ──────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {list.length} {list.length === 1 ? "article" : "articles"} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {list.length === 0 && <SeedArticlesButton />}
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            New article
          </Link>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="px-6 py-6 max-w-4xl">
        {/* Empty state */}
        {list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No articles yet</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
              Seed sample articles to get started, or write your first one from scratch.
            </p>
            <div className="flex gap-3">
              <SeedArticlesButton />
              <Link
                href="/admin/articles/new"
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} />
                New article
              </Link>
            </div>
          </div>
        )}

        {/* Article list */}
        {list.length > 0 && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {list.map((article, i) => (
                <div
                  key={article.id}
                  className={[
                    "flex items-center gap-4 px-5 py-4 group hover:bg-gray-50 transition-colors",
                    i < list.length - 1 ? "border-b border-gray-100" : "",
                  ].join(" ")}
                >
                  {/* Cover thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {article.coverUrl ? (
                      <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg font-bold">
                        {(article.title?.[0] ?? "A").toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{article.title}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{article.excerpt}</p>
                    {article.category && (
                      <span className="inline-block mt-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400 shrink-0">
                    {article.views != null && (
                      <span>{article.views} views</span>
                    )}
                    {article.likes != null && (
                      <span>{article.likes} likes</span>
                    )}
                  </div>

                  {/* Status */}
                  <span className={[
                    "flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold shrink-0",
                    article.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500",
                  ].join(" ")}>
                    {article.published ? <Eye size={10} /> : <EyeOff size={10} />}
                    {article.published ? "Live" : "Draft"}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1.5 shrink-0">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Pencil size={12} />
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink size={12} />
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Seed button when few articles */}
            {list.length < 4 && (
              <div className="mt-4">
                <SeedArticlesButton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
