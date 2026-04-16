import { z } from "zod";

export const NavLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Href is required"),
});

export const CTASchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});

export const ExperienceSchema = z.object({
  role: z.string().default(""),
  company: z.string().default(""),
  period: z.string().default(""),
  desc: z.string().default(""),
});

export const StatSchema = z.object({
  v: z.number().default(0),
  suffix: z.string().default(""),
  k: z.string().default(""),
  sub: z.string().default(""),
});

export const HomeCarouselItemSchema = z.object({
  projectId: z.string().default(""),
  tagline: z.string().default(""),
});

export const ClientSchema = z.object({
  name: z.string().default(""),
  href: z.string().default(""),
  logoHref: z.string().default(""),
});

export const WorkFeatureSchema = z.object({
  projectId: z.string().default(""),
});

export const CollaborationFeatureSchema = z.object({
  collaborationId: z.string().default(""),
});

export const BlogFeatureSchema = z.object({
  postId: z.string().default(""),
});

/** NEW: categories are array of objects so useFieldArray can type them */
export const CategorySchema = z.object({
  value: z.string().default(""),
});

export const SettingsSchema = z.object({
  nav: z
    .object({
      brand: z.string().default("We Doing"),
      links: z.array(NavLinkSchema).default([]),
    })
    .default({ brand: "We Doing", links: [] }),

  home: z
    .object({
      heroHeadline: z.string().default(""),
      heroSubline: z.string().default(""),
      heroCta: CTASchema.default({ label: "", href: "" }),
      featuredTagline: z.string().default(""),
      featuredProjectId: z.string().default(""),
      carousel: z.array(HomeCarouselItemSchema).default([]),
      clients: z.array(ClientSchema).default([]),
    })
    .default({
      heroHeadline: "",
      heroSubline: "",
      heroCta: { label: "", href: "" },
      featuredTagline: "",
      featuredProjectId: "",
      carousel: [],
      clients: [],
    }),

  about: z
    .object({
      personal: z
        .object({
          name: z.string().default(""),
          role: z.string().default(""),
          location: z.string().default(""),
        })
        .default({ name: "", role: "", location: "" }),
      bio: z.string().default(""),
      heroAvatarUrl: z.string().default(""),
      intro: z.string().default(""),
      experiences: z.array(ExperienceSchema).default([]),
      education: z.array(z.string()).default([]),
      skills: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      stats: z.array(StatSchema).default([]),
    })
    .default({
      personal: { name: "", role: "", location: "" },
      bio: "",
      heroAvatarUrl: "",
      intro: "",
      experiences: [],
      education: [],
      skills: [],
      tools: [],
      stats: [],
    }),

  work: z
    .object({
      /** CHANGED: string[] -> { value: string }[] */
      categories: z.array(CategorySchema).default([]),
      main: z.array(WorkFeatureSchema).default([]),
      collaborations: z.array(CollaborationFeatureSchema).default([]),
    })
    .default({ categories: [], main: [], collaborations: [] }),

  blog: z
    .object({
      postsPerPage: z.number().int().min(1).max(50).default(10),
      showDates: z.boolean().default(true),
      newsletterHref: z.string().default(""),
      categories: z.array(z.string()).default([]),
      featured: z.array(BlogFeatureSchema).default([]),
    })
    .default({
      postsPerPage: 10,
      showDates: true,
      newsletterHref: "",
      categories: [],
      featured: [],
    }),

  footer: z
    .object({
      ctaHeadline: z.string().default(""),
      ctaSubtext: z.string().default(""),
      ctaButton: CTASchema.default({ label: "", href: "" }),
      links: z.array(NavLinkSchema).default([]),
      copyright: z.string().default(""),
    })
    .default({
      ctaHeadline: "",
      ctaSubtext: "",
      ctaButton: { label: "", href: "" },
      links: [],
      copyright: "",
    }),
});

export type SiteSettings = z.infer<typeof SettingsSchema>;
