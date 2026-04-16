import { cn } from "@/lib/utils/cn";
export default function Placeholder({ className }: { className?: string }) {
  return <div className={cn("bg-neutral-200", className)} />;
}
