"use client";
import * as React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { LinkButton } from "@/components/admin/LinkButton";
import { Banner } from "./ui/Banner";
import { Tabs, SECTIONS, type SectionKey } from "./Tabs";
import { useSettingsForm } from "./useSettingsForm";
import { GeneralSection } from "./sections/GeneralSection";
import { HomeSection } from "./sections/HomeSection";
import { AboutSection } from "./sections/AboutSection";
import { WorkSection } from "./sections/WorkSection";
import { BlogSection } from "./sections/BlogSection";
import type { SiteSettings } from "./schema";

export default function Page() {
  const {
    form,
    loadError,
    saveError,
    saveSuccess,
    initializing,
    isPending,
    onSubmit,
    resetAllToJson,
    initialSnapshot,
    collabIds,
  } = useSettingsForm();
  const [active, setActive] = React.useState<SectionKey>("GENERAL");
  const isBusy = initializing || isPending;

  const resetSection = () => {
    if (!initialSnapshot.current) return;
    const data = initialSnapshot.current;
    const vals: Record<SectionKey, Partial<SiteSettings>> = {
      GENERAL: { nav: data.nav, footer: data.footer },
      HOME: { home: data.home },
      ABOUT: { about: data.about },
      WORK: { work: data.work },
      BLOG: { blog: data.blog },
    };
    form.reset({ ...form.getValues(), ...vals[active] }, { keepDirty: true });
  };

  return (
    <main className="p-4 md:p-6">
      <PageHeader
        title="Site Settings"
        subtitle="Configure navigation, homepage content, about page, work & blog."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
        actions={
          <>
            <button
              onClick={resetAllToJson}
              className="inline-flex items-center gap-2 rounded-xl border border-black px-3 py-2 text-sm"
            >
              Reset from JSON
            </button>
            <LinkButton href="/?edit=1" variant="outline">
              Open preview
            </LinkButton>
            <button
              form="settings-form"
              type="submit"
              disabled={isBusy}
              aria-busy={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
          </>
        }
      />
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <Tabs active={active} onChange={setActive} items={SECTIONS} />
        </div>
        <div className="px-6 py-3 flex justify-end border-b border-gray-200">
          <button
            onClick={resetSection}
            className="text-sm underline underline-offset-4"
          >
            Reset this section
          </button>
        </div>
        <div className="max-h-[72svh] overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="grid gap-6">
            {initializing && <Banner tone="info">Loading…</Banner>}
            {loadError && <Banner tone="error">{loadError}</Banner>}
            {saveError && <Banner tone="error">{saveError}</Banner>}
            {saveSuccess && <Banner tone="success">{saveSuccess}</Banner>}
          </div>
          <form
            id="settings-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-8"
          >
            <fieldset disabled={isBusy} className="contents">
              {active === "GENERAL" && (
                <GeneralSection form={form} onReset={resetSection} />
              )}
              {active === "HOME" && (
                <HomeSection form={form} onReset={resetSection} />
              )}
              {active === "ABOUT" && (
                <AboutSection form={form} onReset={resetSection} />
              )}
              {active === "WORK" && (
                <WorkSection
                  form={form}
                  onReset={resetSection}
                  collabIds={collabIds}
                />
              )}
              {active === "BLOG" && (
                <BlogSection form={form} onReset={resetSection} />
              )}
            </fieldset>
          </form>
        </div>
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 md:px-8">
          <div className="flex items-center justify-end">
            <button
              form="settings-form"
              type="submit"
              disabled={isBusy}
              aria-busy={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
