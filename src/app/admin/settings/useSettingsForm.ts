"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema, type SiteSettings } from "./schema";
import { getSiteSettings } from "@/app/admin/settings/lib/site-client";

export function useSettingsForm() {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const initialRef = useRef<SiteSettings | null>(null);

  const form = useForm<SiteSettings, unknown, SiteSettings>({
    resolver: zodResolver(SettingsSchema) as Resolver<SiteSettings>,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: SettingsSchema.parse({}),
  });

  async function reload() {
    const data = await getSiteSettings();
    initialRef.current = data;
    form.reset(data, { keepDirty: false });
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadError(null);
      try {
        await reload();
      } catch {
        if (alive) setLoadError("Failed to load site settings.");
      } finally {
        if (alive) setInitializing(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (saveSuccess || saveError) {
      const t = setTimeout(() => {
        setSaveSuccess(null);
        setSaveError(null);
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [saveSuccess, saveError]);

  const onSubmit: SubmitHandler<SiteSettings> = (values) => {
    setSaveError(null);
    setSaveSuccess(null);
    startTransition(async () => {
      try {
        const validated = SettingsSchema.parse(values);
        const payload = JSON.parse(JSON.stringify(validated));
        const res = await fetch("/api/admin/settings/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Save failed");
        // Reset the form with the exact validated data that was just saved.
        // Do NOT re-fetch from Firestore — the client-side getDoc can return
        // stale / unauthenticated data and silently fall back to DEFAULT_SETTINGS,
        // which wipes all arrays (testimonials, clients, etc.).
        initialRef.current = validated;
        form.reset(validated, { keepDirty: false });
        setSaveSuccess("Saved");
      } catch {
        setSaveError("Could not save settings. Please try again.");
      }
    });
  };

  return {
    form,
    loadError,
    saveError,
    saveSuccess,
    initializing,
    isPending,
    onSubmit,
    initialSnapshot: initialRef,
  };
}
