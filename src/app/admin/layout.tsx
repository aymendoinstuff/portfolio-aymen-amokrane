import type { ReactNode } from "react";
import AdminLayout from "@/components/admin/common/AdminLayout";
import { requireAdmin } from "@/server/auth/guards"; // from your earlier auth.ts

export const dynamic = "force-dynamic"; // optional, if your auth is fully dynamic

export default async function AdminSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin(); // redirects or 404s if not allowed
  return <AdminLayout>{children}</AdminLayout>;
}
