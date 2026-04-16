"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { Field } from "../ui/Field";
import { TextInput, Textarea, Button } from "../ui/Inputs";
import { ImageUploader } from "../ui/ImageUploader";

type PrimitiveArrayPath = "about.education" | "about.skills" | "about.tools";

export function AboutSection({
  form,
  onReset,
}: {
  form: UseFormReturn<SiteSettings>;
  onReset?: () => void;
}) {
  const expArray = useFieldArray({
    control: form.control,
    name: "about.experiences",
  });
  const statsArray = useFieldArray({
    control: form.control,
    name: "about.stats",
  });

  // primitive arrays managed manually
  const education = form.watch("about.education") ?? [];
  const skills = form.watch("about.skills") ?? [];
  const tools = form.watch("about.tools") ?? [];

  const push = (path: PrimitiveArrayPath, value: string) => {
    const current = form.getValues(path); // string[] | undefined
    if (current) {
      form.setValue(path, [...current, value], { shouldDirty: true });
    } else {
      form.setValue(path, [value], { shouldDirty: true });
    }
  };

  const removeAt = (path: PrimitiveArrayPath, idx: number) => {
    const current = form.getValues(path); // string[] | undefined
    if (!current) return;
    form.setValue(
      path,
      current.filter((_, i) => i !== idx),
      { shouldDirty: true }
    );
  };

  return (
    <section role="tabpanel" aria-labelledby="tab-ABOUT" className="grid gap-8">
      <header className="flex items-center gap-6">
        <h2 className="text-lg font-semibold">About</h2>
        <div className="h-px flex-1 bg-gray-200" />
        {onReset && (
          <Button type="button" onClick={onReset}>
            Reset section
          </Button>
        )}
      </header>

      <div className="grid gap-6">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Personal</h3>
          <div className="h-px flex-1 bg-gray-200" />
        </header>
        <Field id="personal-name" label="Name">
          <TextInput {...form.register("about.personal.name")} />
        </Field>
        <Field id="personal-role" label="Role">
          <TextInput {...form.register("about.personal.role")} />
        </Field>
        <Field id="personal-location" label="Location">
          <TextInput {...form.register("about.personal.location")} />
        </Field>
      </div>

      <div className="grid gap-6">
        <Field id="about-heroAvatarUrl" label="Hero — Avatar">
          <div className="grid md:grid-cols-[1fr_auto] gap-3 items-center">
            <TextInput
              placeholder="https://..."
              {...form.register("about.heroAvatarUrl")}
            />
            <ImageUploader
              value={form.watch("about.heroAvatarUrl")}
              onChange={(url) =>
                form.setValue("about.heroAvatarUrl", url, { shouldDirty: true })
              }
              folder="avatars"
            />
          </div>
        </Field>
        <Field id="about-intro" label="Intro paragraph">
          <Textarea rows={5} {...form.register("about.intro")} />
        </Field>
        <Field id="about-bio" label="Bio">
          <Textarea rows={5} {...form.register("about.bio")} />
        </Field>
      </div>

      <div className="grid gap-3">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Experience</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() =>
              expArray.append({ role: "", company: "", period: "", desc: "" })
            }
          >
            Add experience
          </Button>
        </header>
        <div className="grid gap-4">
          {expArray.fields.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
              No experience yet — click “Add experience”.
            </div>
          )}
          {expArray.fields.map((f, i) => (
            <div key={f.id} className="rounded-xl border p-4 grid gap-3">
              <div className="grid md:grid-cols-3 gap-3">
                <Field id={`exp-role-${i}`} label="Role">
                  <TextInput
                    {...form.register(`about.experiences.${i}.role` as const)}
                  />
                </Field>
                <Field id={`exp-company-${i}`} label="Company">
                  <TextInput
                    {...form.register(
                      `about.experiences.${i}.company` as const
                    )}
                  />
                </Field>
                <Field id={`exp-period-${i}`} label="Period">
                  <TextInput
                    {...form.register(`about.experiences.${i}.period` as const)}
                  />
                </Field>
              </div>
              <Field id={`exp-desc-${i}`} label="Description">
                <Textarea
                  rows={3}
                  {...form.register(`about.experiences.${i}.desc` as const)}
                />
              </Field>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => expArray.remove(i)}
                  className="rounded-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="grid gap-3">
          <header className="flex items-center gap-3">
            <h3 className="text-base font-semibold">Education</h3>
            <div className="h-px flex-1 bg-gray-200" />
            <Button type="button" onClick={() => push("about.education", "")}>
              Add
            </Button>
          </header>
          <div className="grid gap-2">
            {education.length === 0 && (
              <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
                No items — click Add.
              </div>
            )}
            {education.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <TextInput
                  {...form.register(`about.education.${i}` as const)}
                />
                <Button
                  type="button"
                  onClick={() => removeAt("about.education", i)}
                >
                  −
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <header className="flex items-center gap-3">
            <h3 className="text-base font-semibold">Skills &amp; Focus</h3>
            <div className="h-px flex-1 bg-gray-200" />
            <Button type="button" onClick={() => push("about.skills", "")}>
              Add
            </Button>
          </header>
          <div className="grid gap-2">
            {skills.length === 0 && (
              <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
                No items — click Add.
              </div>
            )}
            {skills.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <TextInput {...form.register(`about.skills.${i}` as const)} />
                <Button
                  type="button"
                  onClick={() => removeAt("about.skills", i)}
                >
                  −
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <header className="flex items-center gap-3">
            <h3 className="text-base font-semibold">Tools</h3>
            <div className="h-px flex-1 bg-gray-200" />
            <Button type="button" onClick={() => push("about.tools", "")}>
              Add
            </Button>
          </header>
          <div className="grid gap-2">
            {tools.length === 0 && (
              <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
                No items — click Add.
              </div>
            )}
            {tools.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <TextInput {...form.register(`about.tools.${i}` as const)} />
                <Button
                  type="button"
                  onClick={() => removeAt("about.tools", i)}
                >
                  −
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">By the numbers</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() =>
              statsArray.append({ v: 0, suffix: "", k: "", sub: "" })
            }
          >
            Add stat
          </Button>
        </header>
        <div className="grid gap-4">
          {statsArray.fields.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
              No stats — click “Add stat”.
            </div>
          )}
          {statsArray.fields.map((f, i) => (
            <div key={f.id} className="rounded-xl border p-4 grid gap-3">
              <div className="grid md:grid-cols-4 gap-3">
                <Field id={`stat-v-${i}`} label="Value">
                  <TextInput
                    inputMode="numeric"
                    {...form.register(`about.stats.${i}.v` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </Field>
                <Field id={`stat-suffix-${i}`} label="Suffix">
                  <TextInput
                    {...form.register(`about.stats.${i}.suffix` as const)}
                  />
                </Field>
                <Field id={`stat-k-${i}`} label="Label">
                  <TextInput
                    {...form.register(`about.stats.${i}.k` as const)}
                  />
                </Field>
                <Field id={`stat-sub-${i}`} label="Subtext">
                  <TextInput
                    {...form.register(`about.stats.${i}.sub` as const)}
                  />
                </Field>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => statsArray.remove(i)}
                  className="rounded-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
