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

export const SocialLinkSchema = z.object({
  platform: z.string().default("instagram"),
  href: z.string().default(""),
});

export const TestimonialSchema = z.object({
  text: z.string().default(""),
  author: z.string().default(""),
  role: z.string().default(""),
  company: z.string().default(""),
});

export const HomeSectionConfigSchema = z.object({
  id: z.enum([
    "hero",
    "featured_projects",
    "clients",
    "articles",
    "testimonials",
    "numbers",
  ]),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
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

// ── Contact / Let's Do Stuff ──────────────────────────────────────────────────

export const WishlistProjectSchema = z.object({
  id: z.string().default(""),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  brief: z.string().default(""),
  criteria: z.array(z.string()).default([]),
  fulfilled: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export const ServicePricingItemSchema = z.object({
  name: z.string().default(""),
  price: z.string().default(""),
});

export const ServiceSchema = z.object({
  id: z.string().default(""),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  description: z.string().default(""),
  pricing: z.array(ServicePricingItemSchema).default([]),
  bookingFields: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const ContactSectionConfigSchema = z.object({
  id: z.enum(["wishlist", "services", "inquiry"]),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const SettingsSchema = z.object({
  nav: z
    .object({
      brand: z.string().default("We Doing"),
      logoUrl: z.string().default(""),
      links: z.array(NavLinkSchema).default([]),
    })
    .default({ brand: "We Doing", logoUrl: "", links: [] }),

  home: z
    .object({
      heroHeadline: z.string().default(""),
      heroSubline: z.string().default(""),
      heroMainText: z.string().default(""),
      heroFontWeight: z.enum(["thin", "medium", "bold"]).catch("bold").default("bold"),
      heroRotateWords: z.array(z.string()).default([]),
      heroCta: CTASchema.default({ label: "", href: "" }),
      featuredTagline: z.string().default(""),
      featuredProjectId: z.string().default(""),
      featuredProjectIds: z.array(z.string()).default([]),
      carousel: z.array(HomeCarouselItemSchema).default([]),
      clients: z.array(ClientSchema).default([]),
      clientsLabel: z.string().default("Trusted by"),
      sections: z.array(HomeSectionConfigSchema).default([
        { id: "hero", visible: true, order: 0 },
        { id: "featured_projects", visible: true, order: 1 },
        { id: "clients", visible: false, order: 2 },
        { id: "articles", visible: true, order: 3 },
        { id: "testimonials", visible: true, order: 4 },
        { id: "numbers", visible: true, order: 5 },
      ]),
      testimonials: z.array(TestimonialSchema).default([]),
      numberStatIndices: z.array(z.number().int().min(0).max(11)).default([
        0, 1, 2, 3,
      ]),
    })
    .default({
      heroHeadline: "",
      heroSubline: "",
      heroMainText: "",
      heroFontWeight: "bold" as const,
      heroRotateWords: [],
      heroCta: { label: "", href: "" },
      featuredTagline: "",
      featuredProjectId: "",
      featuredProjectIds: [],
      carousel: [],
      clients: [],
      clientsLabel: "Trusted by",
      sections: [
        { id: "hero", visible: true, order: 0 },
        { id: "featured_projects", visible: true, order: 1 },
        { id: "clients", visible: false, order: 2 },
        { id: "articles", visible: true, order: 3 },
        { id: "testimonials", visible: true, order: 4 },
        { id: "numbers", visible: true, order: 5 },
      ],
      testimonials: [],
      numberStatIndices: [0, 1, 2, 3],
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
      heroCoverUrl: z.string().default(""),
      intro: z.string().default(""),
      experiences: z.array(ExperienceSchema).default([]),
      education: z.array(z.string()).default([]),
      skills: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      stats: z.array(StatSchema).default([]),
      sectionTitles: z.object({
        experience: z.string().default("Experience"),
        education:  z.string().default("Education"),
        skills:     z.string().default("Skills & Focus"),
        tools:      z.string().default("Tools"),
        numbers:    z.string().default("By the numbers"),
      }).default({ experience: "Experience", education: "Education", skills: "Skills & Focus", tools: "Tools", numbers: "By the numbers" }),
    })
    .default({
      personal: { name: "", role: "", location: "" },
      bio: "",
      heroAvatarUrl: "",
      heroCoverUrl: "",
      intro: "",
      experiences: [],
      education: [],
      skills: [],
      tools: [],
      stats: [],
      sectionTitles: { experience: "Experience", education: "Education", skills: "Skills & Focus", tools: "Tools", numbers: "By the numbers" },
    }),

  work: z
    .object({
      pageTitle: z.string().default(""),
      /** CHANGED: string[] -> { value: string }[] */
      categories: z.array(CategorySchema).default([]),
      main: z.array(WorkFeatureSchema).default([]),
      collaborations: z.array(CollaborationFeatureSchema).default([]),
    })
    .default({ pageTitle: "", categories: [], main: [], collaborations: [] }),

  blog: z
    .object({
      pageTitle:    z.string().default(""),
      pageSubtitle: z.string().default(""),
      postsPerPage: z.number().int().min(1).max(50).default(10),
      showDates: z.boolean().default(true),
      newsletterHref: z.string().default(""),
      categories: z.array(z.string()).default([]),
      featured: z.array(BlogFeatureSchema).default([]),
    })
    .default({
      pageTitle: "",
      pageSubtitle: "",
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
      socialLinks: z.array(SocialLinkSchema).default([]),
      copyright: z.string().default(""),
      // Contact info strip
      contactEmail:    z.string().default(""),
      contactPhone:    z.string().default(""),
      contactWhatsapp: z.string().default(""),
      contactLocation: z.string().default(""),
      showDubaiTime:   z.boolean().default(true),
    })
    .default({
      ctaHeadline: "",
      ctaSubtext: "",
      ctaButton: { label: "", href: "" },
      links: [],
      socialLinks: [],
      copyright: "",
      contactEmail: "",
      contactPhone: "",
      contactWhatsapp: "",
      contactLocation: "",
      showDubaiTime: true,
    }),

  comingSoon: z.boolean().default(false),

  contact: z
    .object({
      pageTitle: z.string().default(""),
      sections: z.array(ContactSectionConfigSchema).default([
        { id: "wishlist", visible: true, order: 0 },
        { id: "services", visible: true, order: 1 },
        { id: "inquiry", visible: true, order: 2 },
      ]),
      wishlistTitle: z.string().default("2026 Wishlist"),
      wishlistSubtitle: z.string().default(""),
      wishlistLocked: z.boolean().default(false),
      wishlistProjects: z.array(WishlistProjectSchema).default([]),
      servicesTitle: z.string().default("My Services"),
      services: z.array(ServiceSchema).default([]),
      inquiryTitle: z.string().default("General Inquiry"),
    })
    .default({
      pageTitle: "",
      sections: [
        { id: "wishlist", visible: true, order: 0 },
        { id: "services", visible: true, order: 1 },
        { id: "inquiry", visible: true, order: 2 },
      ],
      wishlistTitle: "2026 Wishlist",
      wishlistSubtitle: "",
      wishlistLocked: false,
      wishlistProjects: [],
      servicesTitle: "My Services",
      services: [],
      inquiryTitle: "General Inquiry",
    }),
});

export type SiteSettings = z.infer<typeof SettingsSchema>;
