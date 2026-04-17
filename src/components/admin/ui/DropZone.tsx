"use client";

import {
  useState,
  useRef,
  useCallback,
  DragEvent,
  ChangeEvent,
} from "react";
import { Upload as UploadIcon, Loader2 } from "lucide-react";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface DropZoneProps {
  value?: string;
  onUploaded: (url: string) => void;
  onClear?: () => void;
  accept?: string;
  aspectRatio?: string;
  placeholder?: string;
  className?: string;
}

export default function DropZone({
  value,
  onUploaded,
  onClear,
  accept = "image/*",
  aspectRatio = "16/9",
  placeholder = "Drop image here or click to upload",
  className = "",
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    (file: File) => {
      setUploading(true);
      const path = `uploads/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        "state_changed",
        (snap) =>
          setProgress(
            Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          ),
        (err) => {
          console.error(err);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          onUploaded(url);
          setUploading(false);
          setProgress(0);
        }
      );
    },
    [onUploaded]
  );

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  return (
    <div
      className={[
        "relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
        dragging
          ? "border-black bg-gray-50 scale-[0.99]"
          : value
          ? "border-transparent"
          : "border-dashed border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
        className,
      ].join(" ")}
      style={{ aspectRatio }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
    >
      {value ? (
        <>
          <img src={value} alt="" className="w-full h-full object-cover" />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="bg-white text-black px-3 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-gray-100 transition-colors"
            >
              Replace
            </button>
            {onClear && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="bg-white/20 text-white border border-white/50 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="animate-spin text-gray-400" size={28} />
              <div className="text-sm text-gray-500 font-medium">
                Uploading… {progress}%
              </div>
              <div className="w-36 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <UploadIcon className="text-gray-400" size={22} />
              </div>
              <div className="text-center px-6">
                <p className="text-sm font-medium text-gray-500">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
