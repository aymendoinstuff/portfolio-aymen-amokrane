"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Upload, Trash2, ExternalLink, FileText,
  Save, Loader2, AlertTriangle,
} from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import type { ClientVaultDoc, ClientFile, DocType, ClientStatus } from "@/lib/types/clientVault";
import { DOC_TYPE_LABELS, DOC_TYPES } from "@/lib/types/clientVault";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 ** 2).toFixed(1)} MB`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: "active",    label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold",   label: "On Hold" },
  { value: "paused",    label: "Paused" },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function ClientDetailClient({
  client: initial,
  initialFiles,
}: {
  client: ClientVaultDoc;
  initialFiles: ClientFile[];
}) {
  const router = useRouter();
  const [client, setClient] = useState(initial);
  const [files, setFiles] = useState(initialFiles);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingType, setUploadingType] = useState<DocType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingDocType = useRef<DocType>("other");

  // ── Info save ──────────────────────────────────────────────────────────────
  async function saveInfo() {
    setSaving(true);
    try {
      await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
    } finally {
      setSaving(false);
    }
  }

  // ── File upload ────────────────────────────────────────────────────────────
  function triggerUpload(docType: DocType) {
    pendingDocType.current = docType;
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const docType = pendingDocType.current;
    const storagePath = `client-vault/${client.id}/${docType}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);

    setUploadingType(docType);
    setUploadProgress(0);

    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error(err); setUploadingType(null); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        // Save metadata via API
        const res = await fetch(`/api/admin/clients/${client.id}/files`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: file.name,
            docType,
            url,
            storagePath,
            size: file.size,
            mimeType: file.type,
          }),
        });
        const { file: savedFile } = await res.json();
        setFiles((prev) => [savedFile, ...prev]);
        setUploadingType(null);
      }
    );
  }

  // ── File delete ────────────────────────────────────────────────────────────
  async function deleteFile(f: ClientFile) {
    if (!confirm(`Delete "${f.label}"?`)) return;
    await fetch(`/api/admin/clients/${client.id}/files/${f.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storagePath: f.storagePath }),
    });
    setFiles((prev) => prev.filter((x) => x.id !== f.id));
  }

  // ── Client delete ──────────────────────────────────────────────────────────
  async function deleteClient() {
    if (!confirm(`Delete client "${client.name}" and all their files? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
    router.push("/admin/clients");
  }

  // ── Files grouped by doc type ──────────────────────────────────────────────
  const filesByType = DOC_TYPES.reduce((acc, t) => {
    acc[t] = files.filter((f) => f.docType === t);
    return acc;
  }, {} as Record<DocType, ClientFile[]>);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp,.zip" />

      {/* Back + header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/clients" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
        </div>
        <button onClick={deleteClient} disabled={deleting}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
          Delete client
        </button>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8">

        {/* ── Left: Client info form ── */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Client Info</h2>

            {[
              { key: "name",         label: "Name *",         type: "text" },
              { key: "company",      label: "Company",        type: "text" },
              { key: "email",        label: "Email",          type: "email" },
              { key: "phone",        label: "Phone",          type: "text" },
              { key: "industry",     label: "Industry",       type: "text" },
              { key: "projectTitle", label: "Project Title",  type: "text" },
              { key: "value",        label: "Project Value",  type: "text" },
              { key: "startDate",    label: "Start Date",     type: "date" },
              { key: "endDate",      label: "End Date",       type: "date" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
                <input
                  type={type}
                  value={(client as never)[key] ?? ""}
                  onChange={(e) => setClient({ ...client, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            ))}

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
              <select
                value={client.status}
                onChange={(e) => setClient({ ...client, status: e.target.value as ClientStatus })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Notes</label>
              <textarea
                rows={3}
                value={client.notes ?? ""}
                onChange={(e) => setClient({ ...client, notes: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
              />
            </div>

            <button
              onClick={saveInfo}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center">
            Created {formatDate(client.createdAt)}
          </p>
        </div>

        {/* ── Right: Documents ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Documents</h2>

          {DOC_TYPES.map((docType) => {
            const typeFiles = filesByType[docType];
            const isUploading = uploadingType === docType;
            return (
              <div key={docType} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {/* Section header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-800">{DOC_TYPE_LABELS[docType]}</span>
                  <button
                    onClick={() => triggerUpload(docType)}
                    disabled={!!uploadingType}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors disabled:opacity-40"
                  >
                    {isUploading ? (
                      <><Loader2 size={13} className="animate-spin" /> {uploadProgress}%</>
                    ) : (
                      <><Upload size={13} /> Upload</>
                    )}
                  </button>
                </div>

                {/* Files */}
                {typeFiles.length === 0 ? (
                  <div
                    onClick={() => !uploadingType && triggerUpload(docType)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-400 text-sm cursor-pointer hover:bg-gray-50 transition-colors select-none"
                  >
                    <FileText size={16} className="opacity-40" />
                    <span className="text-xs">No files yet — click to upload</span>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {typeFiles.map((f) => (
                      <div key={f.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 group transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText size={15} className="text-gray-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 font-medium truncate">{f.label}</p>
                            <p className="text-[11px] text-gray-400">{formatBytes(f.size)} · {formatDate(f.uploadedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a href={f.url} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
                            <ExternalLink size={14} />
                          </a>
                          <button onClick={() => deleteFile(f)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
