import { MediaItem } from "./common";

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "divider" };

export type ArticleDoc = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;       // legacy plain text body (kept for backwards compat)
  blocks?: ArticleBlock[]; // new block-based content
  coverUrl?: string;
  coverPosition?: string; // CSS object-position for crop framing e.g. "center", "top", "50% 20%"
  category?: string;
  tags?: string[];
  media?: MediaItem[];
  published: boolean;
  views?: number;
  likes?: number;
  dislikes?: number;
  readTime?: number; // estimated minutes
  createdAt?: number;
  updatedAt?: number;
};
