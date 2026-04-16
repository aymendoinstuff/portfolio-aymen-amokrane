"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

type LoadingContextType = {
  show: (opts?: { minMs?: number }) => void;
  hide: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within <LoadingProvider>");
  return ctx;
}

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const lockUntil = useRef<number | null>(null);

  // Prevent flicker by enforcing a minimum visible time
  const show = useCallback((opts?: { minMs?: number }) => {
    const minMs = opts?.minMs ?? 600;
    lockUntil.current = Date.now() + minMs;
    setIsLoading(true);
    // lock scroll while overlay is up
    if (typeof document !== "undefined")
      document.documentElement.classList.add("overflow-hidden");
  }, []);

  const hide = useCallback(() => {
    const remaining = (lockUntil.current ?? 0) - Date.now();
    const ms = Math.max(0, remaining);
    window.setTimeout(() => {
      setIsLoading(false);
      lockUntil.current = null;
      if (typeof document !== "undefined")
        document.documentElement.classList.remove("overflow-hidden");
    }, ms);
  }, []);

  const value = useMemo(
    () => ({ show, hide, isLoading }),
    [show, hide, isLoading]
  );

  // Your animated overlay (ported to <body> to avoid stacking issues)
  const overlay = (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
          aria-live="polite"
          role="alert"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-semibold tracking-wide"
          >
            Loading…
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : null}
    </LoadingContext.Provider>
  );
}
