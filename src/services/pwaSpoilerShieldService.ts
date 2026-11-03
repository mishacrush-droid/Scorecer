export type SpoilerDelayOption = 0 | 15 | 30 | 60;

export interface BufferedAlertItem {
  id: string;
  title: string;
  body: string;
  createdAtMs: number;
  releaseAtMs: number;
  remainingSeconds: number;
}

const SPOILER_DELAY_KEY = 'scorecer_spoiler_shield_delay_v2';

let deferredInstallPrompt: (Event & {
  prompt?: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}) | null = null;

export function getSavedSpoilerDelay(): SpoilerDelayOption {
  try {
    const raw = localStorage.getItem(SPOILER_DELAY_KEY);
    const num = Number(raw);
    if (num === 0 || num === 15 || num === 30 || num === 60) {
      return num;
    }
  } catch {
    // ignore
  }
  return 0;
}

export function saveSpoilerDelay(delay: SpoilerDelayOption): void {
  try {
    localStorage.setItem(SPOILER_DELAY_KEY, String(delay));
  } catch {
    // ignore
  }
}

/**
 * Registers the Scorecer PWA Service Worker (/sw.js) and listens for install prompt events
 */
export function initPwaAndServiceWorker(
  onInstallAvailable?: (available: boolean) => void
): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e as typeof deferredInstallPrompt;
    onInstallAvailable?.(true);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker optional in embedded preview environments
      });
    });
  }
}

export async function triggerPwaInstallPrompt(): Promise<{
  installed: boolean;
  mode: 'native-prompt' | 'manual-instructions';
}> {
  if (deferredInstallPrompt && typeof deferredInstallPrompt.prompt === 'function') {
    try {
      await deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return {
        installed: choice?.outcome === 'accepted',
        mode: 'native-prompt',
      };
    } catch {
      return { installed: false, mode: 'manual-instructions' };
    }
  }
  return { installed: false, mode: 'manual-instructions' };
}

export function getBrowserNotificationPermission():
  | 'granted'
  | 'denied'
  | 'default'
  | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<
  'granted' | 'denied' | 'default' | 'unsupported'
> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return Notification.permission;
  }
}

/**
 * Fires a native OS/Browser notification (via Service Worker or Notification constructor)
 */
export function dispatchNativePushNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    if (
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCORECER_SHOW_NOTIFICATION',
        payload: {
          title,
          body,
          tag: `scorecer_${Date.now()}`,
        },
      });
      return;
    }
    new Notification(title, {
      body,
      icon: '/images/hero-goalnet.jpg',
    });
  } catch {
    // ignore if blocked in sandboxed iframe
  }
}
