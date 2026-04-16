import { cn } from "@/lib/utils/cn";
import type { PropsWithChildren } from "react";

export type ContainerProps = Readonly<
  PropsWithChildren<{ className?: string }>
>;

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("max-w-6xl mx-auto px-4", className)}>{children}</div>
  );
}
