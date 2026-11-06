import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveTab,
  AIChatMessage,
  AIHighlightClip,
  AuthModalMode,
  CommentaryLanguage,
  CommentatorPersona,
  DataFeedTierPhase,
  DeduplicatedStoryCluster,
  FanRewardItem,
  LiveMatch,
  MatchEvent,
  MatchTelemetryState,
  MegathreadPost,
  MicroPrediction,
  NotificationFilters,
  O2OEvent,
  PassLink,
  PlayerTelemetry,
  SharedLiveWidget,
  ShotPoint,
  SquadGroup,
  SquadMessage,
  SquadSubChannel,
  TacticalShiftAlert,
  ThemePreference,
  UILanguage,
  UserProfile,
  XGDataPoint,
} from '../types/scorecer';
import {
  DEFAULT_USER_PROFILE,
  FAN_REWARDS_STORE,
  INITIAL_AI_CHAT,
  INITIAL_AI_HIGHLIGHTS,
  INITIAL_DISCOVER_CLUSTERS,
  INITIAL_MATCH_EVENTS,
  INITIAL_MATCHES,
  INITIAL_MEGATHREAD_POSTS,
  INITIAL_MICRO_PREDICTIONS,
  INITIAL_O2O_EVENTS,
  INITIAL_PASS_LINKS,
  INITIAL_PLAYERS,
  INITIAL_SHOT_MAP,
  INITIAL_SQUAD_MESSAGES,
  INITIAL_SQUADS,
  INITIAL_TACTICAL_ALERTS,
  INITIAL_XG_TIMELINE,
} from '../data/mockScorecerData';
import {
  authenticateAccount,
  authenticateWithOAuthProvider,
  clearActiveSession,
  getActiveSession,
  registerNewAccount,
  resetAccountPassword,
  SessionTokenPayload,
} from '../services/authService';
import {
  convertHistoricalToLiveMatch,
  fetchRealFootballMatches,
  HISTORICAL_MATCH_ARCHIVE,
  HistoricalMatchRecord,
} from '../services/footballDataService';
import {
  CloudSyncTelemetry,
  loadPersistedSquadMessages,
  pushCloudSyncMutation,
  savePersistedSquadMessages,
  subscribeToRealtimeMesh,
  syncUserProfileToCloud,
} from '../services/cloudSyncService';
import {
  buildLiveMatchRagContext,
  RagContextSnapshot,
  setConfiguredGeminiApiKey,
  streamGroundedMatchAnswer,
} from '../services/aiRagEngine';
import {
  BufferedAlertItem,
  dispatchNativePushNotification,
  getSavedSpoilerDelay,
  initPwaAndServiceWorker,
  requestBrowserNotificationPermission,
  saveSpoilerDelay,
  SpoilerDelayOption,
  triggerPwaInstallPrompt,
} from '../services/pwaSpoilerShieldService';
import {
  copyDeepLinkToClipboard,
  DeepLinkState,
  parseInitialDeepLink,
  syncStateToUrl,
} from '../services/deepLinkService';
import {
  buildMatchTelemetryState,
  RevenueCatEntitlementState,
  useAuthStore,
  useEntitlementStore,
  useUIPreferencesStore,
} from '../stores/scorecerStores';

interface RegistrationPayload {
  username: string;
  handle: string;
  email: string;
  password?: string;
  favoriteClubs: string[];
  favoriteLeagues: string[];
  nationalSquad: string;
  defaultPersona: CommentatorPersona;
  defaultLanguage: CommentaryLanguage;
  gdprZeroPartyOptIn: boolean;
  gdprGeoOptIn: boolean;
}

interface ScorecerContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  uiLanguage: UILanguage;
  setUiLanguage: (lang: UILanguage) => void;
  user: UserProfile;
  sessionToken: SessionTokenPayload | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthModalMode;
  openAuthModal: (mode: AuthModalMode) => void;
  registerUser: (
    payload: RegistrationPayload
  ) => Promise<{ ok: boolean; error?: string }>;
  signInUser: (
    email: string,
    password?: string,
    rememberMe?: boolean
  ) => Promise<{ ok: boolean; error?: string }>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  resetUserPassword: (
    email: string,
    newPassword: string
  ) => Promise<{ ok: boolean; message: string }>;
  signOutUser: () => void;
  updateUserPreferences: (partial: Partial<UserProfile>) => void;
  toggleProStatus: () => void;
  toggleNotificationFilter: (key: keyof NotificationFilters) => void;
  addFanScore: (points: number, reason?: string) => void;
  redeemReward: (reward: FanRewardItem) => boolean;
  unlockPPVMatch: (matchId: string, usePoints?: boolean) => boolean;
  matches: LiveMatch[];
  selectedMatchId: string;
  setSelectedMatchId: (id: string) => void;
  activeMatch: LiveMatch;
  isLiveEngineRunning: boolean;
  setIsLiveEngineRunning: (running: boolean) => void;
  isSyncingMatches: boolean;
  lastSyncedSource: string;
  historicalArchive: HistoricalMatchRecord[];
  syncRealMatchesFromAPI: (leagueSlug: string, dateYMD?: string) => Promise<void>;
  importHistoricalMatch: (recordId: string) => void;
  players: PlayerTelemetry[];
  passLinks: PassLink[];
  shotMap: ShotPoint[];
  xgTimeline: XGDataPoint[];
  matchEvents: MatchEvent[];
  tacticalAlerts: TacticalShiftAlert[];
  simulateLiveGoalOrShift: (type: 'goal' | 'tactical-shift') => void;
  aiHighlights: AIHighlightClip[];
  aiChatMessages: AIChatMessage[];
  sendAIChatMessage: (query: string, geminiApiKey?: string) => Promise<void>;
  squads: SquadGroup[];
  activeSquadId: string;
  setActiveSquadId: (id: string) => void;
  squadMessages: SquadMessage[];
  sendSquadMessage: (text: string, widget?: SharedLiveWidget, channel?: SquadSubChannel, isAiCoHost?: boolean) => void;
  shareWidgetToSquad: (widget: SharedLiveWidget) => void;
  megathreadPosts: MegathreadPost[];
  submitMegathreadPost: (text: string) => {
    status: 'approved-banter' | 'verified-analysis' | 'filtered-toxic';
    reason: string;
  };
  microPredictions: MicroPrediction[];
  submitMicroPrediction: (predictionId: string, choice: 'yes' | 'no') => void;
  rewardsCatalog: FanRewardItem[];
  o2oEvents: O2OEvent[];
  toggleO2ORSVP: (eventId: string) => void;
  applyAsCertifiedHost: (venueName: string, city: string, clubFocus: string) => void;
  discoverClusters: DeduplicatedStoryCluster[];
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
  // Roadmap Engineering Additions (Cloud Sync, Live RAG, PWA Spoiler Shield, Deep-Links)
  cloudTelemetry: CloudSyncTelemetry;
  liveRagSnapshot: RagContextSnapshot;
  isAiStreaming: boolean;
  spoilerDelaySeconds: SpoilerDelayOption;
  setSpoilerDelaySeconds: (delay: SpoilerDelayOption) => void;
  bufferedAlerts: BufferedAlertItem[];
  isPwaInstallable: boolean;
  installPwaApp: () => Promise<void>;
  shareCurrentDeepLink: (override?: DeepLinkState) => Promise<string>;
  // Boost Production Architectural Upgrades (Steps 1–8)
  pureTacticalMode: boolean;
  togglePureTacticalMode: (force?: boolean) => void;
  activeTheme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  matchTelemetryState: MatchTelemetryState;
  dataFeedPhase: DataFeedTierPhase;
  setDataFeedPhase: (phase: DataFeedTierPhase) => void;
  heartbeatCountdownSec: number;
  lane2SyncStatus: 'SYNCED_60FPS' | 'STREAMING_OPTA_MATRIX_2S';
  isProvisionalAttribution: boolean;
  setIsProvisionalAttribution: (val: boolean) => void;
  entitlements: ReturnType<typeof useEntitlementStore>;
  authStore: ReturnType<typeof useAuthStore>;
  simulateMatchStatusChange: (
    status: 'KICK_OFF' | 'HALFTIME' | 'SUSPENDED' | 'RESUMED' | 'FULL_TIME'
  ) => void;
  simulateMoneylineShift: (
    homeProb: number,
    drawProb: number,
    awayProb: number
  ) => void;
  isStoreReadinessOpen: boolean;
  setIsStoreReadinessOpen: (open: boolean) => void;
  isPaywallOpen: boolean;
  setIsPaywallOpen: (open: boolean) => void;
}

