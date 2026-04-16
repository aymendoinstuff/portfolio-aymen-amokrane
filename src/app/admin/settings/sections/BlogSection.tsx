"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { Field } from "../ui/Field";
import { TextInput, Checkbox, Button } from "../ui/Inputs";

export function BlogSection({
  form,
  onReset,
}: {
  form: UseFormReturn<SiteSettings>;
  onReset?: () => void;
}) {
  // categories as primitive array
  const categories = form.watch("blog.categories") ?? [];
  const addCategory = () =>
    form.setValue("blog.categories", [...categories, ""], {
      shouldDirty: true,
    });
  const removeCategory = (i: number) => {
    const next = [...categories];
    next.splice(i, 1);
    form.setValue("blog.categories", next, { shouldDirty: true });
  };

  const featured = useFieldArray({
    control: form.control,
    name: "blog.featured",
  });

  return (
    <section role="tabpanel" aria-labelledby="tab-BLOG" className="grid gap-8">
      <header className="flex items-center gap-6">
        <h2 className="text-lg font-semibold">Blog</h2>
        <div className="h-px flex-1 bg-gray-200" />
        {onReset && (
          <Button type="button" onClick={onReset}>
            Reset section
          </Button>
        )}
      </header>
      <div className="grid md:grid-cols-3 gap-4 items-start content-start w-full">
        <Field
          id="blog-ppp"
          label="Posts per page"
          hint="1–50"
          className="min-w-0" // <-- important
        >
          <TextInput
            id="blog-ppp"
            className="h-[44px] w-full" // ensure the control stretches
            inputMode="numeric"
            {...form.register("blog.postsPerPage", {
              valueAsNumber: true,
              onChange: (e) => {
                const raw = String(e.currentTarget.value ?? "");
                const n = Math.max(
                  1,
                  Math.min(50, Number(raw.replace(/[^0-9]/g, "")) || 0)
                );
                e.currentTarget.value = String(n);
                return n;
              },
            })}
          />
        </Field>

        <Field
          id="blog-showDates"
          label="Show dates on posts"
          className="min-w-0" // <-- important
        >
          <Checkbox
            id="blog-showDates"
            checked={Boolean(form.watch("blog.showDates"))}
            onChange={(c) =>
              form.setValue("blog.showDates", c, { shouldDirty: true })
            }
            label="Enabled"
            className="w-full" // passes through to label (also w-full in component)
          />
        </Field>

        <Field
          id="blog-newsletter"
          label="Newsletter href"
          className="min-w-0" // <-- important
        >
          <TextInput
            id="blog-newsletter"
            className="h-[44px] w-full"
            {...form.register("blog.newsletterHref")}
          />
        </Field>
      </div>
      
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">Categories</h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button type="button" onClick={addCategory}>
            Add
          </Button>
        </header>
        {categories.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No categories — click Add.
          </div>
        )}
        {categories.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput {...form.register(`blog.categories.${i}` as const)} />
            <Button type="button" onClick={() => removeCategory(i)}>
              −
            </Button>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <header className="flex items-center gap-3">
          <h3 className="text-base font-semibold">
            Main blog posts (featured first)
          </h3>
          <div className="h-px flex-1 bg-gray-200" />
          <Button type="button" onClick={() => featured.append({ postId: "" })}>
            Add
          </Button>
        </header>
        {featured.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No items — click Add.
          </div>
        )}
        {featured.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid md:grid-cols-2 gap-2 rounded-xl border p-3"
          >
            <Field id={`blog-featured-id-${i}`} label="Post ID">
              <TextInput
                {...form.register(`blog.featured.${i}.postId` as const)}
              />
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <Button type="button" onClick={() => featured.remove(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
