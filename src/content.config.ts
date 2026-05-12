import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ── Shared Media Schemas ─────────────────────────────────────────
// Reusable across any collection. All media fields are optional so
// sections degrade gracefully when no assets are provided yet.

const mediaItemSchema = z.object({
  type: z.enum(['image', 'video', 'gif']),
  src: z.string(),                   // path relative to /public or /src/assets
  alt: z.string(),
  poster: z.string().optional(),     // poster frame for video/gif
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  priority: z.boolean().default(false), // true = eager load (LCP images)
});

const gallerySchema = z.object({
  type: z.literal('gallery'),
  items: z.array(mediaItemSchema).min(1).max(6),
  layout: z.enum(['strip', 'grid', 'featured']).default('strip'),
});

// A section can have a single media item OR a gallery
const sectionMediaSchema = z.union([mediaItemSchema, gallerySchema]).optional();

// ── Site Settings (singleton JSON array) ────────────────────────
const siteSettings = defineCollection({
  loader: file('src/content/site/settings.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    legalName: z.string().optional(),
    nit: z.string().optional(),
    tagline: z.string(),
    reviewUrl: z.string().optional(),
    whatsapp: z.object({
      number: z.string(),
      defaultMessage: z.string(),
    }),
    address: z.object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
      mapsUrl: z.string(),
      postalCode: z.string().optional(),
      region: z.string().optional(),
    }),
    phone: z.string().optional(),
    email: z.string().optional(),
    geo: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    businessHours: z.array(z.object({
      days: z.string(),
      opens: z.string(),
      closes: z.string(),
    })).optional(),
    seo: z.object({
      siteUrl: z.string(),
      defaultTitle: z.string(),
      defaultDescription: z.string(),
      defaultImage: z.string(),
      locale: z.string().default('es_CO'),
      keywords: z.array(z.string()).optional(),
      twitterSite: z.string().optional(),
    }),
    nav: z.array(z.object({
      label: z.string(),
      href: z.string(),
      children: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })).optional(),
    })),
    navSitemap: z.array(z.object({
      category: z.string(),
      items: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })),
    })).optional(),
    sections: z.object({
      trustStrip: z.boolean().default(true),
      about: z.boolean().default(true),
      history: z.boolean().default(true),
      services: z.boolean().default(true),
      products: z.boolean().default(true),
      differentials: z.boolean().default(true),
      industries: z.boolean().default(true),
      clients: z.boolean().default(true),
      caseStudy: z.boolean().default(true),
      workshop: z.boolean().default(true),
      workValues: z.boolean().default(true),
    }),
  }),
});

// ── Home Page Content (singleton JSON array) ─────────────────────
const homePages = defineCollection({
  loader: file('src/content/pages/home.json'),
  schema: z.object({
    id: z.string(),

    hero: z.object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
      supportingText: z.string().optional(),
      badges: z.array(z.string()),
      primaryCta: z.object({ label: z.string(), href: z.string() }),
      secondaryCta: z.object({ label: z.string(), href: z.string() }),
      // Hero visual: image, video or gif shown on the right column (desktop)
      media: sectionMediaSchema,
    }),

    trustStrip: z.object({
      items: z.array(z.object({
        value: z.string(),
        label: z.string(),
        detail: z.string().optional(),
      })),
    }),

    about: z.object({
      title: z.string(),
      paragraphs: z.array(z.string()).min(1).max(5),
      // Team / family photo shown alongside the text
      media: sectionMediaSchema,
    }),

    services: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        // Per-service image (optional: shown inside card)
        image: mediaItemSchema.optional(),
      })),
      closing: z.string().optional(),
    }),

    differentials: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      })),
    }),

    industries: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      items: z.array(z.object({
        name: z.string(),
        // Optional icon image per industry
        image: mediaItemSchema.optional(),
      })),
      closing: z.string().optional(),
    }),

    workshop: z.object({
      title: z.string(),
      blocks: z.array(z.object({
        heading: z.string(),
        body: z.string(),
      })),
      // Gallery of workshop photos / machinery / tools
      media: sectionMediaSchema,
    }),

    workValues: z.object({
      culture: z.object({
        title: z.string(),
        body: z.string(),
        items: z.array(z.string()).optional(),
        // Team / people photo
        media: sectionMediaSchema,
      }),
      safety: z.object({
        title: z.string(),
        body: z.string(),
      }),
    }),
  }),
});

// ── Contact Section (singleton JSON array) ────────────────────────
const contactSections = defineCollection({
  loader: file('src/content/sections/contact.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    microcopy: z.string().optional(),
    whatsappLabel: z.string(),
    mapsLabel: z.string(),
    // Optional background for CTA section
    backgroundMedia: mediaItemSchema.optional(),
  }),
});

// ── Editorial Stories (Markdown) ──────────────────────────────────
const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/stories' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    sectionTitle: z.string(),
    publishedAt: z.coerce.date(),
    // Optional documentary photo alongside history text
    media: sectionMediaSchema,
  }),
});

// ── Case Studies (MDX) ────────────────────────────────────────────
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    summary: z.string(),
    challenge: z.string(),
    result: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    // Hero image for the case study
    image: mediaItemSchema.optional(),
    // Gallery of process / result photos
    gallery: gallerySchema.optional(),
  }),
});

// ── Product Catalog (singleton JSON array) ────────────────────────
const productPages = defineCollection({
  loader: file('src/content/pages/products.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      applications: z.array(z.string()),
      materials: z.array(z.string()),
      finishes: z.array(z.string()).optional(),
      notes: z.string().optional(),
      image: mediaItemSchema.optional(),
      // Support photos shown in the product detail page gallery
      photos: z.array(mediaItemSchema).max(8).optional(),
    })),
  }),
});

// ── Client Highlights (singleton JSON array) ──────────────────────
const clientPages = defineCollection({
  loader: file('src/content/pages/clients.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      sector: z.string(),
      description: z.string().optional(),
      logo: mediaItemSchema.optional().nullable(),
    })),
  }),
});

export const collections = {
  siteSettings,
  homePages,
  contactSections,
  stories,
  caseStudies,
  productPages,
  clientPages,
};
