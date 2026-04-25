/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Mail,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  EyeOff,
  Clock,
  Settings,
  ExternalLink,
} from "lucide-react";
import RefreshButton from "./_ui/RefreshButton";
import Greeting from "./_ui/Greeting";

export const dynamic = "force-dynamic";

/** Firestore Timestamp or epoch-ms → epoch-ms */
function toMs(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val?.toMillis === "function") return val.toMillis();
  if (typeof val?.seconds === "number") return val.seconds * 1000;
  return 0;
}

function timeAgo(ms: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminPage() {
  const [
    projectsSnap,
    articlesSnap,
    offersNewSnap,
    offersTotalSnap,
    bookingsNewSnap,
    bookingsTotalSnap,
    wishlistSnap,
    recentOffersSnap,
    recentBookingsSnap,
  ] = await Promise.all([
    adminDb.collection("projects").limit(500).get(),
    adminDb.collection("articles").limit(500).get(),
    adminDb.collection("offers").where("status", "==", "new").count().get(),
    adminDb.collection("offers").count().get(),
    adminDb.collection("bookings").where("status", "==", "new").count().get(),
    adminDb.collection("bookings").count().get(),
    // Wishlist uses its own collection — returns 0 until entries exist
    adminDb.collection("wishlists").count().get().catch(() => ({ data: () => ({ count: 0 }) })),
    adminDb.collection("offers").orderBy("createdAt", "desc").limit(5).get(),
    adminDb.collection("bookings").orderBy("createdAt", "desc").limit(5).get(),
  ]);

  // Projects: filter out orphan/test docs (no general.id or general.title = not real projects)
  const validProjects = projectsSnap.docs
    .map((d) => d.data() as any)
    .filter((data) => !!(data.general?.id ?? data.general?.title));
  const liveProjects  = validProjects.filter((data) => data.general?.published === true).length;
  const totalProjects = validProjects.length;
  const draftProjects = totalProjects - liveProjects;

  // Articles: filter out orphan/test docs (no title = not a real article)
  const validArticles = articlesSnap.docs
    .map((d) => d.data() as any)
    .filter((data) => !!data.title);
  const liveArticles  = validArticles.filter((data) => data.published === true).length;
  const totalArticles = validArticles.length;
  const draftArticles = totalArticles - liveArticles;

  // Messages = offers + bookings combined
  const newMessages   = offersNewSnap.data().count + bookingsNewSnap.data().count;
  const totalMessages = offersTotalSnap.data().count + bookingsTotalSnap.data().count;
  const totalWishlist = wishlistSnap.data().count;

  // Merge recent from both collections, sort by newest, take top 5
  const recentOffers = recentOffersSnap.docs.map((d) => {
    const raw = d.data() as any;
    return {
      id: d.id,
      name:      raw.name     ?? raw.contactName ?? "Unknown",
      email:     raw.email    ?? "",
      message:   raw.brief    ?? raw.message     ?? "",
      status:    raw.status   ?? "new",
      createdAt: toMs(raw.createdAt),
    };
  });
  const recentBookings = recentBookingsSnap.docs.map((d) => {
    const raw = d.data() as any;
    return {
      id: d.id,
      name:      raw.name     ?? raw.contactName ?? "Unknown",
      email:     raw.email    ?? "",
      message:   raw.brief    ?? raw.message     ?? "",
      status:    raw.status   ?? "new",
      createdAt: toMs(raw.createdAt),
    };
  });
  const recentOffersCombined = [...recentOffers, ...recentBookings]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const hasDrafts = draftProjects > 0 || draftArticles > 0;

  const stats = [
    {
      label: "Live Projects",
      value: liveProjects,
      sub: draftProjects > 0
        ? `${draftProjects} draft${draftProjects > 1 ? "s" : ""} unpublished`
        : `${totalProjects} total`,
      subWarn: draftProjects > 0,
      urgent: false,
      icon: FolderKanban,
      href: "/admin/projects",
      iconBg: "bg-violet-50 text-violet-600",
      accent: "bg-violet-600",
      cardClass: "",
    },
    {
      label: "Live Articles",
      value: liveArticles,
      sub: draftArticles > 0
        ? `${draftArticles} draft${draftArticles > 1 ? "s" : ""} unpublished`
        : `${totalArticles} total`,
      subWarn: draftArticles > 0,
      urgent: false,
      icon: FileText,
      href: "/admin/articles",
      iconBg: "bg-blue-50 text-blue-600",
      accent: "bg-blue-600",
      cardClass: "",
    },
    {
      label: "New Messages",
      value: newMessages,
      sub: `${totalMessages} total in inbox`,
      subWarn: false,
      urgent: newMessages > 0,
      icon: Mail,
      href: "/admin/inbox",
      iconBg: newMessages > 0 ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600",
      accent: newMessages > 0 ? "bg-red-500" : "bg-amber-600",
      cardClass: "",
    },
    {
      label: "Wishlist",
      value: totalWishlist,
      sub: totalWishlist === 0 ? "no requests yet" : `${totalWishlist} request${totalWishlist > 1 ? "s" : ""}`,
      subWarn: false,
      urgent: false,
      icon: Star,
      href: "/admin/inbox",
      iconBg: "bg-amber-50 text-amber-500",
      accent: "bg-amber-400",
      cardClass: "border-amber-200 bg-gradient-to-br from-amber-50/60 to-white",
    },
  ];

  const quickActions = [
    { label: "New Project", href: "/admin/projects/new", icon: FolderKanban },
    { label: "New Article", href: "/admin/articles/new", icon: FileText },
    { label: "Calendar",    href: "/admin/studio",       icon: Clock },
    { label: "Settings",    href: "/admin/settings",     icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <Greeting />
            <p className="text-sm text-gray-500 mt-0.5">
              Here&apos;s your portfolio at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshButton />
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-2 border border-gray-200 text-gray-600 px-3.5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <ExternalLink size={14} />
              View site
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              New project
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto grid gap-5">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, subWarn, urgent, icon: Icon, href, iconBg, accent, cardClass }) => (
            <Link
              key={label}
              href={href}
              className={`group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all overflow-hidden ${cardClass}`}
            >
              {urgent && (
                <span className="absolute top-3.5 right-3.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon size={20} />
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums leading-none mb-1">
                {value}
              </div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
              {sub && (
                <div className={`text-xs mt-1 font-medium ${subWarn ? "text-amber-500" : "text-gray-400"}`}>
                  {sub}
                </div>
              )}
              <div className={`mt-4 h-0.5 w-8 ${accent} rounded-full opacity-40 group-hover:opacity-80 group-hover:w-full transition-all duration-500`} />
            </Link>
          ))}
        </div>

        {/* ── Drafts warning ── */}
        {hasDrafts && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <EyeOff size={17} className="text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              You have{" "}
              {[
                draftProjects > 0 && `${draftProjects} unpublished project${draftProjects > 1 ? "s" : ""}`,
                draftArticles > 0 && `${draftArticles} unpublished article${draftArticles > 1 ? "s" : ""}`,
              ].filter(Boolean).join(" and ")}{" "}
              not visible to the public.
            </p>
            <Link href="/admin/projects" className="ml-auto text-xs font-semibold text-amber-700 hover:text-amber-900 shrink-0 transition-colors">
              Review →
            </Link>
          </div>
        )}

        {/* ── Recent messages ── */}
        {recentOffersCombined.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700">Recent Messages</h2>
                {newMessages > 0 && (
                  <span className="text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {newMessages} new
                  </span>
                )}
              </div>
              <Link href="/admin/inbox" className="text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentOffersCombined.map((o: any) => (
                <Link key={o.id} href="/admin/inbox" className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0 mt-0.5">
                    {(o.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-900 truncate">{o.name ?? "Anonymous"}</span>
                      <span className="text-xs text-gray-400 shrink-0">{o.createdAt ? timeAgo(o.createdAt) : ""}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{o.message ?? ""}</p>
                  </div>
                  {o.status === "new" && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2.5" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick actions ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="group flex flex-col items-center gap-2.5 p-6 hover:bg-gray-50 transition-colors text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-all">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Pro tip ── */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-base">💡</div>
          <div>
            <p className="text-sm font-semibold mb-0.5">Pro tip</p>
            <p className="text-sm text-gray-400">
              Open any public page with{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">?edit=1</code>{" "}
              to edit it inline without leaving the page.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
