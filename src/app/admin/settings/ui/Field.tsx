"use client";
import * as React from "react";

type ControlA11yProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type FieldOwnProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** If true, keeps a fixed line for hint/error to align grid rows */
  reserveHintLine?: boolean;
  /** The control to enhance with id/aria-* */
  children: React.ReactElement<ControlA11yProps>;
};

/** Extend <div> props so className/style/etc. are allowed */
type FieldProps = FieldOwnProps & React.HTMLAttributes<HTMLDivElement>;

export function Field({
  id,
  label,
  required,
  hint,
  error,
  reserveHintLine = true,
  children,
  className,
  ...rest
}: FieldProps) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const child = React.cloneElement(children, {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  });

  return (
    <div
      className={["grid gap-2", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <label htmlFor={id} className="text-sm font-medium leading-5">
        {label}
        {required && (
          <span aria-hidden className="ml-1">
            *
          </span>
        )}
      </label>

      {child}

      {reserveHintLine ? (
        // Single reserved line for alignment (error wins over hint)
        <div className="min-h-[20px] text-xs leading-5">
          {error ? (
            <p id={`${id}-error`} className="text-red-600" role="alert">
              {error}
            </p>
          ) : hint ? (
            <p id={`${id}-hint`} className="opacity-70 whitespace-pre-wrap">
              {hint}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          {hint && (
            <p
              id={`${id}-hint`}
              className="text-xs opacity-70 whitespace-pre-wrap"
            >
              {hint}
            </p>
          )}
          {error && (
            <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
