"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { Field } from "../ui/Field";
import { TextInput, Textarea, Button } from "../ui/Inputs";

export function GeneralSection({
  form,
  onReset,
}: {
  form: UseFormReturn<SiteSettings>;
  onReset?: () => void;
}) {
  const navLinks = useFieldArray({ control: form.control, name: "nav.links" });
  const footerLinks = useFieldArray({
    control: form.control,
    name: "footer.links",
  });
  return (
    <section
      role="tabpanel"
      aria-labelledby="tab-GENERAL"
      className="grid gap-8"
    >
      <header className="flex items-center gap-6">
        <h2 className="text-lg font-semibold">General</h2>
        <div className="h-px flex-1 bg-gray-200" />
        {onReset && (
          <Button type="button" onClick={onReset}>
            Reset section
          </Button>
        )}
      </header>
      <div className="grid gap-4">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Navigation</h3>
          <div className="h-px flex-1 bg-gray-200" />
        </header>
        <Field id="nav-brand" label="Brand">
          <TextInput {...form.register("nav.brand")} />
        </Field>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Links</div>
            <Button
              type="button"
              onClick={() => navLinks.append({ label: "", href: "" })}
            >
              Add link
            </Button>
          </div>
          {navLinks.fields.length === 0 && (
            <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
              No links — click Add.
            </div>
          )}
          {navLinks.fields.map((f, i) => (
            <div
              key={f.id}
              className="grid md:grid-cols-2 gap-2 rounded-xl border p-3"
            >
              <Field id={`nav-link-label-${i}`} label="Label">
                <TextInput
                  {...form.register(`nav.links.${i}.label` as const)}
                />
              </Field>
              <Field id={`nav-link-href-${i}`} label="Href">
                <TextInput {...form.register(`nav.links.${i}.href` as const)} />
              </Field>
              <div className="md:col-span-2 flex justify-end">
                <Button type="button" onClick={() => navLinks.remove(i)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Footer</h3>
          <div className="h-px flex-1 bg-gray-200" />
        </header>
        <Field id="footer-cta-headline" label="CTA Headline">
          <TextInput {...form.register("footer.ctaHeadline")} />
        </Field>
        <Field id="footer-cta-subtext" label="CTA Subtext">
          <Textarea rows={2} {...form.register("footer.ctaSubtext")} />
        </Field>
        <div className="grid md:grid-cols-2 gap-2">
          <Field id="footer-cta-label" label="CTA Button Label">
            <TextInput {...form.register("footer.ctaButton.label")} />
          </Field>
          <Field id="footer-cta-href" label="CTA Button Href">
            <TextInput {...form.register("footer.ctaButton.href")} />
          </Field>
        </div>
        <Field id="footer-copyright" label="Copyright (use {year})">
          <TextInput {...form.register("footer.copyright")} />
        </Field>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Links</div>
            <Button
              type="button"
              onClick={() => footerLinks.append({ label: "", href: "" })}
            >
              Add link
            </Button>
          </div>
          {footerLinks.fields.length === 0 && (
            <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
              No links — click Add.
            </div>
          )}
          {footerLinks.fields.map((f, i) => (
            <div
              key={f.id}
              className="grid md:grid-cols-2 gap-2 rounded-xl border p-3"
            >
              <Field id={`footer-link-label-${i}`} label="Label">
                <TextInput
                  {...form.register(`footer.links.${i}.label` as const)}
                />
              </Field>
              <Field id={`footer-link-href-${i}`} label="Href">
                <TextInput
                  {...form.register(`footer.links.${i}.href` as const)}
                />
              </Field>
              <div className="md:col-span-2 flex justify-end">
                <Button type="button" onClick={() => footerLinks.remove(i)}>
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
