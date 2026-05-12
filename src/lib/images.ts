import type { ImageMetadata } from 'astro';

/**
 * Glob all local images from src/assets/media/ — loaded eagerly at build time
 * so Astro can process and optimise them (WebP conversion, compression, etc.).
 *
 * Keys look like: /src/assets/media/products/resorte-torsion.png
 */
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/media/**/*.{png,jpg,jpeg,webp,avif,gif}',
  { eager: true },
);

/**
 * Convert a content path ( /media/foo/bar.png ) to the corresponding
 * ImageMetadata object that Astro's <Image /> component needs.
 *
 * Returns null when the file has not been added yet — callers should
 * fall back to a plain <img> or <MediaPlaceholder> in that case.
 */
export function resolveImage(src: string): ImageMetadata | null {
  const key = src.replace(/^\/media\//, '/src/assets/media/');
  return imageModules[key]?.default ?? null;
}
