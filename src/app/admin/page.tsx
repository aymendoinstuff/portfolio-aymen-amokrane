import React from "react";
import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Briefcase,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    projectsCountSnap,
    articlesCountSnap,
    offersCountSnap,
    collabsCountSnap,
  ] = await Promise.all([
    adminDb.collection("projects").count().get(),
    adminDb.collection("articles").count().get(),
    adminDb.collection("offers").count().get(),
    adminDb.collection("collaborations").count().get(),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projectsCountSnap.data().count,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "bg-violet-50 text-violet-600",
      accent: "bg-violet-600",
    },
    {
      label: "Articles",
      value: articlesCountSnap.data().count,
      icon: FileText,
      href: "/admin/articles",
      color: "bg-blue-50 text-blue-600",
      accent: "bg-blue-600",
    },
    {
      label: "Offers",
      value: offersCountSnap.data().count,
      icon: Briefcase,
      href: "/admin/inbox",
      color: "bg-amber-50 text-amber-600",
      accent: "bg-amber-600",
    },
    {
      label: "Collaborations",
      value: collabsCountSnap.data().count,
      icon: Users,
      href: "/admin/collaborations",
      color: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-600",
    },
  ];

  const quickActions = [
    { label: "New Project", href: "/admin/projects/new", icon: FolderKanban },
    { label: "New Article", href: "/admin/articles/new", icon: FileText },
    { label: "View Inbox", href: "/admin/inbox", icon: Briefcase },
    { label: "Settings", href: "/admin/settings", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back — here&apos;s your portfolio at a glance.
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            New project
          </Link>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto grid gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, href, color, accent }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                >
                  <Icon size={20} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums leading-none mb-1">
                {value}
              </div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
              <div
                className={`mt-4 h-0.5 w-8 ${accent} rounded-full opacity-40 group-hover:opacity-80 group-hover:w-full transition-all duration-500`}
              />
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-2.5 p-6 hover:bg-gray-50 transition-colors text-center"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-all">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Pro tip */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-base">
            💡
          </div>
          <div>
            <p className="text-sm font-semibold mb-0.5">Pro tip</p>
            <p className="text-sm text-gray-400">
              Open any public page with{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">
                ?edit=1
              </code>{" "}
              to edit it inline without leaving the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
