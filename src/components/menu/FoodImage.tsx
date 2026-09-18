import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { MenuItem } from '../../types/restaurant';
import { isCutoutImage, menuImage } from './menuImage';

export function FoodImage({ item, className = '' }: { item: MenuItem; className?: string }) {
  const src = menuImage(item);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isCutout = isCutoutImage(src);

  if (failedSrc === src || !src) {
    return (
      <span className={`food-image-fallback ${className}`} role="img" aria-label={item.name}>
        <UtensilsCrossed size={28} />
      </span>
    );
  }

  return (
    <img
      className={`${className} ${isCutout ? 'food-cutout' : ''}`.trim()}
      src={src}
      alt={item.name}
      loading="lazy"
      decoding="async"
      width={320}
      height={240}
      onError={() => setFailedSrc(src)}
    />
  );
}
