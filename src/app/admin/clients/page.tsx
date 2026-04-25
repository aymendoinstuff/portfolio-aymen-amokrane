import { repoListClients } from "@/lib/repositories/clientVault";
import ClientsPageClient from "./ClientsPageClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await repoListClients();
  return <ClientsPageClient initialClients={clients} />;
}
