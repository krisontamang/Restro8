import type { MenuItem } from '../../types/restaurant';

// Replace only the original sample photography; restaurant uploads remain intact.
const generatedImages: Record<string, string> = {
  // Momo Junction
  'momo-1': '/images/menu/steamed-momo.png',
  'momo-2': '/images/menu/chilli-momo.png',
  'momo-3': '/images/menu/jhol-momo.png',
  'momo-4': '/images/menu/kothey-chicken-momo.jpg',
  'momo-5': '/images/menu/paneer-spinach-momo.jpg',

  // Thakali & Newari Specialties
  'thak-1': '/images/menu/thakali-mutton.png',
  'thak-2': '/images/menu/thakali-chicken.jpg',
  'thak-3': '/images/menu/samay-baji.jpg',
  'thak-4': '/images/menu/buff-choila.jpg',

  // Appetizers & Sekuwa
  'app-1': '/images/menu/pork-sekuwa.jpg',
  'app-2': '/images/menu/wai-wai-sadeko.jpg',
  'app-3': '/images/menu/crispy-corn.jpg',

  // Cafe & Bakery
  'cafe-latte-iced': '/images/menu/iced-latte.jpg',
  'mains-burger-chicken': '/images/menu/chicken-burger.jpg',
  'cafe-1': '/images/menu/iced-latte.jpg',
  'cafe-2': '/images/menu/hot-americano.jpg',
  'cafe-3': '/images/menu/matka-masala-chiya.jpg',
  'cafe-4': '/images/menu/butter-croissant.jpg',

  // Beverages & Bar
  'bar-1': '/images/menu/beer-bottle.png',
  'bar-2': '/images/menu/craft-pilsner.png',
  'bar-3': '/images/menu/khukri-rum.jpg',
  'bar-4': '/images/menu/lime-soda.png',

  // Lounge Hookah / Shisha
  'hook-1': '/images/menu/hookah-apple.png',
  'hook-2': '/images/menu/hookah-blueberry.png',
};

export function menuImage(item: MenuItem) {
  return (!item.image || item.image.includes('images.unsplash.com')) && generatedImages[item.id]
    ? generatedImages[item.id]
    : item.image;
}

// Explicit set of genuine transparent plate cutouts.
export const KNOWN_CUTOUT_IMAGES = new Set([
  '/images/menu/steamed-momo.png',
  '/images/menu/chilli-momo.png',
  '/images/menu/jhol-momo.png',
  '/images/menu/thakali-mutton.png',
  '/images/menu/beer-bottle.png',
  '/images/menu/craft-pilsner.png',
  '/images/menu/hookah-apple.png',
  '/images/menu/hookah-blueberry.png',
]);

/**
 * Deterministically checks if an image is a genuine transparent cutout.
 * Avoids classifying all /images/menu/ assets as cutouts; regular photographs default to false.
 */
export function isCutoutImage(src: string | undefined): boolean {
  if (!src) return false;
  if (/\.jpe?g($|\?)/i.test(src)) return false;
  return KNOWN_CUTOUT_IMAGES.has(src) || /-cutout(\.|\b)/i.test(src);
}

