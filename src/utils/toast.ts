import { NotificationToast } from '../types/restaurant';

/**
 * Global toast dispatcher for RESTRO8.
 * Allows triggering toast notifications from anywhere in the application
 * without requiring direct React context injection.
 */
export function notifyToast(
  title: string,
  message: string,
  type: NotificationToast['type'] = 'info'
): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('restro8:toast', {
        detail: { title, message, type },
      })
    );
  }
}

export default notifyToast;
