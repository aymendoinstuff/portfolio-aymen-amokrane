// lib/types/collaboration.ts
export type CollaborationDoc = {
  id?: string;
  projectTitle: string;
  summary: string;
  contact: { name: string; email: string };
  status: "pending" | "approved" | "rejected";
  published: boolean;
  createdAt?: number;
  updatedAt?: number;

  // ---- design-friendly optional fields ----
  tagline?: string;
  roleWanted?: string; // e.g., “Brand Designer”, “Motion”
  skills?: string[]; // quick badges
  tags?: string[]; // topic/discipline chips
  coverImage?: string | null; // hero/thumbnail
  gallery?: { type: "image" | "video"; url: string; alt?: string }[]; // reuse your MediaItem idea
  links?: {
    brief?: string; // a doc link
    deck?: string; // pitch deck
    behance?: string;
    live?: string; // live preview
    repo?: string;
  };
  org?: string; // company/collective
  budget?: string; // “Fixed 5k”, “T&M”, etc.
  timeline?: string; // “2–4 weeks”
  location?: string; // “Remote”, “Berlin”
};
