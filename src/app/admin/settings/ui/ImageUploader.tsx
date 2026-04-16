"use client";
import * as React from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";

export function ImageUploader({
  value,
  onChange,
  folder = "avatars",
  accept = "image/*",
  label = "Upload image",
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
}) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const handle = async (file: File) => {
    setError(null);
    setBusy(true);
    try {
      const storage = getStorage();
      const path = `${folder}/${uuid()}-${file.name}`;
      const r = ref(storage, path);
      await uploadBytes(r, file, { contentType: file.type });
      const url = await getDownloadURL(r);
      onChange(url);
    } catch (e) {
      console.error(e);
      setError("Upload failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
          <input
            type="file"
            className="sr-only"
            accept={accept}
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              if (f) handle(f);
            }}
          />
          {busy ? "Uploading…" : label}
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-4"
          >
            Open
          </a>
        )}
      </div>
      {value && (
        <div className="overflow-hidden rounded-xl border">
          <img src={value} alt="Avatar" className="h-28 w-28 object-cover" />
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
