"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function BigWordRotator({
  words,
  interval = 2400,
  className = "",
}: {
  words: readonly string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return (
    <div
      className={
        "relative h-[1.35em] md:h-[1.25em] overflow-hidden leading-[1.1] " +
        className
      }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 44, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -44, opacity: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
