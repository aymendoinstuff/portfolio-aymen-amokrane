export const unique = <T,>(arr: T[]) => Array.from(new Set(arr));
export const sortDesc = (arr: number[]) => [...arr].sort((a, b) => b - a);