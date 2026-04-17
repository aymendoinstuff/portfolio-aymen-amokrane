"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({
  value,
  onChange,
  placeholder = "Add tag…",
  className = "",
}: TagInputProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      remove(value[value.length - 1]);
    } else if (e.key === ",") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div
      className={[
        "flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-lg bg-white min-h-[44px] cursor-text focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all",
        className,
      ].join(" ")}
      onClick={(e) => {
        const el = e.currentTarget.querySelector(
          "input"
        ) as HTMLInputElement | null;
        el?.focus();
      }}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-black text-white pl-2.5 pr-1.5 py-0.5 rounded-full text-xs font-medium leading-tight"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(tag);
            }}
            className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-white/20"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] outline-none text-sm bg-transparent placeholder:text-gray-400"
      />
    </div>
  );
}
