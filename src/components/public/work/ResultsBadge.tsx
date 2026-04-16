import { memo } from "react";

// eslint-disable-next-line react/display-name
export const ResultsBadge = memo(function ({ count }: { count: number }) {
  return <span aria-live="polite">{count} results</span>;
});
