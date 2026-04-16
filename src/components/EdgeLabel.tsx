/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils/cn";
export default function EdgeLabel({
  children,
  side = "right",
}: {
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "hidden md:block fixed z-30 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.3em] uppercase opacity-60",
        side === "right" ? "right-2" : "left-2"
      )}
      style={{ writingMode: "vertical-rl" as any }}
    >
      {children}
    </div>
  );
}
