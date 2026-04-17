"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

export interface ToastMsg {
  id: number;
  type: ToastType;
  message: string;
}

// Module-level singleton so it can be called from outside React
let _dispatch: ((type: ToastType, msg: string) => void) | null = null;

export const toast = {
  success: (msg: string) => _dispatch?.("success", msg),
  error: (msg: string) => _dispatch?.("error", msg),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    _dispatch = (type, message) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 3500);
    };
    return () => {
      _dispatch = null;
    };
  }, [remove]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "pointer-events-auto flex items-center gap-2.5 pl-3.5 pr-3 py-2.5 rounded-xl shadow-xl text-sm font-medium max-w-xs",
            "animate-[fadeSlideUp_0.2s_ease-out]",
            t.type === "success"
              ? "bg-gray-900 text-white"
              : "bg-red-600 text-white",
          ].join(" ")}
        >
          {t.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <XCircle size={16} className="shrink-0" />
          )}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="opacity-60 hover:opacity-100 transition-opacity ml-1"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
