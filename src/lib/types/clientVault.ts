export type ClientStatus = "active" | "completed" | "on-hold" | "paused";

export type DocType =
  | "initial_proposal"
  | "revised_proposal"
  | "final_proposal"
  | "contract"
  | "invoice"
  | "brief"
  | "other";

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  initial_proposal:  "Initial Proposal",
  revised_proposal:  "Revised Proposal",
  final_proposal:    "Final Proposal",
  contract:          "Contract",
  invoice:           "Invoice",
  brief:             "Brief",
  other:             "Other",
};

export const DOC_TYPES = Object.keys(DOC_TYPE_LABELS) as DocType[];

export type ClientFile = {
  id: string;
  label: string;
  docType: DocType;
  url: string;          // Firebase Storage download URL
  storagePath: string;  // Firebase Storage path (for deletion)
  size: number;         // bytes
  mimeType: string;
  uploadedAt: number;   // epoch ms
  notes?: string;
};

export type ClientVaultDoc = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  industry?: string;
  projectTitle?: string;
  status: ClientStatus;
  value?: string;       // e.g. "$5,000"
  startDate?: string;   // ISO date string
  endDate?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};
