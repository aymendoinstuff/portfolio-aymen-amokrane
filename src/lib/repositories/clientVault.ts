import { adminDb } from "@/lib/firebase/admin";
import type { ClientVaultDoc, ClientFile } from "@/lib/types/clientVault";

function sanitise<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function repoListClients(): Promise<ClientVaultDoc[]> {
  const snap = await adminDb.collection("clientVault").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => sanitise<ClientVaultDoc>({ ...d.data(), id: d.id }));
}

export async function repoGetClient(id: string): Promise<ClientVaultDoc | null> {
  const doc = await adminDb.collection("clientVault").doc(id).get();
  if (!doc.exists) return null;
  return sanitise<ClientVaultDoc>({ ...doc.data(), id: doc.id });
}

export async function repoCreateClient(
  data: Omit<ClientVaultDoc, "id" | "createdAt" | "updatedAt">
): Promise<ClientVaultDoc> {
  const now = Date.now();
  const ref = adminDb.collection("clientVault").doc();
  const client: ClientVaultDoc = { ...data, id: ref.id, createdAt: now, updatedAt: now };
  await ref.set(client);
  return client;
}

export async function repoUpdateClient(
  id: string,
  data: Partial<Omit<ClientVaultDoc, "id" | "createdAt">>
): Promise<void> {
  await adminDb.collection("clientVault").doc(id).update({ ...data, updatedAt: Date.now() });
}

export async function repoDeleteClient(id: string): Promise<void> {
  // Delete all files subcollection docs first
  const filesSnap = await adminDb.collection("clientVault").doc(id).collection("files").get();
  const batch = adminDb.batch();
  filesSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(adminDb.collection("clientVault").doc(id));
  await batch.commit();
}

// ── Files (metadata only — actual file lives in Firebase Storage) ─────────────

export async function repoListClientFiles(clientId: string): Promise<ClientFile[]> {
  const snap = await adminDb
    .collection("clientVault").doc(clientId)
    .collection("files")
    .orderBy("uploadedAt", "desc")
    .get();
  return snap.docs.map((d) => sanitise<ClientFile>({ ...d.data(), id: d.id }));
}

export async function repoAddClientFile(
  clientId: string,
  file: Omit<ClientFile, "id">
): Promise<ClientFile> {
  const ref = adminDb.collection("clientVault").doc(clientId).collection("files").doc();
  const record: ClientFile = { ...file, id: ref.id };
  await ref.set(record);
  // bump client updatedAt
  await adminDb.collection("clientVault").doc(clientId).update({ updatedAt: Date.now() });
  return record;
}

export async function repoDeleteClientFile(clientId: string, fileId: string): Promise<void> {
  await adminDb
    .collection("clientVault").doc(clientId)
    .collection("files").doc(fileId)
    .delete();
}
