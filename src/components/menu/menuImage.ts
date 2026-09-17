import type { MenuItem } from '../../types/restaurant';

// Replace only the original sample photography; restaurant uploads remain intact.
const generatedImages: Record<string, string> = {
  'momo-1': '/images/menu/steamed-momo.png',
  'momo-2': '/images/menu/chilli-momo.png',
  'momo-3': '/images/menu/jhol-momo.png',
  'thak-1': '/images/menu/thakali-mutton.png',
};

export function menuImage(item: MenuItem) {
  return (!item.image || item.image.includes('images.unsplash.com')) && generatedImages[item.id]
    ? generatedImages[item.id]
    : item.image;
}
