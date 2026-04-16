"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema, type SiteSettings } from "./schema";
import {
  getSiteSettings,
  saveSiteSettings,
  getAvailableCollaborationIds,
  resetSiteSettingsFromJson,
} from "@/app/admin/settings/lib/site-client";

export function useSettingsForm() {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [collabIds, setCollabIds] = useState<string[]>([]);
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
        const ids = await getAvailableCollaborationIds();
        if (alive) setCollabIds(ids);
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
        await saveSiteSettings(validated);
        initialRef.current = validated;
        setSaveSuccess("Settings saved successfully.");
      } catch {
        setSaveError("Could not save settings. Please review inputs.");
      }
    });
  };

  const resetAllToJson = async () => {
    setSaveError(null);
    setSaveSuccess(null);
    startTransition(async () => {
      try {
        await resetSiteSettingsFromJson();
        await reload();
        setSaveSuccess("Settings reset from JSON defaults.");
      } catch {
        setSaveError("Failed to reset from JSON defaults.");
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
    resetAllToJson,
    initialSnapshot: initialRef,
    collabIds,
  };
}
