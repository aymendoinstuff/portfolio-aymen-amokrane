"use client";
import * as React from "react";

/* -------------------------------------------------------
   Shared input styling
------------------------------------------------------- */
export const baseInput = [
  "w-full rounded-xl border border-gray-300",
  "bg-white px-3 h-[44px]",
  "text-sm text-black",
  "outline-none",
  "transition",
  "focus:border-black focus:ring-1 focus:ring-black",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

/* -------------------------------------------------------
   TextInput
------------------------------------------------------- */
export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...p }, ref) => (
  <input
    ref={ref}
    {...p}
    className={[baseInput, className].filter(Boolean).join(" ")}
  />
));
TextInput.displayName = "TextInput";

/* -------------------------------------------------------
   Textarea
------------------------------------------------------- */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...p }, ref) => (
  <textarea
    ref={ref}
    {...p}
    className={[baseInput, "min-h-[100px]", className]
      .filter(Boolean)
      .join(" ")}
  />
));
Textarea.displayName = "Textarea";

/* -------------------------------------------------------
   Select
------------------------------------------------------- */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...p }, ref) => (
  <select
    ref={ref}
    {...p}
    className={[baseInput, className].filter(Boolean).join(" ")}
  >
    {children}
  </select>
));
Select.displayName = "Select";

/* -------------------------------------------------------
   Checkbox
------------------------------------------------------- */
export const Checkbox = ({
  id,
  checked,
  onChange,
  label = "Enabled",
  description,
  className,
  ...rest
}: {
  id: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  label?: string;
  description?: React.ReactNode;
  className?: string;
}) => (
  <label
    htmlFor={id}
    className={[
      "flex h-[44px] cursor-pointer items-center gap-3 rounded-xl px-3 hover:bg-gray-50 transition",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {/* Native input (hidden) */}
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.currentTarget.checked)}
      className="sr-only"
      {...rest}
    />

    {/* Custom square */}
    <span
      aria-hidden
      className={[
        "grid place-items-center h-5 w-5 rounded-md border-2 transition",
        checked
          ? "bg-gradient-to-br from-black to-gray-800 border-black shadow-inner"
          : "bg-white border-gray-300",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        fill="none"
        stroke={checked ? "white" : "transparent"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8l3 3 7-7" />
      </svg>
    </span>

    {/* Label text */}
    <div className="flex-1">
      <div className="text-sm text-black">{label}</div>
      {description && (
        <div className="text-xs text-gray-500 leading-4">{description}</div>
      )}
    </div>
  </label>
);

/* -------------------------------------------------------
   Button
------------------------------------------------------- */
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: "sm" | "md" }
> = ({ children, className, size = "md", ...rest }) => {
  const sizeClasses =
    size === "sm" ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center",
        "rounded-xl border border-gray-300 bg-white",
        "font-medium",
        "shadow-sm transition hover:bg-gray-50",
        "disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black",
        sizeClasses,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
};
