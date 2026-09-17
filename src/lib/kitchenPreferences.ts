import { safeStorage } from './storage';
export interface KitchenPreferences { nepaliNames: boolean; stations: boolean; server: boolean; compact: boolean }
export const defaultKitchenPreferences: KitchenPreferences = { nepaliNames: true, stations: true, server: true, compact: false };
export function readKitchenPreferences(): KitchenPreferences {
  try {
    const value = JSON.parse(safeStorage.getItem('restro8_kitchen_preferences_v1') || '{}');
    return Object.fromEntries(Object.entries(defaultKitchenPreferences).map(([key, fallback]) => [key, typeof value?.[key] === 'boolean' ? value[key] : fallback])) as unknown as KitchenPreferences;
  } catch { return { ...defaultKitchenPreferences }; }
}
export function saveKitchenPreferences(value: KitchenPreferences) { return safeStorage.setItem('restro8_kitchen_preferences_v1', JSON.stringify(value)); }
