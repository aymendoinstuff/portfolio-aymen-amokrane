/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import Upload from "./Upload";
import type { ArticleDoc } from "@/lib/types/article";
import type { MediaItem } from "@/lib/types/common";
import { firestore } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
export default function ArticleForm({
  id,
  initial,
}: {
  id?: string;
  initial?: Partial<ArticleDoc>;
}) {
  const { register, handleSubmit, setValue, watch } = useForm<ArticleDoc>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      coverUrl: "",
      media: [],
      published: false,
      ...(initial as any),
    },
  });
  const [saving, setSaving] = useState(false);
  const media = watch("media") || [];
  const onSubmit = async (data: ArticleDoc) => {
    setSaving(true);
    const _id =
      id || data.slug || data.title.toLowerCase().replace(/\s+/g, "-");
    await setDoc(
      doc(firestore, "articles", _id),
      {
        ...data,
        updatedAt: Date.now(),
        createdAt: (initial?.createdAt as any) || Date.now(),
      },
      { merge: true }
    );
    setSaving(false);
    alert("Saved");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label>Title</label>
          <input
            className="border rounded px-2 py-1"
            {...register("title", { required: true })}
          />
        </div>
        <div className="grid gap-1">
          <label>Slug</label>
          <input
            className="border rounded px-2 py-1"
            {...register("slug", { required: true })}
          />
        </div>
        <div className="grid gap-1">
          <label>Published</label>
          <input type="checkbox" {...register("published")} />
        </div>
      </div>
      <div className="grid gap-1">
        <label>Excerpt</label>
        <textarea
          className="border rounded px-2 py-1 min-h-[80px]"
          {...register("excerpt")}
        />
      </div>
      <div className="grid gap-1">
        <label>Body (Markdown allowed)</label>
        <textarea
          className="border rounded px-2 py-1 min-h-[160px]"
          {...register("body")}
        />
      </div>
      <div className="grid gap-1">
        <label>Cover</label>
        <div className="flex items-center gap-3">
          <input
            className="border rounded px-2 py-1 flex-1"
            {...register("coverUrl")}
          />
          <Upload onUploaded={(url) => setValue("coverUrl", url)} />
        </div>
      </div>
      <div className="grid gap-2">
        <label>Media</label>
        <div className="grid gap-2">
          {media.map((m: MediaItem, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={m.type}
                onChange={(e) => {
                  const arr = [...media];
                  arr[i] = { ...arr[i], type: e.target.value as any };
                  setValue("media", arr as any);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
              <input
                value={m.url}
                onChange={(e) => {
                  const arr = [...media];
                  arr[i] = { ...arr[i], url: e.target.value };
                  setValue("media", arr as any);
                }}
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  const arr = media.filter((_, ix) => ix !== i);
                  setValue("media", arr as any);
                }}
                className="text-sm underline"
              >
                remove
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border rounded px-2 py-1"
              onClick={() =>
                setValue("media", [...media, { type: "image", url: "" } as any])
              }
            >
              + Add
            </button>
            <Upload
              onUploaded={(url) =>
                setValue("media", [...media, { type: "image", url } as any])
              }
            />
          </div>
        </div>
      </div>
      <div>
        <button
          className="rounded-full border-2 border-black px-4 py-2"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
