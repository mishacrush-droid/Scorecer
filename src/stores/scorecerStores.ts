import { useSyncExternalStore } from 'react';
import {
  CommentaryLanguage,
  CommentatorPersona,
  LiveMatch,
  MatchEvent,
  MatchTelemetryState,
  NotificationFilters,
  ThemePreference,
  UserProfile,
} from '../types/scorecer';
import { DEFAULT_USER_PROFILE } from '../data/mockScorecerData';

// ============================================================================
// 1. STRICT CAMELCASE ZOD-STYLE TELEMETRY SCHEMA (iOS ActivityKit Parity)
// ============================================================================

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  errors: string[];
  snakeCaseViolations: string[];
}

function collectSnakeCaseKeys(obj: unknown, prefix = ''): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const violations: string[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (key.includes('_')) {
      violations.push(fullKey);
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      violations.push(...collectSnakeCaseKeys(value, fullKey));
    }
  }
  return violations;
}

export const MatchTelemetryStateSchema = {
  safeParse(input: unknown): SchemaValidationResult<MatchTelemetryState> {
    const errors: string[] = [];
    const snakeCaseViolations = collectSnakeCaseKeys(input);

    if (snakeCaseViolations.length > 0) {
      errors.push(
        `iOS ActivityKit JSONDecoder Violation: snake_case keys detected (${snakeCaseViolations.join(
          ', '
        )}). Strict camelCase is mandatory.`
      );
    }

    if (!input || typeof input !== 'object') {
      return {
        success: false,
        errors: ['Payload must be a non-null object.'],
        snakeCaseViolations,
      };
    }

    const candidate = input as Partial<MatchTelemetryState>;

    if (typeof candidate.matchId !== 'string' || !candidate.matchId) {
      errors.push('matchId must be a non-empty string.');
    }
    if (typeof candidate.competitionName !== 'string') {
      errors.push('competitionName must be a string.');
    }
    const validStatuses = [
      'PRE_MATCH',
      'KICK_OFF',
      'IN_PLAY',
      'HALFTIME',
      'SUSPENDED',
      'RESUMED',
      'FULL_TIME',
    ];
    if (!candidate.matchStatus || !validStatuses.includes(candidate.matchStatus)) {
      errors.push(`matchStatus must be one of ${validStatuses.join(' | ')}.`);
    }
    if (typeof candidate.matchMinute !== 'number' || candidate.matchMinute < 0) {
      errors.push('matchMinute must be a non-negative number.');
    }
    if (typeof candidate.latencyMs !== 'number' || candidate.latencyMs <= 0) {
      errors.push('latencyMs must be a positive number.');
    }
    if (!candidate.homeTeam || typeof candidate.homeTeam.shortName !== 'string') {
      errors.push('homeTeam object with camelCase shortName is required.');
    }
    if (!candidate.awayTeam || typeof candidate.awayTeam.shortName !== 'string') {
      errors.push('awayTeam object with camelCase shortName is required.');
    }
    if (!candidate.latestEvent || typeof candidate.latestEvent.headline !== 'string') {
      errors.push('latestEvent object with camelCase headline is required.');
    }

    return {
      success: errors.length === 0,
      data: errors.length === 0 ? (candidate as MatchTelemetryState) : undefined,
      errors,
      snakeCaseViolations,
    };
  },
};

