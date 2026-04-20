export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\- ]+/g, "")
    .replace(/\s+/g, "-");
}
