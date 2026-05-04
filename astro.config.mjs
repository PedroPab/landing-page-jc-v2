import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://jcresortes.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  compressHTML: true,

  integrations: [
    mdx(),
    sitemap({
      // Prioridades comerciales: productos y contacto primero
      serialize(item) {
        const url = item.url;

        // Inicio — máxima prioridad, actualización frecuente
        if (url === `${SITE}/` || url === SITE) {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        // Catálogo raíz — muy importante para búsquedas de producto
        if (url === `${SITE}/catalogo/`) {
          return { ...item, changefreq: 'weekly', priority: 0.95 };
        }
        // Fichas de producto individuales — alta intención comercial
        if (url.startsWith(`${SITE}/catalogo/`)) {
          return { ...item, changefreq: 'weekly', priority: 0.92 };
        }
        // Contacto — página de conversión
        if (url.startsWith(`${SITE}/contacto`)) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        // Configurador 3D — herramienta de captación
        if (url.startsWith(`${SITE}/configurar`)) {
          return { ...item, changefreq: 'monthly', priority: 0.85 };
        }
        // Qué hacemos y servicios
        if (url.startsWith(`${SITE}/que-hacemos`)) {
          return { ...item, changefreq: 'monthly', priority: 0.82 };
        }
        // Industrias — SEO de sector
        if (url.startsWith(`${SITE}/industrias`)) {
          return { ...item, changefreq: 'monthly', priority: 0.80 };
        }
        // Casos destacados (listing)
        if (url === `${SITE}/caso/`) {
          return { ...item, changefreq: 'monthly', priority: 0.75 };
        }
        // Casos individuales
        if (url.startsWith(`${SITE}/caso/`)) {
          return { ...item, changefreq: 'monthly', priority: 0.70 };
        }
        // Nosotros — credibilidad y trust
        if (url.startsWith(`${SITE}/nosotros`)) {
          return { ...item, changefreq: 'yearly', priority: 0.65 };
        }

        // Default
        return { ...item, changefreq: 'monthly', priority: 0.6 };
      },
    }),
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
