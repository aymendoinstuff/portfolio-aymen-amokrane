export type NavLink = { label: string; href: string };
export type SiteSettings = {
  personal: { name: string; role: string; location?: string };
  nav?: { brand?: string; links?: NavLink[] };
  home?: {
    heroHeadline?: string;
    heroSubline?: string;
    heroCta?: { label: string; href: string };
    featuredTagline?: string;
    clients?: string[];
  };
  about?: { bio?: string };
  footer?: {
    ctaHeadline?: string;
    ctaSubtext?: string;
    ctaButton?: { label: string; href: string };
    links?: NavLink[];
    copyright?: string;
  };
  featuredProjectId?: string;
  categories?: string[];
};
export const DEFAULT_SETTINGS: SiteSettings = {
  personal: {
    name: "Aymen Doin Stuff",
    role: "Senior Brand Designer",
    location: "Dubai",
  },
  nav: {
    brand: "We Doing",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Blog", href: "/blog" },
    ],
  },
  home: {
    heroHeadline: "WE DOING",
    heroSubline: "Senior Brand Designer",
    heroCta: { label: "AVAILABLE FOR WORK", href: "/contact" },
    featuredTagline: "Short tagline about the project",
    clients: [
      "Amazon",
      "Microsoft",
      "Nike",
      "Adobe",
      "Uber",
      "Airbnb",
      "Coca-Cola",
      "Spotify",
      "Nestle",
      "Visa",
      "Samsung",
      "Ikea",
    ],
  },
  about: { bio: "Designer focused on strategy-led brand systems." },
  footer: {
    ctaHeadline: "You have a project?",
    ctaSubtext: "Let's build something sharp.",
    ctaButton: { label: "Let's do stuff", href: "/contact" },
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Blog", href: "/blog" },
    ],
    copyright: "© {year} Aymen Studio",
  },
  categories: ["Branding", "Strategy", "Illustration", "Systems", "Logos"],
};
