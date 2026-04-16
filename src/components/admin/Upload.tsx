"use client";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from "react";
export default function Upload({
  onUploaded,
  accept = "image/*,video/*",
}: {
  onUploaded: (url: string) => void;
  accept?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const path = `uploads/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => {
        setProgress(
          Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        );
      },
      (err) => {
        console.error(err);
        setBusy(false);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onUploaded(url);
        setBusy(false);
      }
    );
  };
  return (
    <div>
      <input type="file" accept={accept} onChange={onChange} />
      {busy && <div className="text-xs mt-1">Uploading… {progress}%</div>}
    </div>
  );
}
