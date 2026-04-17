// Server Component
import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100vh] md:grid-cols-[240px_1fr] bg-gray-50">
      <AdminSidebar />
      <div className="min-w-0 overflow-hidden">{children}</div>
    </div>
  );
}
