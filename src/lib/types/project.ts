import type { MediaItem } from "./common";

export type ProjectTeamMember = {
  name: string;
  role: string;
};

export type ProjectLinks = {
  behance?: string;
  caseStudy?: string;
  liveSite?: string;
  repo?: string;
};

export type ProjectTimeline =
  | { start: string; end?: string }
  | { label: string }; // e.g. "2021–2023"

// (A) General Info
export type ProjectGeneralInfo = {
  id: string;
  title: string;
  slug: string;
  year: number;
  tags: string[];
  industry: string;
  heroUrl: string;
  quotes?: string[];
  published: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

// (B) Main Details (short/structured)
export type ProjectDetails = {
  client: string;
  sector: string;
  discipline: string[];
  tagline?: string;
  summary: string;
  team?: ProjectTeamMember[];
  services?: string[];
  deliverables?: string[];
  timeline?: ProjectTimeline;
  location?: string;
  links?: ProjectLinks;
};

export type ProjectMain = {
  brief: string; // concise overview
  gallery: MediaItem[]; // vertical gallery media
  details: ProjectDetails; // structured facts
};

// (C) Extra Details — typed rich-content blocks
export type BlockBase = { id: string };

export type ParagraphBlock = BlockBase & {
  type: "paragraph";
  text: string;
};

export type HeadingBlock = BlockBase & {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
};

export type QuoteBlock = BlockBase & {
  type: "quote";
  text: string;
  cite?: string;
};

export type ImageBlock = BlockBase & {
  type: "image";
  item: MediaItem; // single image
  caption?: string;
};

export type VideoBlock = BlockBase & {
  type: "video";
  item: MediaItem; // single video
  caption?: string;
};

export type MediaGridBlock = BlockBase & {
  type: "grid";
  items: MediaItem[]; // images/videos
  columns?: 1 | 2 | 3 | 4;
  caption?: string;
};

export type ListBlock = BlockBase & {
  type: "list";
  ordered?: boolean;
  items: string[];
};

export type ExtraBlock =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | ImageBlock
  | VideoBlock
  | MediaGridBlock
  | ListBlock;

export type ProjectExtra = {
  blocks: ExtraBlock[];
};
// Unified v2 document (new canonical type)
// Canonical combined type
export type Project = {
  general: ProjectGeneralInfo;
  main: ProjectMain;
  extra?: ProjectExtra;
};
