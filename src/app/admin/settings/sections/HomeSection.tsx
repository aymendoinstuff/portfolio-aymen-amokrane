"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { Field } from "../ui/Field";
import { TextInput, Textarea, Button, Select } from "../ui/Inputs";
import { stats } from "@/lib/data/about";

export function HomeSection({
  form,
  onReset,
}: {
  form: UseFormReturn<SiteSettings>;
  onReset?: () => void;
}) {
  const sections = useFieldArray({
    control: form.control,
    name: "home.sections",
  });
  const testimonials = useFieldArray({
    control: form.control,
    name: "home.testimonials",
  });
  const carousel = useFieldArray({
    control: form.control,
    name: "home.carousel",
  });
  const clients = useFieldArray({
    control: form.control,
    name: "home.clients",
  });

  // For numbers picker
  const numberIndices = form.watch("home.numberStatIndices");

  const toggleStatIndex = (index: number) => {
    const current = numberIndices || [];
    const newIndices = current.includes(index)
      ? current.filter((i) => i !== index)
      : [...current, index].slice(-4); // Max 4
    form.setValue("home.numberStatIndices", newIndices);
  };

  return (
    <section role="tabpanel" aria-labelledby="tab-HOME" className="grid gap-8">
      <header className="flex items-center gap-6">
        <h2 className="text-lg font-semibold">Home</h2>
        <div className="h-px flex-1 bg-gray-200" />
        {onReset && (
          <Button type="button" onClick={onReset}>
            Reset section
          </Button>
        )}
      </header>

      {/* Basic hero fields */}
      <div className="grid gap-6">
        <Field id="home-heroHeadline" label="Hero — Headline">
          <TextInput {...form.register("home.heroHeadline")} />
        </Field>
        <Field id="home-heroSubline" label="Hero — Subline">
          <TextInput {...form.register("home.heroSubline")} />
        </Field>
        <div className="grid md:grid-cols-2 gap-2">
          <Field id="home-cta-label" label="Hero — CTA Label">
            <TextInput {...form.register("home.heroCta.label")} />
          </Field>
          <Field id="home-cta-href" label="Hero — CTA Href">
            <TextInput {...form.register("home.heroCta.href")} />
          </Field>
        </div>
      </div>

      {/* Sections Manager */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Page Sections</h3>
          <div className="h-px flex-1 bg-gray-200" />
        </header>
        <div className="space-y-2 rounded-lg border p-4">
          {sections.fields.map((field, i) => (
            <div
              key={field.id}
              className="flex items-center gap-3 py-2 border-b last:border-b-0"
            >
              <label className="flex-1 text-sm font-medium">
                {field.id.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type="checkbox"
                {...form.register(`home.sections.${i}.visible` as const)}
                className="w-4 h-4"
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (i > 0) {
                      [sections.fields[i], sections.fields[i - 1]].forEach(
                        (f, idx) => {
                          form.setValue(
                            `home.sections.${i - (1 - idx)}.order` as const,
                            idx
                          );
                        }
                      );
                      sections.move(i, i - 1);
                    }
                  }}
                  disabled={i === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (i < sections.fields.length - 1) {
                      [sections.fields[i], sections.fields[i + 1]].forEach(
                        (f, idx) => {
                          form.setValue(
                            `home.sections.${i + idx}.order` as const,
                            idx
                          );
                        }
                      );
                      sections.move(i, i + 1);
                    }
                  }}
                  disabled={i === sections.fields.length - 1}
                >
                  ↓
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Manager */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Testimonials</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() =>
              testimonials.append({
                text: "",
                author: "",
                role: "",
                company: "",
              })
            }
          >
            Add testimonial
          </Button>
        </header>
        {testimonials.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No testimonials — click Add.
          </div>
        )}
        {testimonials.fields.map((f, i) => (
          <div key={f.id} className="space-y-2 rounded-xl border p-3">
            <Field id={`testimonial-text-${i}`} label="Quote">
              <Textarea {...form.register(`home.testimonials.${i}.text` as const)} />
            </Field>
            <Field id={`testimonial-author-${i}`} label="Author">
              <TextInput
                {...form.register(`home.testimonials.${i}.author` as const)}
              />
            </Field>
            <div className="grid md:grid-cols-2 gap-2">
              <Field id={`testimonial-role-${i}`} label="Role">
                <TextInput
                  {...form.register(`home.testimonials.${i}.role` as const)}
                />
              </Field>
              <Field id={`testimonial-company-${i}`} label="Company">
                <TextInput
                  {...form.register(
                    `home.testimonials.${i}.company` as const
                  )}
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => testimonials.remove(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Numbers Picker */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">
            Stats to Display (max 4)
          </h3>
          <div className="h-px flex-1 bg-gray-200" />
        </header>
        <div className="grid gap-2 rounded-lg border p-4">
          {stats.map((stat, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={numberIndices?.includes(i) ?? false}
                onChange={() => toggleStatIndex(i)}
                disabled={(numberIndices?.length ?? 0) >= 4 && !numberIndices?.includes(i)}
                className="w-4 h-4 mt-1"
              />
              <div>
                <p className="text-sm font-medium">{stat.k}</p>
                <p className="text-xs text-gray-600">{stat.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Clients Manager */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Clients</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() => clients.append({ name: "", href: "", logoHref: "" })}
          >
            Add client
          </Button>
        </header>
        {clients.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No clients — click Add.
          </div>
        )}
        {clients.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid md:grid-cols-3 gap-2 rounded-xl border p-3"
          >
            <Field id={`client-name-${i}`} label="Name">
              <TextInput
                {...form.register(`home.clients.${i}.name` as const)}
              />
            </Field>
            <Field id={`client-href-${i}`} label="Link">
              <TextInput
                {...form.register(`home.clients.${i}.href` as const)}
              />
            </Field>
            <Field id={`client-logo-${i}`} label="Logo URL">
              <TextInput
                {...form.register(`home.clients.${i}.logoHref` as const)}
              />
            </Field>
            <div className="md:col-span-3 flex justify-end">
              <Button type="button" onClick={() => clients.remove(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured projects carousel (legacy) */}
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">
            Featured projects (carousel)
          </h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button
            type="button"
            onClick={() => carousel.append({ projectId: "", tagline: "" })}
          >
            Add
          </Button>
        </header>
        {carousel.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No items — click Add.
          </div>
        )}
        {carousel.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid md:grid-cols-2 gap-2 rounded-xl border p-3"
          >
            <Field id={`home-carousel-id-${i}`} label="Project ID">
              <TextInput
                {...form.register(`home.carousel.${i}.projectId` as const)}
              />
            </Field>
            <Field id={`home-carousel-tagline-${i}`} label="Tagline">
              <TextInput
                {...form.register(`home.carousel.${i}.tagline` as const)}
              />
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <Button type="button" onClick={() => carousel.remove(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
