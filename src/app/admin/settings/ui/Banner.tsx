"use client";
import * as React from "react";
export function Banner({
  tone,
  children,
}: {
  tone: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="rounded-xl border border-gray-300 bg-white p-4 text-sm text-black shadow-sm"
    >
      {children}
    </div>
  );
}
