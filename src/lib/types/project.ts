// General info (keep as-is)
export type ProjectGeneralInfo = {
  id: string;
  title: string;
  slug: string;
  year: number;
  tags: string[];
  heroUrl: string;
  published: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

// Main details section
export type ProjectMainDetails = {
  tagline: string;      // short slogan for work page hover + under title
  summary: string;      // small body text shown under title on project page
};

export type ProjectMain = {
  details: ProjectMainDetails;
};

// Notes section (metadata)
export type ProjectNotes = {
  brief?: string;
  client?: string;
  industry?: string;    // single value from dropdown
  services?: string[];  // multi-select from predefined list
  year?: number;
  region?: string;
  deliverables?: string;
};

// Block system
export type MediaItem = {
  url: string;
  caption?: string;     // thin small text under each media item
  mediaType: "image" | "video" | "embed";  // embed = iframe embed code
};

export type MediaBlock = {
  type: "media";
  layout: "full" | "2col" | "3col";
  items: MediaItem[];
};

export type TextBlock = {
  type: "text";
  content: string;
  align: "left" | "center" | "right";
};

export type Block = MediaBlock | TextBlock;

export type ProjectExtra = {
  blocks: Block[];
};

// Canonical combined type
export type Project = {
  general: ProjectGeneralInfo;
  main: ProjectMain;
  notes?: ProjectNotes;
  extra?: ProjectExtra;
};
