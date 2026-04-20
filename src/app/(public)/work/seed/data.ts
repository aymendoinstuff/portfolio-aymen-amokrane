// lib/data/projects.ts
import type { Project } from "@/lib/types/project";

export const projects: Project[] = [
  {
    general: {
      id: "weewee-1",
      title: "WeeWee – Branding Case Study",
      slug: "weewee-branding",
      year: 2023,
      tags: ["Branding", "Strategy", "Visual Identity"],
      heroUrl: "/images/projects/weewee/hero.jpg",
      published: true,
      createdAt: new Date(2023, 2, 22).getTime(),
      updatedAt: new Date(2023, 5, 1).getTime(),
    },
    main: {
      details: {
        tagline: "Custom visual system for a delivery logistics brand",
        summary: "Repositioning WeeWee with a bold visual system: custom logotype, mascot, modular shapes, and clear usage rules applied across packaging, app, fleet, and social.",
      },
    },
    notes: {
      client: "WeeWee",
      industry: "Logistics & Supply Chain",
      services: ["Brand Strategy", "Visual Identity Design", "Brand Guidelines"],
      brief: "WeeWee needed a refresh from a generic delivery app to a memorable, scalable brand that stands out in a crowded market.",
      region: "Global",
      year: 2023,
      deliverables: "Logotype, mascot system, color palette, typography, iconography, brand guidelines, packaging mockups, app UI kit",
    },
    extra: {
      blocks: [
        {
          type: "media",
          layout: "full",
          items: [
            {
              url: "/images/projects/weewee/Artboard 1.jpg",
              mediaType: "image",
              caption: "Brand identity system overview",
            },
          ],
        },
        {
          type: "text",
          content: "Visual System",
          align: "left",
        },
        {
          type: "media",
          layout: "2col",
          items: [
            {
              url: "/images/projects/weewee/Artboard 2.jpg",
              mediaType: "image",
              caption: "Modular shapes",
            },
            {
              url: "/images/projects/weewee/Artboard 3.jpg",
              mediaType: "image",
              caption: "Mascot construction",
            },
          ],
        },
        {
          type: "media",
          layout: "3col",
          items: [
            {
              url: "/images/projects/weewee/Artboard 5.jpg",
              mediaType: "image",
              caption: "Color palette",
            },
            {
              url: "/images/projects/weewee/Artboard 6.jpg",
              mediaType: "image",
              caption: "Typography",
            },
            {
              url: "/images/projects/weewee/Artboard 7.jpg",
              mediaType: "image",
              caption: "Applications",
            },
          ],
        },
      ],
    },
  },
  {
    general: {
      id: "nectar-1",
      title: "Nectar – Food & Beverage Rebrand",
      slug: "nectar-rebrand",
      year: 2024,
      tags: ["Branding", "Packaging", "Digital"],
      heroUrl: "/images/projects/nectar/hero.jpg",
      published: true,
      createdAt: new Date(2024, 0, 15).getTime(),
      updatedAt: new Date(2024, 2, 30).getTime(),
    },
    main: {
      details: {
        tagline: "Premium juice brand repositioned for modern consumers",
        summary: "Complete rebrand including logotype, packaging design, and digital presence for a natural beverage company entering new markets.",
      },
    },
    notes: {
      client: "Nectar Beverages",
      industry: "Food & Beverage",
      services: ["Branding", "Packaging Design", "Label Design"],
      brief: "Nectar needed to modernize its identity to appeal to health-conscious millennials while maintaining premium positioning.",
      region: "Europe",
      year: 2024,
      deliverables: "Logotype, label design, packaging mockups, color system, photography direction, social media templates",
    },
    extra: {
      blocks: [
        {
          type: "media",
          layout: "full",
          items: [
            {
              url: "/images/projects/nectar/hero.jpg",
              mediaType: "image",
              caption: "Packaging design showcase",
            },
          ],
        },
        {
          type: "text",
          content: "Design Direction",
          align: "center",
        },
      ],
    },
  },
];
