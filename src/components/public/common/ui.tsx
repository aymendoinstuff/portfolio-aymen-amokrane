// components/ui/index.tsx
import * as React from "react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/* Design tokens (single source of truth)                              */
/* ------------------------------------------------------------------ */
const BORDER = "border-2 border-black";
const RADIUS_SOFT = "rounded-2xl";
const RADIUS_PILL = "rounded-full";
const FOCUS_RING = "focus:outline-none focus:ring-4 focus:ring-black/10";

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type BtnVariant = "solid" | "outline" | "ghost";
type BtnSize = "sm" | "md" | "lg";

export interface BtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Btn = React.forwardRef<HTMLButtonElement, BtnProps>(
  (
    {
      className,
      variant = "outline",
      size = "md",
      fullWidth,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base = cn(
      "inline-flex items-center justify-center gap-2 transition",
      BORDER,
      RADIUS_PILL,
      FOCUS_RING,
      fullWidth && "w-full",
      (disabled || loading) && "opacity-60 pointer-events-none"
    );

    const sizes: Record<BtnSize, string> = {
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-5 py-2",
      lg: "text-base px-6 py-3",
    };

    const variants: Record<BtnVariant, string> = {
      outline: "bg-white hover:bg-black hover:text-white",
      solid: "bg-black text-white hover:opacity-90",
      ghost: "bg-transparent hover:bg-black/5",
    };

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block size-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
            <span className="sr-only">Loading…</span>
            {children && <span>{children}</span>}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Btn.displayName = "Btn";

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={cn(
          "w-full bg-white",
          BORDER,
          RADIUS_SOFT,
          "px-3 py-2",
          FOCUS_RING,
          disabled && "opacity-60 pointer-events-none",
          invalid && "outline outline-2 outline-red-500/30",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/* ------------------------------------------------------------------ */
/* Select                                                              */
/* ------------------------------------------------------------------ */

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, disabled, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={cn(
          "w-full bg-white appearance-none",
          BORDER,
          RADIUS_SOFT,
          "px-3 py-2",
          FOCUS_RING,
          "bg-[length:12px_12px] bg-[right_0.75rem_center] bg-no-repeat", // space for chevron
          disabled && "opacity-60 pointer-events-none",
          invalid && "outline outline-2 outline-red-500/30",
          className
        )}
        // You can swap this with a custom icon if you like
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

/* ------------------------------------------------------------------ */
/* Textarea                                                            */
/* ------------------------------------------------------------------ */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={cn(
          "w-full bg-white min-h-[140px]",
          BORDER,
          RADIUS_SOFT,
          "px-3 py-2",
          FOCUS_RING,
          disabled && "opacity-60 pointer-events-none",
          invalid && "outline outline-2 outline-red-500/30",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

/* ------------------------------------------------------------------ */
/* Field (label + control + hint/error)                                */
/* ------------------------------------------------------------------ */

interface FieldProps {
  label: string;
  htmlFor?: string;
  className?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  className,
  hint,
  error,
  children,
}: FieldProps) {
  const describedById = error
    ? `${htmlFor}-error`
    : hint
    ? `${htmlFor}-hint`
    : undefined;

  return (
    <div className={cn("grid gap-1", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-wide opacity-70"
      >
        {label}
      </label>
      {/* Control */}
      <div aria-describedby={describedById}>{children}</div>
      {/* Helper text / error */}
      {hint && !error && (
        <p id={describedById} className="text-xs opacity-60">
          {hint}
        </p>
      )}
      {error && (
        <p id={describedById} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}