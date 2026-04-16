"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { Field } from "../ui/Field";
import { TextInput, Button } from "../ui/Inputs";

export function WorkSection({
  form,
  onReset,
  collabIds = [],
}: {
  form: UseFormReturn<SiteSettings>;
  onReset?: () => void;
  collabIds?: string[];
}) {
  const categories = useFieldArray({
    control: form.control,
    name: "work.categories",
  });
  const main = useFieldArray({ control: form.control, name: "work.main" });
  const collaborations = useFieldArray({
    control: form.control,
    name: "work.collaborations",
  });

  return (
    <section role="tabpanel" aria-labelledby="tab-WORK" className="grid gap-8">
      <header className="flex items-center gap-6">
        <h2 className="text-lg font-semibold">Work</h2>
        <div className="h-px flex-1 bg-gray-200" />
        {onReset && (
          <Button type="button" onClick={onReset}>
            Reset section
          </Button>
        )}
      </header>

      {/* Categories */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Categories</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() => categories.append({ value: "" })}
          >
            Add
          </Button>
        </header>
        {categories.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No categories — click Add.
          </div>
        )}
        {categories.fields.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            <TextInput
              {...form.register(`work.categories.${i}.value` as const)}
            />
            <Button type="button" onClick={() => categories.remove(i)}>
              −
            </Button>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Main works (pinned first)</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button type="button" onClick={() => main.append({ projectId: "" })}>
            Add
          </Button>
        </header>
        {main.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No items — click Add.
          </div>
        )}
        {main.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid md:grid-cols-2 gap-2 rounded-xl border p-3"
          >
            <Field id={`work-main-id-${i}`} label="Project ID">
              <TextInput
                {...form.register(`work.main.${i}.projectId` as const)}
              />
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <Button type="button" onClick={() => main.remove(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Collaborations */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Collaboration projects</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() =>
              collaborations.append({ collaborationId: collabIds[0] ?? "" })
            }
          >
            Add
          </Button>
        </header>
        {collaborations.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No collaborations — click Add.
          </div>
        )}
        {collaborations.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid md:grid-cols-2 gap-2 rounded-xl border p-3"
          >
            <Field id={`work-collab-id-${i}`} label="Collaboration ID">
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-base"
                {...form.register(
                  `work.collaborations.${i}.collaborationId` as const
                )}
              >
                <option value="">(none)</option>
                {collabIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <Button type="button" onClick={() => collaborations.remove(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