const ScorecerContext = createContext<ScorecerContextType | undefined>(undefined);

const STORAGE_KEY = 'scorecer_user_profile_v1';
const LANG_STORAGE_KEY = 'scorecer_ui_lang_v1';

export const ScorecerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialDeepLink = parseInitialDeepLink();

  const authStore = useAuthStore();
  const uiPrefsStore = useUIPreferencesStore();
  const entitlementStore = useEntitlementStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    initialDeepLink.tab || 'vision'
  );
  const [uiLanguage, setUiLanguageState] = useState<UILanguage>(() => {
    if (initialDeepLink.lang) return initialDeepLink.lang;
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'fr' || savedLang === 'en') return savedLang;
    } catch {
      // ignore
    }
    return 'en';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signup');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStoreReadinessOpen, setIsStoreReadinessOpen] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  // Dual-Lane Telemetry Ingestion Engine State
  const [dataFeedPhase, setDataFeedPhase] = useState<DataFeedTierPhase>('phase-3-enterprise');
  const [heartbeatCountdownSec, setHeartbeatCountdownSec] = useState<number>(15);
  const [lane2SyncStatus, setLane2SyncStatus] = useState<'SYNCED_60FPS' | 'STREAMING_OPTA_MATRIX_2S'>('SYNCED_60FPS');
  const [isProvisionalAttribution, setIsProvisionalAttribution] = useState<boolean>(true);

  const [user, setUser] = useState<UserProfile>(() => {
    const activeSession = getActiveSession();
    if (activeSession) {
      return activeSession.account.profile;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_USER_PROFILE;
  });

  const [sessionToken, setSessionToken] = useState<SessionTokenPayload | null>(
    () => getActiveSession()?.token || null
  );

  const [matches, setMatches] = useState<LiveMatch[]>(() => {
    if (initialDeepLink.match) {
      const histRec = HISTORICAL_MATCH_ARCHIVE.find(
        (r) => r.id === initialDeepLink.match || `hist-${r.id}` === initialDeepLink.match
      );
      if (histRec) {
        const converted = convertHistoricalToLiveMatch(histRec);
        return [converted, ...INITIAL_MATCHES.filter((m) => m.id !== converted.id)];
      }
    }
    return INITIAL_MATCHES;
  });
  const [selectedMatchId, setSelectedMatchId] = useState<string>(() => {
    if (initialDeepLink.match) {
      return initialDeepLink.match;
    }
    return INITIAL_MATCHES[0].id;
  });
  const [isLiveEngineRunning, setIsLiveEngineRunning] = useState<boolean>(true);
  const [isSyncingMatches, setIsSyncingMatches] = useState<boolean>(false);
  const [lastSyncedSource, setLastSyncedSource] = useState<string>(
    'Scorecer Edge Telemetry + UEFA Champions League'
  );
  const [players, setPlayers] = useState<PlayerTelemetry[]>(INITIAL_PLAYERS);
  const [passLinks] = useState<PassLink[]>(INITIAL_PASS_LINKS);
  const [shotMap, setShotMap] = useState<ShotPoint[]>(INITIAL_SHOT_MAP);
  const [xgTimeline, setXgTimeline] = useState<XGDataPoint[]>(INITIAL_XG_TIMELINE);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>(INITIAL_MATCH_EVENTS);
  const [tacticalAlerts, setTacticalAlerts] = useState<TacticalShiftAlert[]>(INITIAL_TACTICAL_ALERTS);

  const [aiHighlights, setAiHighlights] = useState<AIHighlightClip[]>(INITIAL_AI_HIGHLIGHTS);
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>(INITIAL_AI_CHAT);
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);

  const [squads] = useState<SquadGroup[]>(INITIAL_SQUADS);
  const [activeSquadId, setActiveSquadId] = useState<string>(
    initialDeepLink.squad && INITIAL_SQUADS.some((s) => s.id === initialDeepLink.squad)
      ? initialDeepLink.squad
      : INITIAL_SQUADS[0].id
  );
  const [squadMessages, setSquadMessages] = useState<SquadMessage[]>(
    () => loadPersistedSquadMessages() || INITIAL_SQUAD_MESSAGES
  );
  const [megathreadPosts, setMegathreadPosts] = useState<MegathreadPost[]>(INITIAL_MEGATHREAD_POSTS);
  const [microPredictions, setMicroPredictions] = useState<MicroPrediction[]>(INITIAL_MICRO_PREDICTIONS);
  const [o2oEvents, setO2OEvents] = useState<O2OEvent[]>(INITIAL_O2O_EVENTS);
  const [discoverClusters] = useState<DeduplicatedStoryCluster[]>(INITIAL_DISCOVER_CLUSTERS);

  // Cloud Sync & Realtime Telemetry State
  const [cloudTelemetry, setCloudTelemetry] = useState<CloudSyncTelemetry>({
    status: 'synced',
    providerLabel: 'Realtime Mesh + IndexedDB Cloud Replica',
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    latencyMs: 6,
    syncedEventsCount: 1,
    connectedPeers: 1,
  });

  // PWA & Spoiler-Shield Buffer State
  const [spoilerDelaySeconds, setSpoilerDelaySecondsState] =
    useState<SpoilerDelayOption>(() => getSavedSpoilerDelay());
  const [bufferedAlerts, setBufferedAlerts] = useState<BufferedAlertItem[]>([]);
  const [isPwaInstallable, setIsPwaInstallable] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
    syncUserProfileToCloud(user).then((res) => {
      setCloudTelemetry((prev) => ({
        ...prev,
        status: 'synced',
        providerLabel: res.providerLabel,
        latencyMs: res.latencyMs,
        lastSyncedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        syncedEventsCount: prev.syncedEventsCount + 1,
      }));
    });
  }, [user]);

  // Initialize PWA Service Worker & Install Prompt Listener
  useEffect(() => {
    initPwaAndServiceWorker((available) => {
      setIsPwaInstallable(available);
    });
  }, []);

  // Bidirectional Deep-Link URL synchronization
  useEffect(() => {
    syncStateToUrl({
      tab: activeTab,
      match: selectedMatchId,
      squad: activeSquadId,
      lang: uiLanguage,
    });
  }, [activeTab, selectedMatchId, activeSquadId, uiLanguage]);

  // Subscribe to Cross-Tab & Cloud Realtime Mesh
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeMesh((packet) => {
      setCloudTelemetry((prev) => ({
        ...prev,
        status: 'synced',
        connectedPeers: Math.max(2, prev.connectedPeers),
        lastSyncedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        syncedEventsCount: prev.syncedEventsCount + 1,
      }));

      if (packet.type === 'SQUAD_MESSAGE_POSTED' && packet.payload) {
        const incomingMsg = packet.payload as SquadMessage;
        setSquadMessages((prev) => {
          if (prev.some((m) => m.id === incomingMsg.id)) return prev;
          const next = [...prev, incomingMsg];
          savePersistedSquadMessages(next);
          return next;
        });
      } else if (packet.type === 'ACTIVE_MATCH_CHANGED' && typeof packet.payload === 'string') {
        setSelectedMatchId(packet.payload);
      } else if (packet.type === 'USER_PROFILE_UPDATED' && packet.payload) {
        const incomingProfile = packet.payload as UserProfile;
        setUser((prev) =>
          prev.email === incomingProfile.email ? incomingProfile : prev
        );
      }
    });
    return unsubscribe;
  }, []);

  // Spoiler-Shield Buffer Queue Ticker
  useEffect(() => {
    if (bufferedAlerts.length === 0) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setBufferedAlerts((prev) => {
        const readyToRelease: BufferedAlertItem[] = [];
        const stillWaiting: BufferedAlertItem[] = [];
        for (const item of prev) {
          const rem = Math.ceil((item.releaseAtMs - now) / 1000);
          if (rem <= 0) {
            readyToRelease.push(item);
          } else {
            stillWaiting.push({ ...item, remainingSeconds: rem });
          }
        }
        readyToRelease.forEach((rel) => {
          triggerToast(`🛡️ [Spoiler Shield Released] ${rel.title}: ${rel.body}`);
          dispatchNativePushNotification(rel.title, rel.body);
        });
        return stillWaiting;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [bufferedAlerts.length]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  // Real-time sub-second WebSocket simulation engine + 15s Lane 1 Heartbeat
  useEffect(() => {
    if (!isLiveEngineRunning) return;
    const interval = setInterval(() => {
      setHeartbeatCountdownSec((prev) => (prev <= 1 ? 15 : prev - 1));
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.status !== 'LIVE') return m;
          let nextSec = m.second + 1;
          let nextMin = m.minute;
          if (nextSec >= 60) {
            nextSec = 0;
            nextMin = m.minute < 90 ? m.minute + 1 : 78;
          }
          const jitter = Math.floor(Math.random() * 40) - 20;
          const nextLatency = Math.max(580, Math.min(760, m.latencyMs + jitter));
          return {
            ...m,
            minute: nextMin,
            second: nextSec,
            latencyMs: nextLatency,
          };
        })
      );

      // Subtle live ML player rating fluctuation every 4 seconds
      if (Math.random() < 0.28) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((p) => {
            if (Math.random() > 0.25) return p;
            const deltaStep = Math.random() > 0.48 ? 0.1 : -0.1;
            const nextRating = Number(
              Math.max(5.8, Math.min(9.8, p.rating + deltaStep)).toFixed(1)
            );
            const nextDelta = Number((p.ratingDelta + deltaStep).toFixed(1));
            return {
              ...p,
              rating: nextRating,
              ratingDelta: nextDelta,
              touches: p.touches + (Math.random() > 0.5 ? 1 : 0),
            };
          })
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveEngineRunning]);

  const activeMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  const matchTelemetryState = buildMatchTelemetryState(
    activeMatch,
    matchEvents,
    isProvisionalAttribution
  );

  const liveRagSnapshot = buildLiveMatchRagContext(
    activeMatch,
    matchEvents,
    players,
    xgTimeline
  );

  const togglePureTacticalMode = (force?: boolean) => {
    uiPrefsStore.togglePureTacticalMode(force);
    const nextVal =
      typeof force === 'boolean' ? force : !uiPrefsStore.pureTacticalMode;
    triggerToast(
      nextVal
        ? '🎯 Pure Tactical Mode ON — Social banter, FanScore gamification & O2O drawers hidden for zero-clutter analyst view.'
        : '⚡ Full Super-App Mode Restored — Squads, FanScore Pick\'Em & O2O Match Hubs active.'
    );
  };

  const setSpoilerDelaySeconds = (delay: SpoilerDelayOption) => {
    setSpoilerDelaySecondsState(delay);
    saveSpoilerDelay(delay);
    if (delay > 0) {
      requestBrowserNotificationPermission();
    }
    triggerToast(
      uiLanguage === 'fr'
        ? delay === 0
          ? 'Bouclier Anti-Spoiler désactivé (Alertes en temps réel 0.68s).'
          : `Bouclier Anti-Spoiler activé : tampon de +${delay}s configuré pour vos diffusions.`
        : delay === 0
        ? 'Spoiler Shield set to 0s (Instant 0.68s real-time alerts).'
        : `Spoiler Shield armed: +${delay}s buffer active for your broadcast stream.`
    );
  };

  const installPwaApp = async () => {
    await requestBrowserNotificationPermission();
    const res = await triggerPwaInstallPrompt();
    if (res.installed) {
      triggerToast(
        uiLanguage === 'fr'
          ? 'Scorecer PWA installée sur votre appareil !'
          : 'Scorecer PWA installed to your home screen!'
      );
    } else {
      triggerToast(
        uiLanguage === 'fr'
          ? 'Application PWA prête (Manifest + Service Worker /sw.js actifs) — utilisez « Ajouter à l’écran d’accueil » dans votre navigateur.'
          : 'Scorecer PWA ready (Manifest + /sw.js Service Worker active) — use "Add to Home Screen" or "Install App" in your browser bar.'
      );
    }
  };

  const shareCurrentDeepLink = async (override?: DeepLinkState): Promise<string> => {
    const link = await copyDeepLinkToClipboard({
      tab: override?.tab ?? activeTab,
      match: override?.match ?? selectedMatchId,
      squad: override?.squad ?? activeSquadId,
      lang: override?.lang ?? uiLanguage,
      section: override?.section,
    });
    triggerToast(
      uiLanguage === 'fr'
        ? `🔗 Lien direct copié : ${link}`
        : `🔗 Shareable deep-link copied: ${link}`
    );
    return link;
  };

  const setUiLanguage = (lang: UILanguage) => {
    setUiLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    triggerToast(
      lang === 'fr'
        ? 'Langue changée en Français (FR)'
        : 'Language switched to English (EN)'
    );
  };

  const openAuthModal = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const registerUser = async (
    payload: RegistrationPayload
  ): Promise<{ ok: boolean; error?: string }> => {
    const res = await registerNewAccount({
      username: payload.username,
      handle: payload.handle,
      email: payload.email,
      password: payload.password || 'Scorecer2026!',
      favoriteClubs: payload.favoriteClubs,
      favoriteLeagues: payload.favoriteLeagues,
      nationalSquad: payload.nationalSquad,
      defaultPersona: payload.defaultPersona,
      defaultLanguage: payload.defaultLanguage,
      gdprZeroPartyOptIn: payload.gdprZeroPartyOptIn,
      gdprGeoOptIn: payload.gdprGeoOptIn,
    });

    if (!res.ok || !res.account) {
      return {
        ok: false,
        error: uiLanguage === 'fr' ? res.errorFr : res.errorEn,
      };
    }

    setUser(res.account.profile);
    setSessionToken(res.token || null);
    if (res.token) {
      authStore.promoteGuestToAuthenticated(
        res.account.profile,
        res.token.jwt || res.token.signature
      );
    }
    setIsAuthModalOpen(false);
    triggerToast(
      uiLanguage === 'fr'
        ? `Compte chiffré créé ! Bienvenue ${res.account.username} (+250 pts FanScore).`
        : `Encrypted account created! Welcome ${res.account.username} (+250 FanScore bonus).`
    );
    return { ok: true };
  };

  const signInUser = async (
    email: string,
    password = 'Scorecer2026!',
    rememberMe = true
  ): Promise<{ ok: boolean; error?: string }> => {
    const res = await authenticateAccount({
      email,
      password,
      rememberMe,
    });
    if (!res.ok || !res.account) {
      return {
        ok: false,
        error: uiLanguage === 'fr' ? res.errorFr : res.errorEn,
      };
    }
    setUser(res.account.profile);
    setSessionToken(res.token || null);
    if (res.token) {
      authStore.promoteGuestToAuthenticated(
        res.account.profile,
        res.token.jwt || res.token.signature
      );
    }
    setIsAuthModalOpen(false);
    triggerToast(
      uiLanguage === 'fr'
        ? `Session authentifiée ! Bon retour sur le terrain, ${res.account.username}.`
        : `Session authenticated! Welcome back to the pitch, ${res.account.username}.`
    );
    return { ok: true };
  };

  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    const res = await authenticateWithOAuthProvider(provider);
    setUser(res.account.profile);
    setSessionToken(res.token);
    authStore.promoteGuestToAuthenticated(
      res.account.profile,
      res.token.jwt || res.token.signature
    );
    setIsAuthModalOpen(false);
    triggerToast(
      uiLanguage === 'fr'
        ? `Connecté via ${provider === 'google' ? 'Google' : 'Apple'} (${res.account.username}).`
        : `Signed in with ${provider === 'google' ? 'Google' : 'Apple'} (${res.account.username}).`
    );
  };

  const resetUserPassword = async (email: string, newPassword: string) => {
    const res = await resetAccountPassword(email, newPassword);
    const msg = uiLanguage === 'fr' ? res.messageFr : res.messageEn;
    if (res.ok) {
      triggerToast(msg);
    }
    return { ok: res.ok, message: msg };
  };

  const signOutUser = () => {
    clearActiveSession();
    setSessionToken(null);
    setUser((prev) => ({ ...prev, isRegistered: false }));
    authStore.resetToGuestAccount();
    setIsAuthModalOpen(false);
    triggerToast(
      uiLanguage === 'fr'
        ? 'Session révoquée. Vous êtes déconnecté de Scorecer.'
        : 'Session token revoked. Signed out of Scorecer.'
    );
  };

  const syncRealMatchesFromAPI = async (leagueSlug: string, dateYMD?: string) => {
    setIsSyncingMatches(true);
    try {
      const result = await fetchRealFootballMatches({ leagueSlug, dateYMD });
      if (result.matches.length > 0) {
        setMatches((prev) => {
          const merged = [...result.matches];
          prev.forEach((m) => {
            if (!merged.some((nm) => nm.id === m.id) && merged.length < 8) {
              merged.push(m);
            }
          });
          return merged;
        });
        const firstNew = result.matches[0];
        setSelectedMatchId(firstNew.id);
        const firstEvents = result.eventsByMatchId[firstNew.id];
        if (firstEvents && firstEvents.length > 0) {
          setMatchEvents(firstEvents);
        }
        setLastSyncedSource(
          result.source === 'espn-live-api'
            ? `ESPN Live Soccer API (${leagueSlug.toUpperCase()}${dateYMD ? ` · ${dateYMD}` : ''})`
            : `Verified Historical Archive (${leagueSlug.toUpperCase()})`
        );
        triggerToast(
          uiLanguage === 'fr'
            ? `${result.matches.length} matchs réels importés (${firstNew.homeTeam} vs ${firstNew.awayTeam}) !`
            : `Imported ${result.matches.length} real matches (${firstNew.homeTeam} vs ${firstNew.awayTeam})!`
        );
      }
    } finally {
      setIsSyncingMatches(false);
    }
  };

  const importHistoricalMatch = (recordId: string) => {
    const rec = HISTORICAL_MATCH_ARCHIVE.find((r) => r.id === recordId);
    if (!rec) return;
    const converted = convertHistoricalToLiveMatch(rec);
    setMatches((prev) => {
      const filtered = prev.filter((m) => m.id !== converted.id);
      return [converted, ...filtered];
    });
    setSelectedMatchId(converted.id);
    if (rec.events.length > 0) {
      setMatchEvents(rec.events);
    }
    setLastSyncedSource(`Historical Archive · ${rec.competition} (${rec.date})`);
    triggerToast(
      uiLanguage === 'fr'
        ? `Match historique importé : ${rec.homeTeam} ${rec.homeScore}–${rec.awayScore} ${rec.awayTeam} (${rec.date})`
        : `Historical match imported: ${rec.homeTeam} ${rec.homeScore}–${rec.awayScore} ${rec.awayTeam} (${rec.date})`
    );
  };

  const updateUserPreferences = (partial: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...partial }));
    triggerToast(
      uiLanguage === 'fr'
        ? 'Préférences Scorecer mises à jour.'
        : 'Scorecer profile & personalization preferences updated.'
    );
  };

  const toggleProStatus = () => {
    setUser((prev) => {
      const nextPro = !prev.isPro;
      if (nextPro) {
        entitlementStore.purchaseScorecerPro('IOS_STOREKIT_2');
      } else {
        entitlementStore.downgradeToFree();
      }
      triggerToast(
        nextPro
          ? 'Scorecer Pro ($4.99/mo) Activated via RevenueCat! Raw xG exports, zero sponsor tags & unlimited AI unlocked.'
          : 'Switched to Scorecer Standard Free Tier.'
      );
      return { ...prev, isPro: nextPro };
    });
  };

  const toggleNotificationFilter = (key: keyof NotificationFilters) => {
    setUser((prev) => ({
      ...prev,
      notificationFilters: {
        ...prev.notificationFilters,
        [key]: !prev.notificationFilters[key],
      },
    }));
  };

  const addFanScore = (points: number, reason?: string) => {
    setUser((prev) => ({
      ...prev,
      fanScore: prev.fanScore + points,
    }));
    if (reason) {
      triggerToast(`+${points} FanScore! ${reason}`);
    }
  };

  const redeemReward = (reward: FanRewardItem): boolean => {
    if (user.fanScore < reward.costPoints) {
      triggerToast(`Insufficient FanScore! Need ${reward.costPoints} PTS.`);
      return false;
    }
    setUser((prev) => ({
      ...prev,
      fanScore: prev.fanScore - reward.costPoints,
      redeemedRewards: [...prev.redeemedRewards, reward.id],
    }));
    triggerToast(
      `Redeemed Non-Monetary Digital Reward "${reward.title}" for ${reward.costPoints} FanScore! (App Store Guideline 5.3.2 Compliant)`
    );
    return true;
  };

  const unlockPPVMatch = (matchId: string, _usePoints?: boolean): boolean => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return false;
    if (
      user.unlockedPPVMatches.includes(matchId) ||
      entitlementStore.unlockedConsumableMatchIds.includes(matchId)
    ) {
      return true;
    }

    entitlementStore.purchaseConsumableMatchPass(matchId, 'IOS_STOREKIT_2');
    setUser((prev) => ({
      ...prev,
      unlockedPPVMatches: [...prev.unlockedPPVMatches, matchId],
    }));
    triggerToast(
      `1-Click D2C Match Pass Unlocked (${targetMatch.ppvPrice} Consumable IAP via StoreKit 2 / Play Billing)! Enjoy 1080p60 zero-latency broadcast.`
    );
    return true;
  };

  const simulateLiveGoalOrShift = (type: 'goal' | 'tactical-shift') => {
    const currentMin = activeMatch.minute;
    setLane2SyncStatus('STREAMING_OPTA_MATRIX_2S');
    setTimeout(() => {
      setLane2SyncStatus('SYNCED_60FPS');
    }, 2000);

    if (type === 'goal') {
      const xgBump = 0.48;
      setIsProvisionalAttribution(true);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === activeMatch.id
            ? {
                ...m,
                homeScore: m.homeScore + 1,
                homeXG: Number((m.homeXG + xgBump).toFixed(2)),
                winProbability: {
                  home: Math.min(92, m.winProbability.home + 16),
                  draw: Math.max(5, m.winProbability.draw - 10),
                  away: Math.max(3, m.winProbability.away - 6),
                  aiReason: `Live Goal Surge (${currentMin}'): Odegaard & Saka right half-space overload produced a 0.48 xG finish, pushing Home Win Likelihood to ${Math.min(
                    92,
                    m.winProbability.home + 16
                  )}%.`,
                },
              }
            : m
        )
      );
      setShotMap((prev) => [
        ...prev,
        {
          id: `sh-sim-${Date.now()}`,
          minute: currentMin,
          player: 'B. Saka',
          team: 'home',
          x: 89,
          y: 56,
          xg: xgBump,
          outcome: 'goal',
        },
      ]);
      setXgTimeline((prev) => [
        ...prev,
        {
          minute: currentMin,
          homeXG: Number((activeMatch.homeXG + xgBump).toFixed(2)),
          awayXG: activeMatch.awayXG,
          momentum: 94,
          eventLabel: `${currentMin}' GOAL Saka (${xgBump} xG)`,
        },
      ]);
      setMatchEvents((prev) => [
        {
          id: `ev-sim-${Date.now()}`,
          minute: currentMin,
          second: activeMatch.second,
          type: 'goal',
          team: 'home',
          title: `GOAL! Bukayo Saka (${activeMatch.homeScore + 1}-${activeMatch.awayScore} ${activeMatch.homeTeam})`,
          detail: `Lane 1 (<200ms Scout WS) • +${xgBump} xG • 116 dB Roar Spike auto-clipped by CV.`,
          xgAdded: xgBump,
          isProvisionalAttribution: true,
          provisionalReason:
            'Dispatched in 0.68s via Lane 1 Scout Feed; official Opta F24 deflection check pending.',
          deliveryLane: 'LANE_1_SCOUT_SUB200MS',
        },
        ...prev,
      ]);
      const newClip: AIHighlightClip = {
        id: `clip-sim-${Date.now()}`,
        matchId: activeMatch.id,
        minute: currentMin,
        title: `${currentMin}' Saka Instant Goal Highlight (Auto-Clipped in 2.1s)`,
        player: 'B. Saka',
        team: 'home',
        category: 'goal',
        crowdDecibels: 116,
        commentatorExcitement: 99,
        cvConfidence: 99.8,
        generationTimeSec: 2.1,
        duration: '0:22',
        xgValue: xgBump,
        tacticalTag: 'Zone 14 Combination → Far-Post Finish',
        description:
          'Triggered automatically by CV goal-line crossing detection and 116 dB crowd roar spike.',
        accentColor: '#00F59B',
      };
      setAiHighlights((prev) => [newClip, ...prev]);

      const alertTitle = `⚡ GOAL! ${activeMatch.homeTeam} ${activeMatch.homeScore + 1}–${activeMatch.awayScore} ${activeMatch.awayTeam}`;
      const alertBody = `${currentMin}' Bukayo Saka (+${xgBump} xG). AI Highlight auto-clipped in 2.1s.`;

      if (spoilerDelaySeconds > 0) {
        const now = Date.now();
        setBufferedAlerts((prev) => [
          ...prev,
          {
            id: `buf-${now}`,
            title: alertTitle,
            body: alertBody,
            createdAtMs: now,
            releaseAtMs: now + spoilerDelaySeconds * 1000,
            remainingSeconds: spoilerDelaySeconds,
          },
        ]);
        triggerToast(
          uiLanguage === 'fr'
            ? `🛡️ Bouclier Anti-Spoiler : Alerte de but retenue pendant +${spoilerDelaySeconds}s pour protéger votre direct.`
            : `🛡️ Spoiler Shield Holding Goal Alert for +${spoilerDelaySeconds}s to protect your stream!`
        );
      } else {
        triggerToast(
          `⚡ 0.68s GOAL ALERT: ${activeMatch.homeTeam} score! AI Highlight auto-clipped in 2.1s.`
        );
        dispatchNativePushNotification(alertTitle, alertBody);
      }
    } else {
      const newAlert: TacticalShiftAlert = {
        id: `tac-sim-${Date.now()}`,
        minute: currentMin,
        team: 'home',
        headline: `${currentMin}' TACTICAL SHIFT: Inverted Wing-Back Box Midfield (3-2-4-1)`,
        explanation:
          'Optical tracking detected Timber inverting alongside Rice to create a 4v3 central overload, boosting progressive pass completion by +34% over the last 3 minutes.',
        formationBefore: activeMatch.homeFormation,
        formationAfter: '3-2-4-1 Box Overload',
        metricChange: '+34% Central Progression | PPDA 6.2',
      };
      setTacticalAlerts((prev) => [newAlert, ...prev]);
      setMatchEvents((prev) => [
        {
          id: `ev-tac-${Date.now()}`,
          minute: currentMin,
          second: activeMatch.second,
          type: 'tactical-shift',
          team: 'home',
          title: `AI TACTICAL ALERT: ${activeMatch.homeTeam} shift to 3-2-4-1 Box Overload`,
          detail: 'Central progression +34% • Opposition high press neutralized.',
          deliveryLane: 'LANE_2_OPTA_ASYNC_2S',
        },
        ...prev,
      ]);
      triggerToast(`🧠 AI Tactical Shift Alert (${currentMin}'): 3-2-4-1 Box Midfield detected!`);
    }
  };

  const simulateMatchStatusChange = (
    newStatus: 'KICK_OFF' | 'HALFTIME' | 'SUSPENDED' | 'RESUMED' | 'FULL_TIME'
  ) => {
    const statusMap: Record<string, LiveMatch['status']> = {
      KICK_OFF: 'LIVE',
      HALFTIME: 'HT',
      FULL_TIME: 'FT',
      SUSPENDED: 'SUSPENDED',
      RESUMED: 'LIVE',
    };
    const targetStatus = statusMap[newStatus] || 'LIVE';
    setMatches((prev) =>
      prev.map((m) =>
        m.id === activeMatch.id
          ? {
              ...m,
              status: targetStatus,
            }
          : m
      )
    );
    setMatchEvents((prev) => [
      {
        id: `ev-status-${Date.now()}`,
        minute: activeMatch.minute,
        second: activeMatch.second,
        type: 'tactical-shift',
        team: 'home',
        title: `MATCH STATUS: ${newStatus}`,
        detail: `Lane 1 (<200ms Scout WS): Instant edge frame match_status_change -> ${newStatus}.`,
        isProvisionalAttribution: false,
      },
      ...prev,
    ]);
    triggerToast(
      uiLanguage === 'fr'
        ? `⚡ Voie 1 (<200ms) : Statut de match changé en ${newStatus} !`
        : `⚡ Scout Lane 1 (<200ms): Match status updated to ${newStatus}!`
    );
  };

  const simulateMoneylineShift = (
    homeProb: number,
    drawProb: number,
    awayProb: number
  ) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === activeMatch.id
          ? {
              ...m,
              winProbability: {
                home: homeProb,
                draw: drawProb,
                away: awayProb,
                aiReason: `Scout Lane 1 Moneyline Shift: Home ${homeProb}% | Draw ${drawProb}% | Away ${awayProb}% (Sub-second Edge Delta).`,
              },
            }
          : m
      )
    );
    triggerToast(
      uiLanguage === 'fr'
        ? `⚡ Voie 1 : Cotes 3-Way Moneyline actualisées (${homeProb}% / ${drawProb}% / ${awayProb}%) !`
        : `⚡ Scout Lane 1: 3-Way Moneyline shifted (${homeProb}% / ${drawProb}% / ${awayProb}%)!`
    );
  };

  const sendAIChatMessage = async (query: string, geminiApiKey?: string) => {
    if (!query.trim()) return;
    if (geminiApiKey && geminiApiKey.trim().length > 10) {
      setConfiguredGeminiApiKey(geminiApiKey.trim());
    }
    const nowStamp = `${activeMatch.minute}:${String(activeMatch.second).padStart(2, '0')}'`;
    const userMsg: AIChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      timestamp: nowStamp,
      text: query,
    };
    const streamingMsgId = `ai-msg-${Date.now() + 1}`;
    const ragPayloadObj = {
      matchId: activeMatch.id,
      window: `${Math.max(0, activeMatch.minute - 1)}:${String(activeMatch.second).padStart(2, '0')}–${nowStamp}`,
      scoreline: `${activeMatch.homeShort} ${activeMatch.homeScore}-${activeMatch.awayScore} ${activeMatch.awayShort}`,
      xgState: `${activeMatch.homeXG.toFixed(2)} vs ${activeMatch.awayXG.toFixed(2)}`,
      ppda: `${activeMatch.homePPDA} vs ${activeMatch.awayPPDA}`,
      fieldTiltHomePct: activeMatch.fieldTiltHome,
      recentEvents: matchEvents.slice(0, 2).map((e) => `${e.minute}' ${e.title}`),
    };
    const placeholderReply: AIChatMessage = {
      id: streamingMsgId,
      sender: 'scorecer-ai',
      timestamp: nowStamp,
      text: uiLanguage === 'fr' ? 'Analyse télémétrique RAG en cours...' : 'Synthesizing live match RAG telemetry...',
      telemetryCitations: [
        `${activeMatch.homeShort} ${activeMatch.homeScore}–${activeMatch.awayScore} ${activeMatch.awayShort}`,
      ],
      embeddedClipId: aiHighlights[0]?.id,
      tacticalDiagramType: 'overload-right',
      ragSnapshotPayload: JSON.stringify(ragPayloadObj, null, 2),
    };

    setAiChatMessages((prev) => [...prev, userMsg, placeholderReply]);
    setIsAiStreaming(true);

    try {
      const result = await streamGroundedMatchAnswer({
        query,
        match: activeMatch,
        events: matchEvents,
        players,
        xgTimeline,
        language: uiLanguage,
        onTokenStream: (partialText) => {
          setAiChatMessages((prev) =>
            prev.map((m) =>
              m.id === streamingMsgId ? { ...m, text: `${partialText} ▍` } : m
            )
          );
        },
      });

      const lower = query.toLowerCase();
      const diagram: 'high-press' | 'overload-right' | 'low-block-break' =
        lower.includes('press') || lower.includes('momentum')
          ? 'high-press'
          : lower.includes('counter') || lower.includes('block')
          ? 'low-block-break'
          : 'overload-right';

      setAiChatMessages((prev) =>
        prev.map((m) =>
          m.id === streamingMsgId
            ? {
                ...m,
                text: result.finalText,
                telemetryCitations: [
                  ...result.citations,
                  result.engineUsed,
                ],
                embeddedClipId: aiHighlights[0]?.id,
                tacticalDiagramType: diagram,
                ragSnapshotPayload: JSON.stringify(ragPayloadObj, null, 2),
              }
            : m
        )
      );
    } finally {
      setIsAiStreaming(false);
    }
  };

  const sendSquadMessage = (
    text: string,
    widget?: SharedLiveWidget,
    channel: SquadSubChannel = 'match-day-thread',
    isAiCoHost = false
  ) => {
    const nowStamp = `${activeMatch.minute}:${String(activeMatch.second).padStart(2, '0')}'`;
    const enrichedWidget: SharedLiveWidget | undefined = widget
      ? {
          ...widget,
          pointer: widget.pointer || {
            widgetType: widget.widgetType || widget.type,
            matchId: activeMatch.id,
            sharedAtMinute: activeMatch.minute,
          },
        }
      : undefined;

    const targetChannel: SquadSubChannel = enrichedWidget ? 'pinned-widgets' : channel;
    const newMsg: SquadMessage = {
      id: `sq-msg-${Date.now()}`,
      squadId: activeSquadId,
      channel: targetChannel,
      subChannel: targetChannel,
      author: isAiCoHost ? 'Scorecer AI Co-Host (Sonic-3.6)' : user.username,
      authorHandle: isAiCoHost ? '@scorecer_ai_voice' : user.handle,
      avatarColor: isAiCoHost ? '#00D4FF' : user.avatarColor,
      timestamp: nowStamp,
      text,
      isPro: isAiCoHost ? true : user.isPro,
      isAiCoHost,
      widget: enrichedWidget,
      reactions: [{ emoji: isAiCoHost ? '🎙️' : '🔥', count: 1 }],
    };
    setSquadMessages((prev) => {
      const next = [...prev, newMsg];
      savePersistedSquadMessages(next);
      return next;
    });
    pushCloudSyncMutation('SQUAD_MESSAGE_POSTED', newMsg).then((res) => {
      setCloudTelemetry((prev) => ({
        ...prev,
        status: 'synced',
        providerLabel: res.providerLabel,
        latencyMs: res.latencyMs,
        lastSyncedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        syncedEventsCount: prev.syncedEventsCount + 1,
      }));
    });
  };

  const shareWidgetToSquad = (widget: SharedLiveWidget) => {
    const pointerWidget: SharedLiveWidget = {
      ...widget,
      pointer: {
        widgetType: widget.widgetType || widget.type,
        matchId: activeMatch.id,
        sharedAtMinute: activeMatch.minute,
      },
    };
    sendSquadMessage(
      `Shared 60fps JSON pointer widget { widgetType: "${widget.widgetType || widget.type}", matchId: "${activeMatch.id}", sharedAtMinute: ${activeMatch.minute} }:`,
      pointerWidget,
      'match-day-thread'
    );
    triggerToast(
      `Dropped 60fps "${widget.title}" JSON pointer into Squad Match Day Thread & Pinned Widgets!`
    );
  };

  const submitMegathreadPost = (text: string) => {
    const toxicPatterns = [
      'idiot',
      'stupid',
      'hate you',
      'scam',
      'crypto pump',
      'buy token',
      'trash human',
      'kill',
      'slur',
      'racist',
      '88',
      '⚡⚡',
    ];
    const banterWhitelist = [
      'bottlers',
      'parked the bus',
      'fraud watch',
      'robbed by var',
      'cooking',
      'ghosted',
      'farmers league',
      'warra trophy',
    ];
    const lower = text.toLowerCase();
    const isToxic = toxicPatterns.some((pat) => lower.includes(pat));
    const matchedBanter = banterWhitelist.find((term) => lower.includes(term));

    if (isToxic) {
      const blockedPost: MegathreadPost = {
        id: `mega-${Date.now()}`,
        author: user.username,
        handle: user.handle,
        clubBadge: user.favoriteClubs[0] || 'Football Fan',
        timestamp: `${activeMatch.minute}'`,
        text,
        moderationStatus: 'filtered-toxic',
        nlpStage: 'STAGE_2_TOXICITY_SHIELD',
        nlpConfidence: 99.4,
        moderationReason:
          'Stage 2 Contextual Toxicity & Co-Opted Symbol Filter: Targeted abuse / spam / extremist dog-whistle quarantined (High-Alert Deficit -0.352 decay threshold active).',
        upvotes: 0,
      };
      setMegathreadPosts((prev) => [blockedPost, ...prev]);
      return {
        status: 'filtered-toxic' as const,
        reason: blockedPost.moderationReason!,
      };
    }

    const isAnalytical =
      lower.includes('xg') ||
      lower.includes('press') ||
      lower.includes('pivot') ||
      lower.includes('4-2-4') ||
      lower.includes('half-space') ||
      lower.includes('tactic') ||
      lower.includes('ppda');

    const status: 'verified-analysis' | 'approved-banter' = isAnalytical
      ? 'verified-analysis'
      : 'approved-banter';
    const newPost: MegathreadPost = {
      id: `mega-${Date.now()}`,
      author: user.username,
      handle: user.handle,
      clubBadge: user.favoriteClubs[0] || 'Arsenal',
      timestamp: `${activeMatch.minute}'`,
      text,
      moderationStatus: status,
      nlpStage: 'STAGE_1_BANTER_WHITELIST',
      banterIdiomMatched: matchedBanter
        ? `"${matchedBanter}"`
        : isAnalytical
        ? 'Tactical Telemetry Lexicon'
        : 'Passionate Match Reaction',
      nlpConfidence: 98.2,
      moderationReason: isAnalytical
        ? 'Stage 1 Verified Tactical Insight (+15 FanScore)'
        : matchedBanter
        ? `Stage 1 Cultural Football Banter Whitelist ("${matchedBanter}") — VALID BANTER (+10 FanScore)`
        : 'Stage 1 Approved Passionate Football Banter (+10 FanScore)',
      upvotes: 1,
    };
    setMegathreadPosts((prev) => [newPost, ...prev]);
    addFanScore(isAnalytical ? 15 : 10, newPost.moderationReason);
    return {
      status,
      reason: newPost.moderationReason!,
    };
  };

  const submitMicroPrediction = (predictionId: string, choice: 'yes' | 'no') => {
    const target = microPredictions.find((p) => p.id === predictionId);
    if (!target || target.userChoice) return;

    setMicroPredictions((prev) =>
      prev.map((p) =>
        p.id === predictionId
          ? {
              ...p,
              userChoice: choice,
              resolvedOutcome: choice,
            }
          : p
      )
    );
    setUser((prev) => {
      const nextWon = prev.predictionsWon + 1;
      const nextTotal = prev.predictionsTotal + 1;
      return {
        ...prev,
        fanScore: prev.fanScore + target.pointsReward,
        predictionsWon: nextWon,
        predictionsTotal: nextTotal,
        predictionAccuracy: Math.round((nextWon / nextTotal) * 100),
      };
    });
    triggerToast(
      `🎯 Tactical Pick'Em Challenge Won! +${target.pointsReward} Non-Monetary FanScore added to your loyalty profile.`
    );
  };

  const toggleO2ORSVP = (eventId: string) => {
    setO2OEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const nextRSVP = !ev.isRSVPed;
        triggerToast(
          nextRSVP
            ? `📍 RSVP Confirmed for "${ev.title}" at ${ev.venueName}! (+50 O2O FanScore)`
            : `RSVP cancelled for "${ev.title}".`
        );
        if (nextRSVP) {
          setUser((u) => ({ ...u, fanScore: u.fanScore + 50 }));
        }
        return {
          ...ev,
          isRSVPed: nextRSVP,
          attendeesCount: nextRSVP ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
        };
      })
    );
  };

  const applyAsCertifiedHost = (venueName: string, city: string, clubFocus: string) => {
    const newEvent: O2OEvent = {
      id: `o2o-${Date.now()}`,
      title: `${clubFocus} Official Community Watch Party & Tactical Meetup`,
      type: 'watch-party',
      city,
      distanceKm: 0.8,
      distanceMiles: 0.5,
      lat: 51.5588,
      lon: -0.1072,
      venueName,
      address: `${venueName}, ${city} Central Hub`,
      dateTime: 'This Saturday • 19:30 Kickoff',
      hostName: user.username,
      hostVerified: true,
      hostFanScore: user.fanScore + 200,
      clubFocus,
      attendeesCount: 1,
      maxCapacity: 50,
      isRSVPed: true,
      perks: [
        'Community Certified Host Event',
        'Live Scorecer Squad Audio & Big Screen Sync',
        '+100 Check-In FanScore Bonus',
      ],
    };
    setO2OEvents((prev) => [newEvent, ...prev]);
    setUser((prev) => ({
      ...prev,
      isCertifiedHost: true,
      fanScore: prev.fanScore + 200,
      badges: prev.badges.includes('Certified O2O Host')
        ? prev.badges
        : ['Certified O2O Host', ...prev.badges],
    }));
    triggerToast(
      `🏆 Congratulations! You are now a Certified Scorecer O2O Host (+200 FanScore) and your event at ${venueName} is live!`
    );
  };

  return (
    <ScorecerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        uiLanguage,
        setUiLanguage,
        user,
        sessionToken,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        registerUser,
        signInUser,
        signInWithOAuth,
        resetUserPassword,
        signOutUser,
        updateUserPreferences,
        toggleProStatus,
        toggleNotificationFilter,
        addFanScore,
        redeemReward,
        unlockPPVMatch,
        matches,
        selectedMatchId,
        setSelectedMatchId,
        activeMatch,
        isLiveEngineRunning,
        setIsLiveEngineRunning,
        isSyncingMatches,
        lastSyncedSource,
        historicalArchive: HISTORICAL_MATCH_ARCHIVE,
        syncRealMatchesFromAPI,
        importHistoricalMatch,
        players,
        passLinks,
        shotMap,
        xgTimeline,
        matchEvents,
        tacticalAlerts,
        simulateLiveGoalOrShift,
        aiHighlights,
        aiChatMessages,
        sendAIChatMessage,
        squads,
        activeSquadId,
        setActiveSquadId,
        squadMessages,
        sendSquadMessage,
        shareWidgetToSquad,
        megathreadPosts,
        submitMegathreadPost,
        microPredictions,
        submitMicroPrediction,
        rewardsCatalog: FAN_REWARDS_STORE,
        o2oEvents,
        toggleO2ORSVP,
        applyAsCertifiedHost,
        discoverClusters,
        toastMessage,
        triggerToast,
        cloudTelemetry,
        liveRagSnapshot,
        isAiStreaming,
        spoilerDelaySeconds,
        setSpoilerDelaySeconds,
        bufferedAlerts,
        isPwaInstallable,
        installPwaApp,
        shareCurrentDeepLink,
        pureTacticalMode: uiPrefsStore.pureTacticalMode,
        togglePureTacticalMode,
        activeTheme: uiPrefsStore.theme,
        setTheme: uiPrefsStore.setTheme,
        matchTelemetryState,
        dataFeedPhase,
        setDataFeedPhase,
        heartbeatCountdownSec,
        lane2SyncStatus,
        isProvisionalAttribution,
        setIsProvisionalAttribution,
        entitlements: entitlementStore,
        authStore,
        simulateMatchStatusChange,
        simulateMoneylineShift,
        isStoreReadinessOpen,
        setIsStoreReadinessOpen,
        isPaywallOpen,
        setIsPaywallOpen,
      }}
    >
      {children}
    </ScorecerContext.Provider>
  );
};

export const useScorecer = (): ScorecerContextType => {
  const ctx = useContext(ScorecerContext);
  if (!ctx) {
    throw new Error('useScorecer must be used within a ScorecerProvider');
  }
  return ctx;
};