export function buildMatchTelemetryState(
  match: LiveMatch,
  events: MatchEvent[],
  isProvisionalOverride?: boolean
): MatchTelemetryState {
  const topEvent = events[0];
  const eventTypeMap: Record<MatchEvent['type'], MatchTelemetryState['latestEvent']['type']> = {
    goal: 'GOAL',
    'card-red': 'RED_CARD',
    'card-yellow': 'YELLOW_CARD',
    sub: 'SUBSTITUTION',
    'var-review': 'VAR_REVIEW',
    'tactical-shift': 'TACTICAL_SHIFT',
    'xg-chance': 'TACTICAL_SHIFT',
  };

  const statusMap: Record<LiveMatch['status'], MatchTelemetryState['matchStatus']> = {
    LIVE: 'IN_PLAY',
    HT: 'HALFTIME',
    FT: 'FULL_TIME',
    UPCOMING: 'PRE_MATCH',
    SUSPENDED: 'SUSPENDED',
  };

  const headlineText = topEvent
    ? `${topEvent.title} (${match.minute}')`
    : `GOAL! Saka 78' (xGOT: 0.71)`;
  const provisionalFlag =
    isProvisionalOverride ?? Boolean(topEvent?.isProvisionalAttribution);

  const payload: MatchTelemetryState = {
    matchId: match.id,
    competitionName: match.competition,
    matchStatus: statusMap[match.status] || 'IN_PLAY',
    matchMinute: match.minute,
    matchSecond: match.second,
    latencyMs: match.latencyMs,
    homeTeam: {
      id: `club-${match.homeShort.toLowerCase()}`,
      name: match.homeTeam,
      shortName: match.homeShort,
      score: match.homeScore,
      xg: match.homeXG,
      xa: match.homeXA,
      formation: match.homeFormation,
      winProbability: match.winProbability.home,
    },
    awayTeam: {
      id: `club-${match.awayShort.toLowerCase()}`,
      name: match.awayTeam,
      shortName: match.awayShort,
      score: match.awayScore,
      xg: match.awayXG,
      xa: match.awayXA,
      formation: match.awayFormation,
      winProbability: match.winProbability.away,
    },
    drawProbability: match.winProbability.draw,
    lastEventBanner: headlineText,
    isProvisional: provisionalFlag,
    latestEvent: {
      id: topEvent?.id || 'ev-init',
      type: topEvent ? eventTypeMap[topEvent.type] : 'GOAL',
      headline: headlineText,
      isProvisionalAttribution: provisionalFlag,
      crowdDecibels: topEvent?.type === 'goal' ? 114 : 102,
      timestampEpoch: Math.floor(Date.now() / 1000),
    },
  };

  return payload;
}

// ============================================================================
// 2. MODULAR ZUSTAND-STYLE PERSISTED STORES (Monorepo Shared-Core Compatible)
// ============================================================================

type Listener = () => void;

function createPersistedStore<T>(storageKey: string, initialState: T) {
  let state: T = (() => {
    if (typeof window === 'undefined') return initialState;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        return { ...initialState, ...JSON.parse(raw) };
      }
    } catch {
      // ignore storage errors
    }
    return initialState;
  })();

  const listeners = new Set<Listener>();

  const getState = (): T => state;

  const setState = (updater: Partial<T> | ((prev: T) => T)) => {
    const next =
      typeof updater === 'function'
        ? (updater as (prev: T) => T)(state)
        : { ...state, ...updater };
    state = next;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // ignore storage errors
      }
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = (): [T, typeof setState] => {
    const snap = useSyncExternalStore(subscribe, getState, getState);
    return [snap, setState];
  };

  return { getState, setState, subscribe, useStore };
}

// --- A. useUIPreferencesStore (Pure Tactical Mode, Theme, Notification Filters) ---
export interface UIPreferencesState {
  pureTacticalMode: boolean;
  activeTheme: ThemePreference;
  notificationFilters: NotificationFilters;
}

const uiPreferencesStore = createPersistedStore<UIPreferencesState>(
  'scorecer_ui_preferences_v2',
  {
    pureTacticalMode: false,
    activeTheme: 'obsidian-dark',
    notificationFilters: {
      goals: true,
      redCards: true,
      tacticalShifts: true,
      xgSpikes: true,
      varReviews: true,
      fullTime: true,
    },
  }
);

