"use client";
import * as React from "react";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { Loader2 } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  folder = "avatars",
  accept = "image/*",
  label = "Upload image",
  hint,
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  /** Recommended dimensions shown below the button, e.g. "1920×600 px recommended" */
  hint?: string;
}) {
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handle = (file: File) => {
    setError(null);
    setBusy(true);
    setProgress(0);

    const path = `uploads/${folder}/${uuid()}-${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      (err) => {
        console.error(err);
        setError("Upload failed. Check your Firebase Storage rules.");
        setBusy(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          onChange(url);
        } catch (e) {
          setError("Could not get download URL.");
          console.error(e);
        } finally {
          setBusy(false);
          setProgress(0);
        }
      }
    );
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              if (f) handle(f);
              e.currentTarget.value = "";
            }}
          />
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Uploading… {progress}%</span>
            </>
          ) : (
            label
          )}
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-4 text-gray-500 hover:text-black"
          >
            Open
          </a>
        )}
      </div>

      {/* Progress bar */}
      {busy && (
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
