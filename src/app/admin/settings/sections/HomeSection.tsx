"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { Field } from "../ui/Field";
import { TextInput, Button } from "../ui/Inputs";

export function HomeSection({
  form,
  onReset,
}: {
  form: UseFormReturn<SiteSettings>;
  onReset?: () => void;
}) {
  const carousel = useFieldArray({
    control: form.control,
    name: "home.carousel",
  });
  const clients = useFieldArray({
    control: form.control,
    name: "home.clients",
  });

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
        <Field id="home-featuredTagline" label="Featured Tagline">
          <TextInput {...form.register("home.featuredTagline")} />
        </Field>
        <Field id="home-featuredProjectId" label="Featured Project ID">
          <TextInput {...form.register("home.featuredProjectId")} />
        </Field>
      </div>

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
    </section>
  );
}
