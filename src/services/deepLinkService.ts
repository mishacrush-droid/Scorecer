import { ActiveTab, UILanguage } from '../types/scorecer';

export interface DeepLinkState {
  tab?: ActiveTab;
  match?: string;
  squad?: string;
  lang?: UILanguage;
  section?: string;
}

const VALID_TABS: ActiveTab[] = [
  'vision',
  'ai-hub',
  'match-center',
  'social-squads',
  'o2o-local',
  'discover',
];

/**
 * Reads URL query parameters (?tab=...&match=...&squad=...&lang=...) and hash on startup
 */
export function parseInitialDeepLink(): DeepLinkState {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const rawTab = params.get('tab') as ActiveTab | null;
    const rawMatch = params.get('match');
    const rawSquad = params.get('squad');
    const rawLang = params.get('lang');
    const hashSection = window.location.hash
      ? window.location.hash.replace(/^#/, '')
      : params.get('section') || undefined;

    const result: DeepLinkState = {};
    if (rawTab && VALID_TABS.includes(rawTab)) {
      result.tab = rawTab;
    }
    if (rawMatch && rawMatch.trim()) {
      result.match = rawMatch.trim();
    }
    if (rawSquad && rawSquad.trim()) {
      result.squad = rawSquad.trim();
    }
    if (rawLang === 'en' || rawLang === 'fr') {
      result.lang = rawLang;
    }
    if (hashSection) {
      result.section = hashSection;
    }
    return result;
  } catch {
    return {};
  }
}

/**
 * Updates the browser address bar without triggering a page reload
 */
export function syncStateToUrl(state: DeepLinkState): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (state.tab && state.tab !== 'vision') {
      url.searchParams.set('tab', state.tab);
    } else {
      url.searchParams.delete('tab');
    }

    if (state.match) {
      url.searchParams.set('match', state.match);
    } else {
      url.searchParams.delete('match');
    }

    if (state.squad) {
      url.searchParams.set('squad', state.squad);
    } else {
      url.searchParams.delete('squad');
    }

    if (state.lang === 'fr') {
      url.searchParams.set('lang', 'fr');
    } else {
      url.searchParams.delete('lang');
    }

    window.history.replaceState({}, '', url.toString());
  } catch {
    // ignore in restricted iframe environments
  }
}

/**
 * Builds a clean shareable deep-link URL for the given state
 */
export function buildShareableDeepLink(state: DeepLinkState): string {
  if (typeof window === 'undefined') {
    return 'https://scorecer.app';
  }
  try {
    const base =
      window.location.origin && window.location.origin !== 'null'
        ? `${window.location.origin}${window.location.pathname}`
        : 'http://127.0.0.1:5173/';
    const url = new URL(base);
    if (state.tab) url.searchParams.set('tab', state.tab);
    if (state.match) url.searchParams.set('match', state.match);
    if (state.squad) url.searchParams.set('squad', state.squad);
    if (state.lang) url.searchParams.set('lang', state.lang);
    if (state.section) url.hash = state.section;
    return url.toString();
  } catch {
    return 'http://127.0.0.1:5173/';
  }
}

/**
 * Copies the deep-link URL to the user's clipboard
 */
export async function copyDeepLinkToClipboard(
  state: DeepLinkState
): Promise<string> {
  const link = buildShareableDeepLink(state);
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(link);
      return link;
    } catch {
      // fallback below
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = link;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch {
    // ignore
  }
  return link;
}
