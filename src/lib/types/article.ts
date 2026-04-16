import { MediaItem } from "./common";

export type ArticleDoc = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl?: string;
  media?: MediaItem[];
  published: boolean;
  createdAt?: number;
  updatedAt?: number;
};
