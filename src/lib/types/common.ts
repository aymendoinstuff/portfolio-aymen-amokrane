export type MediaItem = {
  type: "image" | "video";
  url: string;
  alt?: string;
  // one of these is enough
  dimensions?: { w: number; h: number }; // e.g. { w: 700, h: 700 }
  aspect?: "square" | "wide";             // override/infer fallback
  span2?: boolean;                        // square that should take the whole row
};