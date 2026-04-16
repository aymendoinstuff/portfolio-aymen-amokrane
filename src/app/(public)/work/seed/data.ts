// lib/data/projects.ts
import type { Project } from "@/lib/types/project";

export const projects: Project[] = [
  {
    general: {
      id: "weewee-1",
      title: "WeeWee – Branding Case Study",
      slug: "weewee-branding",
      year: 2023,
      industry: "Logistics / Delivery",
      tags: ["Branding", "Strategy", "Visual Identity"],
      heroUrl: "/images/projects/weewee/hero.jpg",
      quotes: [
        "Make it simple, make it scale.",
        "Systems that look good and behave well.",
      ],
      published: true,
      createdAt: new Date(2023, 2, 22).getTime(),
      updatedAt: new Date(2023, 5, 1).getTime(),
    },

    main: {
      brief:
        "Repositioning WeeWee with a bold visual system: custom logotype, mascot, modular shapes, and clear usage rules applied across packaging, app, fleet, and social.",
      gallery: [
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 1.jpg",
          alt: "WeeWee branding overview — logotype, mascot, and color system",
          dimensions: { w: 1400, h: 700 }, // wide → spans 2 cols
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 2.jpg",
          alt: "WeeWee modular shape system and brand elements",
          dimensions: { w: 700, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 3.jpg",
          alt: "WeeWee mascot construction and usage examples",
          dimensions: { w: 700, h: 700 }, // square → pairs in 2-up
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 4.jpg",
          alt: "Logo grid and safe area specification",
          dimensions: { w: 700, h: 700 }, // square
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 5.jpg",
          alt: "Primary color palette and contrast rules",
          dimensions: { w: 1400, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 6.jpg",
          alt: "Typography system: headings, body, and UI styles",
          dimensions: { w: 1400, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 7.jpg",
          alt: "Packaging applications with logotype and mascot",
          dimensions: { w: 1400, h: 700 }, // square (paired)
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 8.jpg",
          alt: "Delivery fleet livery mockups",
          dimensions: { w: 700, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 9.jpg",
          alt: "Mobile app UI with brand system applied",
          dimensions: { w: 1400, h: 700 }, // square
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 10.jpg",
          alt: "Social media templates and content examples",
          dimensions: { w: 1400, h: 700 }, // square
        },
        {
          type: "image",
          url: "/images/projects/weewee/Artboard 11.jpg",
          alt: "Iconography set and usage guidance",
          dimensions: { w: 1400, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/weewee/Brand Archtype.jpg",
          alt: "Brand archetype slide for WeeWee",
          dimensions: { w: 2800, h: 1400 }, // square
          span2: true, // ✅ feature this square across both columns
        },
        {
          type: "image",
          url: "/images/projects/weewee/Brand Attributes.jpg",
          alt: "Brand attributes: playful, fast, dependable",
          dimensions: { w: 2400, h: 1200 }, // square
        },
        {
          type: "image",
          url: "/images/projects/weewee/Brand Tone.jpg",
          alt: "Brand tone of voice guidelines",
          dimensions: { w: 2800, h: 1400 }, // square
        },
        {
          type: "image",
          url: "/images/projects/weewee/Brand Voice.jpg",
          alt: "Brand voice examples and do/don’t",
          dimensions: { w: 2800, h: 1400 }, // square
        },
      ],
      details: {
        client: "WeeWee",
        sector: "Logistics / Delivery",
        discipline: ["Branding", "Strategy", "Visual Identity"],
        tagline: "Playful, scalable identity for a next-gen delivery brand.",
        summary:
          "End-to-end brand system: strategy, identity, mascot, typography, color, and guidelines—rolled out to packaging, vehicles, app UI, and social templates.",
        team: [
          { name: "Aymen", role: "Creative Direction" },
          { name: "Designer", role: "Identity & Systems" },
          { name: "Strategist", role: "Brand Strategy" },
        ],
        services: [
          "Brand Strategy",
          "Logo",
          "Mascot",
          "Guidelines",
          "Art Direction",
        ],
        deliverables: [
          "Brandbook",
          "Logo suite",
          "Color & type system",
          "Social kit",
        ],
        links: {
          behance:
            "https://www.behance.net/gallery/221756111/WeeWee-branding-case-study",
        },
      },
    },

    extra: {
      blocks: [
        { id: "h1", type: "heading", level: 1, text: "Project Story" },
        {
          id: "p1",
          type: "paragraph",
          text: "WeeWee needed a recognizable identity that could scale across packaging, vehicles, and a mobile app. We built a modular system with a custom logotype, mascot, and flexible shape language to keep the brand playful and unmistakable.",
        },
        // {
        //   id: "grid1",
        //   type: "grid",
        //   items: [
        //     {
        //       type: "image",
        //       url: "/images/projects/weewee/Brand Archtype.jpg",
        //       alt: "Brand archetype: playful helper",
        //     },
        //     {
        //       type: "image",
        //       url: "/images/projects/weewee/Brand Attributes.jpg",
        //       alt: "Attributes: playful, fast, dependable",
        //     },
        //     {
        //       type: "image",
        //       url: "/images/projects/weewee/Brand Tone.jpg",
        //       alt: "Tone: friendly, clear, energetic",
        //     },
        //     {
        //       type: "image",
        //       url: "/images/projects/weewee/Brand Voice.jpg",
        //       alt: "Voice: simple, helpful, confident",
        //     },
        //   ],
        //   columns: 2,
        //   caption:
        //     "Strategy foundations shaping tone, archetype, and attributes.",
        // },
        {
          id: "h2",
          type: "heading",
          level: 2,
          text: "System Highlights",
        },
        {
          id: "list1",
          type: "list",
          ordered: false,
          items: [
            "Custom logotype with clear spacing and grid",
            "Mascot with simple geometry for broad use",
            "Color system optimized for contrast and accessibility",
            "Typographic scale aligned to product UI and marketing",
          ],
        },
      ],
    },
  },
  {
    general: {
      id: "neurogrid-1",
      title: "NeuroGrid – Adaptive AI Identity",
      slug: "neurogrid-ai",
      year: 2026,
      industry: "AI / Cloud Infrastructure",
      tags: ["Branding", "Systems", "Digital"],
      heroUrl: "/images/projects/neurogrid/hero.jpg",
      quotes: [
        "Design that adapts as fast as AI.",
        "Identity systems that learn.",
      ],
      published: true,
      createdAt: new Date(2026, 4, 15).getTime(),
      updatedAt: new Date(2026, 6, 1).getTime(),
    },

    main: {
      brief:
        "NeuroGrid’s identity evolves with its machine-learning core. The visual system mirrors neural pathways, scaling across UIs, AR, and data centers.",
      gallery: [
        {
          type: "image",
          url: "/images/projects/neurogrid/01.jpg",
          alt: "NeuroGrid — logo",
          dimensions: { w: 1400, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/neurogrid/02.jpg",
          alt: "NeuroGrid — system",
          dimensions: { w: 700, h: 700 }, // square (paired)
        },
        {
          type: "image",
          url: "/images/projects/neurogrid/03.jpg",
          alt: "NeuroGrid — dashboard",
          dimensions: { w: 700, h: 700 }, // square (paired)
        },
      ],
      details: {
        client: "NeuroGrid",
        sector: "AI / Cloud",
        discipline: ["Branding", "Motion", "UI Systems"],
        tagline: "A living identity for an adaptive AI cloud platform.",
        summary:
          "Generative visual grammar that scales across AR, web, and autonomous systems with motion rules.",
        team: [
          { name: "Aymen", role: "Creative Direction" },
          { name: "Lina", role: "Generative Designer" },
          { name: "Kai", role: "Tech Strategist" },
        ],
      },
    },

    extra: {
      blocks: [
        { id: "ng-h1", type: "heading", level: 1, text: "Project Story" },
        {
          id: "ng-p1",
          type: "paragraph",
          text: "We built a living system inspired by neural lattices. The identity flexes through motion, parameterized patterns, and UI states without losing recognition.",
        },
        {
          id: "ng-grid1",
          type: "grid",
          items: [
            {
              type: "image",
              url: "/images/projects/neurogrid/01.jpg",
              alt: "NeuroGrid — logo",
            },
            {
              type: "image",
              url: "/images/projects/neurogrid/02.jpg",
              alt: "NeuroGrid — system",
            },
            {
              type: "image",
              url: "/images/projects/neurogrid/03.jpg",
              alt: "NeuroGrid — dashboard",
            },
          ],
          columns: 3,
          caption: "Core marks, generative system, and product UI.",
        },
        {
          id: "ng-h2",
          type: "heading",
          level: 2,
          text: "Principles",
        },
        {
          id: "ng-list1",
          type: "list",
          items: [
            "Parametric motion defines behavior, not just looks",
            "Grid-based neural topology informs patterns",
            "Accessible contrast and motion safety guidelines",
          ],
        },
      ],
    },
  },
  {
    general: {
      id: "aetherfoods-1",
      title: "AetherFoods – Future of Nutrition",
      slug: "aetherfoods-branding",
      year: 2025,
      industry: "Biotech / Food",
      tags: ["Identity", "Packaging", "Sustainability"],
      heroUrl: "/images/projects/aetherfoods/hero.jpg",
      quotes: ["Food that feeds the planet.", "Sustainability is identity."],
      published: true,
      createdAt: new Date(2025, 7, 10).getTime(),
      updatedAt: new Date(2025, 8, 5).getTime(),
    },

    main: {
      brief:
        "AetherFoods pioneers sustainable, lab-grown meals. Branding reflects purity, science, and care through molecular visuals.",
      gallery: [
        {
          type: "image",
          url: "/images/projects/aetherfoods/01.jpg",
          alt: "AetherFoods — packaging",
          dimensions: { w: 1400, h: 700 }, // wide
        },
        {
          type: "image",
          url: "/images/projects/aetherfoods/02.jpg",
          alt: "AetherFoods — pattern",
          dimensions: { w: 700, h: 700 }, // square (paired)
          // span2: true, // uncomment if you want this square to fill a full row
        },
        {
          type: "image",
          url: "/images/projects/aetherfoods/03.jpg",
          alt: "AetherFoods — retail",
          dimensions: { w: 700, h: 700 }, // square (paired)
        },
      ],
      details: {
        client: "AetherFoods",
        sector: "Biotech / Food",
        discipline: ["Identity", "Packaging", "Sustainability"],
        tagline: "Clean, futuristic branding for lab-grown nutrition.",
        summary:
          "Identity, packaging, brand guidelines, and launch assets with sustainability KPIs.",
        team: [
          { name: "Aymen", role: "Creative Direction" },
          { name: "Sofia", role: "Packaging Designer" },
          { name: "Milo", role: "Sustainability Consultant" },
        ],
      },
    },

    extra: {
      blocks: [
        { id: "af-h1", type: "heading", level: 1, text: "Project Story" },
        {
          id: "af-p1",
          type: "paragraph",
          text: "We expressed lab-grown nutrition through a clean molecular language: calm neutrals, precise geometry, and honest product photography.",
        },
        {
          id: "af-grid1",
          type: "grid",
          items: [
            {
              type: "image",
              url: "/images/projects/aetherfoods/01.jpg",
              alt: "AetherFoods — packaging",
            },
            {
              type: "image",
              url: "/images/projects/aetherfoods/02.jpg",
              alt: "AetherFoods — pattern",
            },
            {
              type: "image",
              url: "/images/projects/aetherfoods/03.jpg",
              alt: "AetherFoods — retail",
            },
          ],
          columns: 3,
          caption: "Packaging system, molecular patterns, and retail presence.",
        },
        {
          id: "af-h2",
          type: "heading",
          level: 2,
          text: "Outcomes",
        },
        {
          id: "af-list1",
          type: "list",
          items: [
            "Consistent packaging architecture across SKUs",
            "Sustainability messaging integrated into visuals",
            "Launch toolkit for retail and digital channels",
          ],
        },
      ],
    },
  },
];
