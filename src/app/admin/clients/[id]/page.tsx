import { notFound } from "next/navigation";
import { repoGetClient, repoListClientFiles } from "@/lib/repositories/clientVault";
import ClientDetailClient from "./ClientDetailClient";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, files] = await Promise.all([repoGetClient(id), repoListClientFiles(id)]);
  if (!client) notFound();
  return <ClientDetailClient client={client} initialFiles={files} />;
}
