"use client";
import * as React from "react";
import Link from "next/link";
import { useSettingsForm } from "./useSettingsForm";
import { HomeTab } from "./tabs/HomeTab";
import { AboutTab } from "./tabs/AboutTab";
import { BlogTab } from "./tabs/BlogTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { ContactTab } from "./tabs/ContactTab";
import {
  ArrowLeft,
  Globe,
  Home,
  User,
  BookOpen,
  Settings2,
  Mail,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

const TABS = [
  { id: "home",    label: "Home",    icon: Home },
  { id: "about",   label: "About",   icon: User },
  { id: "blog",    label: "Blog",    icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "general", label: "General", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SiteEditorPage() {
  const {
    form,
    loadError,
    saveError,
    saveSuccess,
    initializing,
    isPending,
    onSubmit,
  } = useSettingsForm();

  const [activeTab, setActiveTab] = React.useState<TabId>("home");
  const isBusy = initializing || isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header ─────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-6 h-14">
          {/* Back + title */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-gray-400 hover:text-black transition mr-1"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <Globe size={16} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">Site Editor</span>

          <div className="flex-1" />

          {/* Status */}
          {isPending && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Loader2 size={13} className="animate-spin" />
              Saving…
            </span>
          )}
          {saveSuccess && !isPending && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <Check size={13} />
              Saved
            </span>
          )}
          {saveError && !isPending && (
            <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle size={13} />
              Save failed
            </span>
          )}

          {/* Save button */}
          <button
            form="site-editor-form"
            type="submit"
            disabled={isBusy}
            className="h-9 px-5 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            Save
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 px-4 border-t border-gray-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={[
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === id
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Loading state */}
        {initializing && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300 gap-3">
            <Loader2 className="animate-spin" size={28} />
            <span className="text-sm">Loading settings…</span>
          </div>
        )}

        {/* Load error */}
        {loadError && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {/* Form — ALL tabs stay mounted so useFieldArray hooks never unregister.
              CSS hides inactive tabs instead of unmounting them. */}
        {!initializing && (
          <form id="site-editor-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isBusy} className="contents">
              <div className={activeTab === "home"    ? "" : "hidden"}><HomeTab    form={form} /></div>
              <div className={activeTab === "about"   ? "" : "hidden"}><AboutTab   form={form} /></div>
              <div className={activeTab === "blog"    ? "" : "hidden"}><BlogTab    form={form} /></div>
              <div className={activeTab === "contact" ? "" : "hidden"}><ContactTab form={form} /></div>
              <div className={activeTab === "general" ? "" : "hidden"}><GeneralTab form={form} /></div>
            </fieldset>
          </form>
        )}

        {/* Bottom padding */}
        <div className="h-16" />
      </div>
    </div>
  );
}
