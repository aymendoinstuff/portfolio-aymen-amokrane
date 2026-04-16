// Proposed Projects (formerly PRIORITY)
export const PROPOSED_PROJECTS = [
  { key: "cafe", label: "Café Brand Kit" },
  { key: "esports", label: "Esports Team Identity" },
  { key: "fintech", label: "Fintech App Branding" },
  { key: "event", label: "Event Visual System" },
  { key: "logistics", label: "Logistics Rebrand" },
] as const;

export type ProposedProjectKey = (typeof PROPOSED_PROJECTS)[number]["key"];

// Per-project requirement presets (formerly REQUIREMENTS)
export const PROJECT_REQUIREMENTS: Record<
  ProposedProjectKey,
  {
    timeline: string;
    budget: string;
    country: string;
    scope: string;
    industryDefault?: string;
    projectTypeDefault?: string;
  }
> = {
  cafe: {
    timeline: "4-6 weeks",
    budget: "5k-8k",
    country: "UAE",
    scope: "Menu, packaging, storefront",
    industryDefault: "F&B",
    projectTypeDefault: "Branding",
  },
  esports: {
    timeline: "6-8 weeks",
    budget: "8k-12k",
    country: "US",
    scope: "Logo, jersey, stream kit",
    industryDefault: "Gaming",
    projectTypeDefault: "Systems",
  },
  fintech: {
    timeline: "8-12 weeks",
    budget: "12k-20k",
    country: "UK",
    scope: "App UI kit, logo, website",
    industryDefault: "Fintech",
    projectTypeDefault: "Strategy",
  },
  event: {
    timeline: "6-8 weeks",
    budget: "8k-12k",
    country: "UAE",
    scope: "Key visual, signage, passes",
    industryDefault: "Events",
    projectTypeDefault: "Illustration",
  },
  logistics: {
    timeline: "8-12 weeks",
    budget: "12k-20k",
    country: "DE",
    scope: "Fleet livery, guidelines",
    industryDefault: "Logistics",
    projectTypeDefault: "Systems",
  },
};

// Tags/keywords (formerly KEYWORDS)
export const PROJECT_TAGS: Record<ProposedProjectKey, string[]> = {
  cafe: ["brand kit", "menu", "packaging"],
  esports: ["identity", "kit", "motion"],
  fintech: ["ui", "branding", "web"],
  event: ["visual system", "signage", "print"],
  logistics: ["rebrand", "livery", "guidelines"],
};

// Static categories for "new project" form
export const PROJECT_CATEGORIES = [
  "Branding",
  "Strategy",
  "Illustration",
  "Systems",
  "Logos",
] as const;

// ---------- Backward-compat exports (keep your old imports working) ----------
export const PRIORITY = PROPOSED_PROJECTS;
export const REQUIREMENTS = PROJECT_REQUIREMENTS;
export const KEYWORDS = PROJECT_TAGS;
export type PriorityKey = ProposedProjectKey;
