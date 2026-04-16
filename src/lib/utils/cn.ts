export function cn(...c: Array<string | undefined | null | false>) {
  return c.filter(Boolean).join(" ");
}