export function useUIPreferencesStore() {
  const [state, setState] = uiPreferencesStore.useStore();

  const togglePureTacticalMode = (force?: boolean) => {
    setState((prev) => ({
      ...prev,
      pureTacticalMode: force !== undefined ? force : !prev.pureTacticalMode,
    }));
  };

  const setTheme = (theme: ThemePreference) => {
    setState({ activeTheme: theme });
  };

  const toggleFilter = (key: keyof NotificationFilters) => {
    setState((prev) => ({
      ...prev,
      notificationFilters: {
        ...prev.notificationFilters,
        [key]: !prev.notificationFilters[key],
      },
    }));
  };

  return {
    ...state,
    theme: state.activeTheme,
    togglePureTacticalMode,
    setTheme,
    toggleFilter,
  };
}

// --- B. useAuthStore (Session, JWT, Favorite & Rival Clubs, Guest Promotion) ---
export interface AuthStoreState {
  sessionId: string;
  jwtToken: string | null;
  isGuestAccount: boolean;
  favoriteClubs: string[]; // From 200+ global leagues
  rivalClubs: string[];
  preferredPersona: CommentatorPersona;
  preferredLanguage: CommentaryLanguage;
  gdprZeroPartyOptIn: boolean;
  gdprGeoOptIn: boolean;
  promotedAtTimestamp: string | null;
}

const authStore = createPersistedStore<AuthStoreState>('scorecer_auth_store_v2', {
  sessionId: `sess-${DEFAULT_USER_PROFILE.id}`,
  jwtToken: null,
  isGuestAccount: true,
  favoriteClubs: ['Arsenal', 'Real Madrid', 'Inter Milan'],
  rivalClubs: ['Tottenham Hotspur', 'FC Barcelona', 'Bayern Munich'],
  preferredPersona: DEFAULT_USER_PROFILE.defaultPersona,
  preferredLanguage: DEFAULT_USER_PROFILE.defaultLanguage,
  gdprZeroPartyOptIn: true,
  gdprGeoOptIn: true,
  promotedAtTimestamp: null,
});

export const promoteGuestToAuthenticated = (profile: UserProfile, jwt: string) => {
  authStore.setState((prev) => ({
    ...prev,
    isGuestAccount: false,
    jwtToken: jwt,
    favoriteClubs: profile.favoriteClubs || prev.favoriteClubs,
    preferredPersona: profile.defaultPersona,
    preferredLanguage: profile.defaultLanguage,
    gdprZeroPartyOptIn: profile.gdprZeroPartyOptIn,
    gdprGeoOptIn: profile.gdprGeoOptIn,
    promotedAtTimestamp: new Date().toISOString(),
  }));
};

export const resetToGuestAccount = () => {
  authStore.setState({
    sessionId: `sess-guest-${Date.now()}`,
    jwtToken: null,
    isGuestAccount: true,
    favoriteClubs: ['Arsenal', 'Real Madrid', 'Inter Milan'],
    rivalClubs: ['Tottenham Hotspur', 'FC Barcelona', 'Bayern Munich'],
    preferredPersona: DEFAULT_USER_PROFILE.defaultPersona,
    preferredLanguage: DEFAULT_USER_PROFILE.defaultLanguage,
    gdprZeroPartyOptIn: true,
    gdprGeoOptIn: true,
    promotedAtTimestamp: null,
  });
};

export function useAuthStore() {
  const [state, setState] = authStore.useStore();

  const setFavoriteClubs = (clubs: string[]) => {
    setState({ favoriteClubs: clubs });
  };

  const toggleFavoriteClub = (club: string) => {
    setState((prev) => ({
      ...prev,
      favoriteClubs: prev.favoriteClubs.includes(club)
        ? prev.favoriteClubs.filter((c) => c !== club)
        : [...prev.favoriteClubs, club],
    }));
  };

  const setRivalClubs = (clubs: string[]) => {
    setState({ rivalClubs: clubs });
  };

  const setPreferredLanguage = (lang: CommentaryLanguage) => {
    setState({ preferredLanguage: lang });
  };

  const setPreferredPersona = (persona: CommentatorPersona) => {
    setState({ preferredPersona: persona });
  };

  const setGdprZeroPartyOptIn = (optIn: boolean) => {
    setState({ gdprZeroPartyOptIn: optIn });
  };

  const setGdprGeoOptIn = (optIn: boolean) => {
    setState({ gdprGeoOptIn: optIn });
  };

  return {
    ...state,
    promoteGuestToAuthenticated,
    resetToGuestAccount,
    setFavoriteClubs,
    toggleFavoriteClub,
    setRivalClubs,
    setPreferredLanguage,
    setPreferredPersona,
    setGdprZeroPartyOptIn,
    setGdprGeoOptIn,
  };
}

