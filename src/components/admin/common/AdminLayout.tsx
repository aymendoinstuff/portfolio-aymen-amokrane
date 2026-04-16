// Server Component
import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100vh] md:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <main className="p-6">{children}</main>
    </div>
  );
}
