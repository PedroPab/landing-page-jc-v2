import { getEntry, getCollection } from 'astro:content';

/**
 * Load all singleton content needed for the home page in parallel.
 * Call once in index.astro to avoid multiple sequential getEntry calls.
 */
export async function getHomePageData() {
  const [settingsEntry, homeEntry, contactEntry] = await Promise.all([
    getEntry('siteSettings', 'default'),
    getEntry('homePages', 'default'),
    getEntry('contactSections', 'default'),
  ]);

  if (!settingsEntry) throw new Error('settings.json is missing or has no entry with id "default"');
  if (!homeEntry) throw new Error('home.json is missing or has no entry with id "default"');
  if (!contactEntry) throw new Error('contact.json is missing or has no entry with id "default"');

  return {
    settings: settingsEntry.data,
    home: homeEntry.data,
    contact: contactEntry.data,
  };
}

/**
 * Get the history story entry from the stories collection.
 * Returns the first .md file found (expected: history.md).
 */
export async function getHistoryStory() {
  const allStories = await getCollection('stories');
  const history = allStories.find((s) => s.id.includes('history'));
  if (!history) throw new Error('history.md not found in src/content/stories/');
  return history;
}

/**
 * Get the featured case study for the landing page.
 * Falls back to the first entry if none is marked as featured.
 */
export async function getFeaturedCaseStudy() {
  const cases = await getCollection('caseStudies');
  if (cases.length === 0) throw new Error('No case studies found in src/content/case-studies/');
  return cases.find((c) => c.data.featured) ?? cases[0];
}

/**
 * Build a WhatsApp deep link URL.
 * @param number - International number without +, e.g. "573001234567"
 * @param message - Pre-filled message text (will be URL-encoded)
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