export { authStore, uiPreferencesStore, entitlementStore };

// --- C. useEntitlementStore (RevenueCat Cross-Platform Paywall & StoreKit 2 / Play Billing) ---
export type RevenueCatPlatform =
  | 'iOS StoreKit 2'
  | 'IOS_STOREKIT_2'
  | 'Android Play Billing v7'
  | 'ANDROID_PLAY_BILLING_V7'
  | 'Web RevenueCat Stripe';

export interface RevenueCatEntitlementState {
  appUserId: string;
  activeTier: 'free' | 'scorecer_pro';
  proSubscriptionPrice: string;
  d2cMatchPassPrice: string;
  unlockedMatchPasses: string[];
  storeKit2JwsReceipt: string;
  googlePlayAckState: 'ACKNOWLEDGED_WITHIN_3_DAYS' | 'PENDING_WEBHOOK';
  lastSyncedPlatform: RevenueCatPlatform;
  lastWebhookVerifiedAt: string;
}

const entitlementStore = createPersistedStore<RevenueCatEntitlementState>(
  'scorecer_revenuecat_entitlements_v2',
  {
    appUserId: '$RCAnonymousID:8f94c2e10a4b4f21',
    activeTier: 'free',
    proSubscriptionPrice: '$4.99/mo',
    d2cMatchPassPrice: '$1.99',
    unlockedMatchPasses: [],
    storeKit2JwsReceipt:
      'eyJhbGciOiJFUzI1NiIsImtpZCI6IlJDLVNLVjItMjAyNiJ9.c2NvcmVjZXJfcHJvX3ZlcmlmaWVk',
    googlePlayAckState: 'ACKNOWLEDGED_WITHIN_3_DAYS',
    lastSyncedPlatform: 'iOS StoreKit 2',
    lastWebhookVerifiedAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }
);

export function useEntitlementStore() {
  const [state, setState] = entitlementStore.useStore();

  const purchaseScorecerPro = (
    platform: RevenueCatPlatform = 'iOS StoreKit 2'
  ) => {
    setState((prev) => ({
      ...prev,
      activeTier: 'scorecer_pro',
      lastSyncedPlatform: platform,
      googlePlayAckState: 'ACKNOWLEDGED_WITHIN_3_DAYS',
      lastWebhookVerifiedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }));
  };

  const downgradeToFree = () => {
    setState((prev) => ({
      ...prev,
      activeTier: 'free',
    }));
  };

  const purchaseConsumableMatchPass = (
    matchId: string,
    platform: RevenueCatPlatform = 'iOS StoreKit 2'
  ) => {
    setState((prev) => ({
      ...prev,
      unlockedMatchPasses: prev.unlockedMatchPasses.includes(matchId)
        ? prev.unlockedMatchPasses
        : [...prev.unlockedMatchPasses, matchId],
      lastSyncedPlatform: platform,
      googlePlayAckState: 'ACKNOWLEDGED_WITHIN_3_DAYS',
      lastWebhookVerifiedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }));
  };

  const restorePurchases = () => {
    setState((prev) => ({
      ...prev,
      googlePlayAckState: 'ACKNOWLEDGED_WITHIN_3_DAYS',
      lastWebhookVerifiedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }));
  };

  return {
    ...state,
    unlockedConsumableMatchIds: state.unlockedMatchPasses,
    acknowledgedWithin3Days:
      state.googlePlayAckState === 'ACKNOWLEDGED_WITHIN_3_DAYS',
    storeKit2TransactionJws: state.storeKit2JwsReceipt,
    purchaseScorecerPro,
    downgradeToFree,
    purchaseConsumableMatchPass,
    restorePurchases,
  };
}
