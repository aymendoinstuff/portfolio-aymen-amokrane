"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full border-2 border-black px-3 py-2 text-sm outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60",
        pending ? "cursor-wait" : "hover:bg-black hover:text-white"
      )}
    >
      <LogOut size={16} aria-hidden="true" />
      {pending ? "Logging out..." : "Logout"}
    </button>
  );
}

export default function LogoutButton({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
