import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ── Site Settings (singleton JSON array) ────────────────────────
// To toggle sections, change booleans in src/content/site/settings.json
const siteSettings = defineCollection({
  loader: file('src/content/site/settings.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    tagline: z.string(),
    whatsapp: z.object({
      number: z.string(),
      defaultMessage: z.string(),
    }),
    address: z.object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
      mapsUrl: z.string(),
    }),
    seo: z.object({
      siteUrl: z.string(),
      defaultTitle: z.string(),
      defaultDescription: z.string(),
      defaultImage: z.string(),
      locale: z.string().default('es_CO'),
    }),
    nav: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })),
    sections: z.object({
      trustStrip:    z.boolean().default(true),
      about:         z.boolean().default(true),
      history:       z.boolean().default(true),
      services:      z.boolean().default(true),
      differentials: z.boolean().default(true),
      industries:    z.boolean().default(true),
      caseStudy:     z.boolean().default(true),
      workshop:      z.boolean().default(true),
      workValues:    z.boolean().default(true),
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
    }),
    services: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
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
      })),
      closing: z.string().optional(),
    }),
    workshop: z.object({
      title: z.string(),
      blocks: z.array(z.object({
        heading: z.string(),
        body: z.string(),
      })),
    }),
    workValues: z.object({
      culture: z.object({
        title: z.string(),
        body: z.string(),
        items: z.array(z.string()).optional(),
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
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = {
  siteSettings,
  homePages,
  contactSections,
  stories,
  caseStudies,
};
