export type Crumb = { label: string; href?: string };

export type Stat = {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
};

export type StatGridColumns = 2 | 3 | 4 | 5 | 6;
