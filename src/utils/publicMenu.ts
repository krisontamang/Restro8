export function getPublicMenuUrl(tableId?: string): string {
  const configured = import.meta.env.VITE_PUBLIC_MENU_URL?.trim();
  const base = configured ? configured.replace(/\/$/, '') : `${window.location.origin}/menu`;
  if (!tableId) return base;

  const url = new URL(base, window.location.origin);
  url.searchParams.set('table', tableId);
  return url.toString();
}

export function isPublicMenuConfigured(): boolean {
  return Boolean(import.meta.env.VITE_PUBLIC_MENU_URL?.trim());
}

export function publicMenuStatus(): string {
  return isPublicMenuConfigured()
    ? 'Public menu URL configured'
    : 'Local preview · configure VITE_PUBLIC_MENU_URL before sharing';
}
