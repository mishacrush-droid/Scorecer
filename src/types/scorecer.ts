export type ActiveTab =
  | 'vision'
  | 'match-center'
  | 'ai-hub'
  | 'social-squads'
  | 'o2o-local'
  | 'discover';

export type CommentatorPersona = 'tactical-analyst' | 'passionate-fan' | 'neutral-broadcaster';

export type CommentaryLanguage = 'en' | 'fr' | 'es' | 'ja' | 'ar' | 'pt' | 'de';

export type UILanguage = 'en' | 'fr';
export type AuthModalMode = 'signup' | 'signin' | 'profile';

export interface NotificationFilters {
  goals: boolean;
  redCards: boolean;
  tacticalShifts: boolean;
  xgSpikes: boolean;
  fullTime: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  handle: string;
  email: string;
  avatarColor: string;
  isRegistered: boolean;
  isPro: boolean;
  fanScore: number;
  predictionAccuracy: number;
  predictionsWon: number;
  predictionsTotal: number;
  favoriteClubs: string[];
  favoriteLeagues: string[];
  nationalSquad: string;
  defaultPersona: CommentatorPersona;
  defaultLanguage: CommentaryLanguage;
  gdprZeroPartyOptIn: boolean;
  gdprGeoOptIn: boolean;
  unlockedPPVMatches: string[];
  redeemedRewards: string[];
  badges: string[];
  notificationFilters: NotificationFilters;
  isCertifiedHost: boolean;
}

export interface PlayerTelemetry {
  id: string;
  name: string;
  number: number;
  team: 'home' | 'away';
  position: string;
  x: number; // 0-100 pitch coordinate
  y: number; // 0-100 pitch coordinate
  rating: number; // e.g., 6.1 - 9.8
  ratingDelta: number; // e.g., +0.3 or -0.2
  xg: number;
  xa: number;
  passesCompleted: number;
  passAccuracy: number;
  touches: number;
  pressures: number;
  heatmapRadius: number;
  isKeyPlayer?: boolean;
  subbedInMinute?: number;
}

export interface PassLink {
  fromPlayerId: string;
  toPlayerId: string;
  team: 'home' | 'away';
  count: number; // determines stroke thickness
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ShotPoint {
  id: string;
  minute: number;
  player: string;
  team: 'home' | 'away';
  x: number;
  y: number;
  xg: number;
  outcome: 'goal' | 'saved' | 'blocked' | 'off-target';
}

export interface XGDataPoint {
  minute: number;
  homeXG: number;
  awayXG: number;
  momentum: number; // -100 (away dominance) to +100 (home dominance)
  eventLabel?: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  second: number;
  type: 'goal' | 'card-yellow' | 'card-red' | 'sub' | 'tactical-shift' | 'xg-chance';
  team: 'home' | 'away';
  title: string;
  detail: string;
  xgAdded?: number;
}

export interface TacticalShiftAlert {
  id: string;
  minute: number;
  team: 'home' | 'away';
  headline: string;
  explanation: string;
  formationBefore: string;
  formationAfter: string;
  metricChange: string;
}

export interface LiveMatch {
  id: string;
  competition: string;
  country: string;
  stadium: string;
  homeTeam: string;
  homeShort: string;
  homeColor: string;
  awayTeam: string;
  awayShort: string;
  awayColor: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  second: number;
  status: 'LIVE' | 'HT' | 'FT' | 'UPCOMING';
  latencyMs: number; // e.g. 680ms (0.68s)
  homeXG: number;
  awayXG: number;
  homeXA: number;
  awayXA: number;
  homePossession: number;
  awayPossession: number;
  homePPDA: number;
  awayPPDA: number;
  homeFormation: string;
  awayFormation: string;
  winProbability: {
    home: number;
    draw: number;
    away: number;
    aiReason: string;
  };
  ppvPrice: string;
  ppvPointsCost: number;
  isFeatured?: boolean;
}

export interface AIHighlightClip {
  id: string;
  matchId: string;
  minute: number;
  title: string;
  player: string;
  team: 'home' | 'away';
  category: 'goal' | 'tactical-press' | 'transition' | 'save' | 'skill';
  crowdDecibels: number; // e.g. 114 dB
  commentatorExcitement: number; // 0-100
  cvConfidence: number; // e.g. 99.4%
  generationTimeSec: number; // e.g. 2.4s
  duration: string;
  xgValue?: number;
  tacticalTag: string;
  description: string;
  accentColor: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'scorecer-ai';
  timestamp: string;
  text: string;
  telemetryCitations?: string[];
  embeddedClipId?: string;
  tacticalDiagramType?: 'high-press' | 'overload-right' | 'low-block-break';
}

export interface SharedLiveWidget {
  type: 'xg-chart' | 'player-rating' | 'ai-highlight' | 'win-prob';
  title: string;
  subtitle: string;
  metricPrimary: string;
  metricSecondary: string;
  accentColor: string;
  clipId?: string;
}

export interface SquadMessage {
  id: string;
  squadId: string;
  author: string;
  authorHandle: string;
  avatarColor: string;
  timestamp: string;
  text: string;
  isPro?: boolean;
  widget?: SharedLiveWidget;
  reactions: { emoji: string; count: number }[];
}

export interface SquadGroup {
  id: string;
  name: string;
  clubTag: string;
  memberCount: number;
  onlineCount: number;
  unreadCount: number;
  activeVoiceMembers: {
    name: string;
    avatarColor: string;
    isSpeaking: boolean;
  }[];
}

export interface MegathreadPost {
  id: string;
  author: string;
  handle: string;
  clubBadge: string;
  timestamp: string;
  text: string;
  moderationStatus: 'approved-banter' | 'verified-analysis' | 'filtered-toxic';
  nlpConfidence: number;
  moderationReason?: string;
  upvotes: number;
}

export interface MicroPrediction {
  id: string;
  matchMinute: string;
  question: string;
  contextMetric: string;
  sponsorName: string;
  pointsReward: number;
  yesOddsPct: number;
  noOddsPct: number;
  userChoice?: 'yes' | 'no';
  resolvedOutcome?: 'yes' | 'no';
}

export interface FanRewardItem {
  id: string;
  title: string;
  description: string;
  costPoints: number;
  category: 'streaming' | 'ad-free' | 'cosmetic' | 'vip';
  badgeText: string;
}

export interface O2OEvent {
  id: string;
  title: string;
  type: 'watch-party' | 'pickup-game' | 'supporters-pub';
  city: string;
  distanceKm: number;
  venueName: string;
  address: string;
  dateTime: string;
  hostName: string;
  hostVerified: boolean;
  hostFanScore: number;
  clubFocus: string;
  attendeesCount: number;
  maxCapacity: number;
  isRSVPed: boolean;
  perks: string[];
}

export interface DeduplicatedStoryCluster {
  id: string;
  category: 'Transfer Intelligence' | 'Tactical Breakdown' | 'Injury Radar' | 'Club D2C';
  headline: string;
  aiSummary: string;
  mergedArticlesCount: number;
  reliabilityScore: number; // 0-100
  updatedAgo: string;
  clubsInvolved: string[];
  sources: {
    publisher: string;
    tier: 'Tier 1' | 'Tier 2' | 'Aggregator';
    timestamp: string;
    angle: string;
  }[];
}
