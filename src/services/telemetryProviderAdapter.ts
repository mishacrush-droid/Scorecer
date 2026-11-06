import {
  DataFeedTierPhase,
  PlayerRatingLedger,
  PlayerTelemetry,
  RatingLedgerContribution,
} from '../types/scorecer';

export interface TelemetryProviderTierConfig {
  id: DataFeedTierPhase;
  phaseBadge: string;
  label: string;
  titleEn: string;
  titleFr: string;
  costRange: string;
  monthlyCostRange: string;
  providers: string[];
  scoutLaneLatencyMs: number;
  targetLatencyMs: number;
  analyticalSyncDelayMs: number;
  lane1Protocol: string;
  lane2AnalyticalDepth: string;
  slaUptime: string;
  opticalTrackingFps: string;
  bookmakersCovered: string;
  architectureNoteEn: string;
  architectureNoteFr: string;
}

const PHASE_1_CONFIG: TelemetryProviderTierConfig = {
  id: 'PHASE_1_MVP',
  phaseBadge: 'PHASE 1 · LAUNCH / MVP',
  label: 'Phase 1: Launch / MVP',
  titleEn: 'API-Football / Sportmonks + OddsPapi WebSocket',
  titleFr: 'API-Football / Sportmonks + OddsPapi WebSocket',
  costRange: '$50–$300/mo',
  monthlyCostRange: '$50–$300/mo',
  providers: ['API-Football', 'Sportmonks Core', 'OddsPapi (350+ Bookmakers WS)'],
  scoutLaneLatencyMs: 690,
  targetLatencyMs: 690,
  analyticalSyncDelayMs: 2000,
  lane1Protocol: 'OddsPapi WS (<200ms Scout Push • 15s HB)',
  lane2AnalyticalDepth: 'Sportmonks Core xG + Event KDE (+2.0s)',
  slaUptime: '99.90%',
  opticalTrackingFps: 'Event-Driven + Synthetic KDE',
  bookmakersCovered: '350+ Bookmakers via OddsPapi WS',
  architectureNoteEn:
    'Server-side B2B normalization proxy hides all API keys; multiplexes fast WebSocket score/odds deltas with 2s async spatial aggregation.',
  architectureNoteFr:
    'Le proxy B2B côté serveur masque toutes les clés API et multiplexe les flux WebSocket rapides avec la synchronisation spatiale asynchrone (2s).',
};

const PHASE_2_CONFIG: TelemetryProviderTierConfig = {
  id: 'PHASE_2_GROWTH',
  phaseBadge: 'PHASE 2 · GROWTH SCALE',
  label: 'Phase 2: Growth Scale',
  titleEn: 'Sportmonks Enterprise + Goalserve / Sportbex + LSports',
  titleFr: 'Sportmonks Enterprise + Goalserve / Sportbex + LSports',
  costRange: '$500–$2,500/mo',
  monthlyCostRange: '$500–$2,500/mo',
  providers: ['Sportmonks Enterprise', 'Goalserve / Sportbex', 'LSports STM'],
  scoutLaneLatencyMs: 650,
  targetLatencyMs: 650,
  analyticalSyncDelayMs: 2000,
  lane1Protocol: 'LSports STM Sub-Second WS (15s HB)',
  lane2AnalyticalDepth: 'Goalserve + Sportmonks 25Hz Mesh (+2.0s)',
  slaUptime: '99.95%',
  opticalTrackingFps: '25Hz Sub-Second Event Mesh',
  bookmakersCovered: '400+ Global Feeds + 3-Way Moneyline',
  architectureNoteEn:
    'Dedicated edge WebSocket worker cluster with 15s heartbeat pings and automatic failover between Sportmonks Enterprise and Goalserve.',
  architectureNoteFr:
    'Cluster WebSocket Edge dédié avec ping heartbeat toutes les 15s et bascule automatique entre Sportmonks Enterprise et Goalserve.',
};

const PHASE_3_CONFIG: TelemetryProviderTierConfig = {
  id: 'PHASE_3_ENTERPRISE',
  phaseBadge: 'PHASE 3 · ENTERPRISE SCALE',
  label: 'Phase 3: Enterprise Scale',
  titleEn: 'Stats Perform (Opta Dynamic) + Sportradar + Genius RunningBall',
  titleFr: 'Stats Perform (Opta Dynamic) + Sportradar + Genius RunningBall',
  costRange: 'Custom Enterprise Contract',
  monthlyCostRange: 'Enterprise Contract',
  providers: [
    'Stats Perform (Opta Dynamic Stats API)',
    'Sportradar (Betradar)',
    'Genius Sports (RunningBall + Second Spectrum)',
  ],
  scoutLaneLatencyMs: 185,
  targetLatencyMs: 680,
  analyticalSyncDelayMs: 2000,
  lane1Protocol: 'RunningBall Scout Socket (<200ms • 15s HB)',
  lane2AnalyticalDepth: 'Opta Dynamic XY Matrix + Second Spectrum (+2.0s)',
  slaUptime: '99.99%',
  opticalTrackingFps: '25fps Second Spectrum Optical Skeleton',
  bookmakersCovered: 'Tier-1 Betradar + RunningBall Scout Feed',
  architectureNoteEn:
    'Lane 1 (<200ms RunningBall scout socket) triggers 0.68s client updates; Lane 2 streams Opta Dynamic pass adjacency matrices & xGOT 2.0s asynchronously.',
  architectureNoteFr:
    'Voie 1 (<200ms RunningBall scout) livre le score en 0.68s ; Voie 2 diffuse les matrices de passes Opta Dynamic et xGOT 2.0s en asynchrone.',
};

export const TELEMETRY_PROVIDER_PHASES: Record<
  DataFeedTierPhase,
  TelemetryProviderTierConfig
> = {
  PHASE_1_MVP: PHASE_1_CONFIG,
  PHASE_2_GROWTH: PHASE_2_CONFIG,
  PHASE_3_ENTERPRISE: PHASE_3_CONFIG,
  'phase-1-mvp': { ...PHASE_1_CONFIG, id: 'phase-1-mvp' },
  'phase-2-growth': { ...PHASE_2_CONFIG, id: 'phase-2-growth' },
  'phase-3-enterprise': { ...PHASE_3_CONFIG, id: 'phase-3-enterprise' },
};

export interface CompetitorBenchmarkItem {
  name: string;
  platform: string;
  latencySec: number;
  latencySeconds: number;
  latencyLabel: string;
  isScorecer?: boolean;
  highlight?: boolean;
  isOutlier?: boolean;
  architecture: string;
  tacticalDepth: string;
  socialArchitecture: string;
  statsDepthEn: string;
  statsDepthFr: string;
  aiAndSocialEn: string;
  aiAndSocialFr: string;
  adExperienceEn: string;
  adExperienceFr: string;
}

export const COMPETITOR_BENCHMARKS_2026: CompetitorBenchmarkItem[] = [
  {
    name: 'Scorecer (2026)',
    platform: 'Scorecer (2026)',
    latencySec: 0.7,
    latencySeconds: 0.7,
    latencyLabel: '0.7s (680ms Edge)',
    isScorecer: true,
    highlight: true,
    architecture: 'Dual-Lane Edge WebSocket (<200ms Scout + 2s Opta XY)',
    tacticalDepth: '3-Layer Skia Pitch + Explainable 22-Player Rating Ledger',
    socialArchitecture: 'LiveKit WebRTC SFU Squads + 2-Stage NLP Shield + PostGIS O2O',
    statsDepthEn:
      'Opta-grade 3-Layer Pitch + Explainable Rating Ledger (200+ leagues)',
    statsDepthFr:
      'Terrain 3 couches Opta + Registre de Notes Explicable (200+ ligues)',
    aiAndSocialEn:
      'Grounded RAG + Cartesia Sonic-3.6 TTS + LiveKit Squads + PostGIS O2O',
    aiAndSocialFr:
      'RAG ancré + Audio Cartesia Sonic-3.6 + Squads LiveKit + O2O PostGIS',
    adExperienceEn: 'Zero intrusive live match ads + Pure Tactical Mode toggle',
    adExperienceFr:
      'Zéro pub intrusive en direct + Mode Pur Tactique en 1 clic',
  },
  {
    name: 'Flashscore',
    platform: 'Flashscore',
    latencySec: 0.8,
    latencySeconds: 0.8,
    latencyLabel: '0.8s',
    architecture: 'Fast Score Push • 31 Core Stats Only',
    tacticalDepth: '31 core match stats, basic goals/assists/cards, limited outside top 5 leagues',
    socialArchitecture: 'No Squad voice rooms, heavy betting banner promotions',
    statsDepthEn:
      '31 core match stats, basic player stats (goals/assists/cards), limited outside top 5 leagues',
    statsDepthFr:
      '31 stats de base, stats joueurs simples (buts/passes/cartons), limité hors Top 5 européen',
    aiAndSocialEn: 'No conversational RAG assistant, no Squad voice rooms',
    aiAndSocialFr:
      'Aucun assistant IA conversationnel, pas de salons vocaux Squad',
    adExperienceEn: 'Heavy betting banner promotions across match views',
    adExperienceFr:
      'Bannières de paris sportifs omniprésentes sur les fiches de match',
  },
  {
    name: 'FotMob',
    platform: 'FotMob',
    latencySec: 1.0,
    latencySeconds: 1.0,
    latencyLabel: '1.0s',
    architecture: '12 Sports • Deep Stats across 19–21 Major Leagues',
    tacticalDepth: 'Unmatched tactical depth across 19–21 major leagues, clean match UI',
    socialArchitecture: 'Zero live match predictions, no native Squad voice rooms',
    statsDepthEn:
      'Unmatched tactical depth across 19–21 major leagues (12 sports total)',
    statsDepthFr:
      'Profondeur tactique de référence sur 19–21 ligues majeures (12 sports)',
    aiAndSocialEn:
      'Zero live match predictions, no native Squad voice rooms or AI commentary',
    aiAndSocialFr:
      'Zéro défi pronostic en direct, pas de salons vocaux Squad ni commentaire IA',
    adExperienceEn:
      'Clean match interface with zero intrusive live match banner ads',
    adExperienceFr:
      'Interface de match épurée sans bannières publicitaires intrusives',
  },
  {
    name: 'Tiki Taka',
    platform: 'Tiki Taka',
    latencySec: 1.1,
    latencySeconds: 1.1,
    latencyLabel: '1.1s',
    architecture: 'Football-Only • 28 Standard Match Stats',
    tacticalDepth: '28 standard match stats, dedicated AI predictions',
    socialArchitecture: 'Telegram bot integration, no native WebRTC voice rooms',
    statsDepthEn:
      '28 standard match stats, football-only, no advanced spatial pitch maps',
    statsDepthFr:
      '28 stats standards, football uniquement, sans cartes spatiales avancées',
    aiAndSocialEn:
      'Dedicated AI predictions & Telegram integration, no native WebRTC voice',
    aiAndSocialFr:
      'Prédictions IA dédiées & intégration Telegram, sans salon vocal natif',
    adExperienceEn: 'Subscription prompts & prediction upsells',
    adExperienceFr: 'Incitations fréquentes à l’abonnement',
  },
  {
    name: 'SofaScore',
    platform: 'SofaScore',
    latencySec: 1.2,
    latencySeconds: 1.2,
    latencyLabel: '1.2s',
    architecture: '22 Sports / 24 Leagues • Black-Box Player Ratings',
    tacticalDepth: 'Industry-standard player ratings (black-box), third-party odds only',
    socialArchitecture: 'Unmoderated public chat clutter, heavy ad complaints',
    statsDepthEn:
      '22 sports / 24 football leagues, industry-standard black-box player ratings',
    statsDepthFr:
      '22 sports / 24 ligues, notes de joueurs standards mais non explicables',
    aiAndSocialEn: 'Third-party odds only, unmoderated public chat clutter',
    aiAndSocialFr:
      'Cotes tierces uniquement, chat public saturé sans modération IA',
    adExperienceEn:
      'Cluttered UI with heavy full-screen ad complaints in free tier',
    adExperienceFr:
      'Interface dense avec de nombreuses plaintes liées aux publicités en version gratuite',
  },
];

export const SLEEPER_OUTLIER_CALLOUT = {
  platform: 'Sleeper (Social Fantasy App)',
  latencyLabel: 'Up to 15-Min (900,000ms) Delay',
  reason:
    'Suffers from up to 15-minute scoring delays during peak European fixtures, unresponsive swipe navigation (<30fps frame drops), heavy battery drain, and intrusive real-money wallet headers.',
  titleEn:
    'OUTLIER WARNING: Why Competing Social Apps Like Sleeper Fail Football Purists',
  titleFr:
    'ALERTE PERFORMANCE : Pourquoi les applications comme Sleeper déçoivent les puristes',
  metricsEn: [
    'Up to 15-minute (900s) scoring ticker delays during peak weekend fixtures',
    'Unresponsive swipe navigation & severe frame drops (<30fps) from unoptimized React trees',
    'Heavy background battery drain & intrusive gambling wallet headers blocking match navigation',
  ],
  metricsFr: [
    'Jusqu’à 15 minutes (900s) de retard sur les scores lors des grands matchs du week-end',
    'Navigation tactile lente et chutes de framerate (<30fps)',
    'Forte consommation de batterie et en-têtes de portefeuilles de paris intrusifs',
  ],
};

/**
 * Generates an Explainable ML Player Rating Ledger ("Rating Delta Ledger")
 * for any of the 22 players on the pitch so ratings are never a black box.
 */
export function buildPlayerRatingLedger(
  player: PlayerTelemetry,
  currentMinute: number
): PlayerRatingLedger {
  const baseRating = 6.5;
  const targetDelta = Number((player.rating - baseRating).toFixed(2));

  const isAttacker = ['RW', 'LW', 'ST', 'CAM'].includes(player.position);
  const isMidfielder = ['CDM', 'RCM', 'LCM', 'CM', 'RB/RM'].includes(
    player.position
  );
  const isKeeper = player.position === 'GK';

  const contributions: RatingLedgerContribution[] = [];

  if (isKeeper) {
    contributions.push(
      {
        id: 'c-gk-1',
        minute: 74,
        label: 'Post-Shot xG Prevented (PSxG - GA)',
        labelFr: 'Buts évités selon xG cadrés (PSxG)',
        delta: +0.68,
        detail:
          '3 reflex saves (+0.58 PSxG prevented vs 104 km/h transition shot)',
        detailFr:
          '3 arrêts réflexes (+0.58 PSxG évité sur frappe à 104 km/h)',
        type: 'positive',
      },
      {
        id: 'c-gk-2',
        minute: 58,
        label: 'Press-Resistant Distribution Accuracy',
        labelFr: 'Relances précises sous pression',
        delta: +0.34,
        detail: `${player.passesCompleted} completed passes (${player.passAccuracy}% accuracy)`,
        detailFr: `${player.passesCompleted} passes réussies (${player.passAccuracy}% de précision)`,
        type: 'positive',
      },
      {
        id: 'c-gk-3',
        minute: 41,
        label: 'Long Goal-Kick Turnover in Middle Third',
        labelFr: 'Relance longue interceptée au milieu',
        delta: -0.12,
        detail: '1 contested aerial ball lost in Zone 8',
        detailFr: '1 duel aérien perdu en Zone 8',
        type: 'negative',
      }
    );
  } else if (isAttacker) {
    const goalBonus = player.xg >= 0.4 ? +0.85 : +0.42;
    contributions.push(
      {
        id: 'c-att-1',
        minute: 67,
        label:
          player.xg >= 0.4
            ? `Goal / High-Value Shot Execution (${player.xg.toFixed(2)} xG)`
            : `Expected Threat & Shot Creation (${player.xg.toFixed(2)} xG)`,
        labelFr:
          player.xg >= 0.4
            ? `But / Finition à haute valeur (${player.xg.toFixed(2)} xG)`
            : `Menace offensive & création de tirs (${player.xg.toFixed(2)} xG)`,
        delta: goalBonus,
        detail: `Generated ${(player.xg * 1.12).toFixed(
          2
        )} xGOT from half-space entries`,
        detailFr: `${(player.xg * 1.12).toFixed(
          2
        )} xGOT générés depuis le demi-espace`,
        type: 'positive',
      },
      {
        id: 'c-att-2',
        minute: 62,
        label: 'Progressive Passes & Cutbacks into Zone 14',
        labelFr: 'Passes progressives & centres en retrait (Zone 14)',
        delta: +0.58,
        detail: `${Math.max(
          4,
          Math.round(player.passesCompleted * 0.18)
        )}/${Math.max(
          5,
          Math.round(player.passesCompleted * 0.21)
        )} completed (${player.xa.toFixed(2)} xA created)`,
        detailFr: `${Math.max(
          4,
          Math.round(player.passesCompleted * 0.18)
        )} passes clés réussies (${player.xa.toFixed(2)} xA)`,
        type: 'positive',
      },
      {
        id: 'c-att-3',
        minute: 51,
        label: 'High-Press Ball Recoveries in Final Third',
        labelFr: 'Récupérations hautes au pressing',
        delta: +0.31,
        detail: `${Math.max(
          2,
          Math.round(player.pressures * 0.22)
        )} counter-press regains within 5s`,
        detailFr: `${Math.max(
          2,
          Math.round(player.pressures * 0.22)
        )} ballons grattés en moins de 5s`,
        type: 'positive',
      },
      {
        id: 'c-att-4',
        minute: 48,
        label: 'Unsuccessful 1v1 Take-On / Dispossessed',
        labelFr: 'Duel 1 contre 1 perdu / Ballon rendu',
        delta: -0.18,
        detail: '2 take-ons closed down by double-team cover',
        detailFr: '2 dribbles stoppés par une prise à deux',
        type: 'negative',
      },
      {
        id: 'c-att-5',
        minute: 33,
        label: 'Offside / Incomplete Final-Third Switch',
        labelFr: 'Passe interceptée dans les 30 derniers mètres',
        delta: -0.12,
        detail: `${
          100 - player.passAccuracy
        }% pass incompletion under high pressure`,
        detailFr: `${100 - player.passAccuracy}% de déchet sous haute pression`,
        type: 'negative',
      }
    );
  } else if (isMidfielder) {
    contributions.push(
      {
        id: 'c-mid-1',
        minute: 71,
        label: 'Line-Breaking Progressive Passes into Final Third',
        labelFr: 'Passes cassant les lignes vers le dernier tiers',
        delta: +0.74,
        detail: `${Math.round(player.passesCompleted * 0.24)}/${Math.round(
          player.passesCompleted * 0.27
        )} completed (${player.passAccuracy}% overall pass accuracy)`,
        detailFr: `${Math.round(
          player.passesCompleted * 0.24
        )} passes verticales réussies (${player.passAccuracy}% global)`,
        type: 'positive',
      },
      {
        id: 'c-mid-2',
        minute: 64,
        label: 'Zone 14 Counter-Pressing Ball Recoveries',
        labelFr: 'Récupérations au contre-pressing en Zone 14',
        delta: +0.56,
        detail: `${Math.max(
          4,
          Math.round(player.pressures * 0.3)
        )} ball recoveries (${player.pressures} total pressures)`,
        detailFr: `${Math.max(
          4,
          Math.round(player.pressures * 0.3)
        )} ballons récupérés (${player.pressures} pressions)`,
        type: 'positive',
      },
      {
        id: 'c-mid-3',
        minute: 54,
        label: 'Expected Assists & Secondary Shot Chains (xA)',
        labelFr: 'Passes décisives attendues & avant-dernières passes (xA)',
        delta: +0.42,
        detail: `+${(player.xa + player.xg).toFixed(
          2
        )} combined xG + xA contribution`,
        detailFr: `+${(player.xa + player.xg).toFixed(
          2
        )} contribution xG + xA cumulée`,
        type: 'positive',
      },
      {
        id: 'c-mid-4',
        minute: 43,
        label: 'Possession Lost in Central Transition Zone',
        labelFr: 'Perte de balle dans la zone de transition axiale',
        delta: -0.18,
        detail: '1 vertical pass intercepted during opposition mid-block trap',
        detailFr: '1 passe verticale interceptée par le bloc médian',
        type: 'negative',
      },
      {
        id: 'c-mid-5',
        minute: 29,
        label: 'Unsuccessful Ground Duel',
        labelFr: 'Duel au sol non remporté',
        delta: -0.12,
        detail: '1 tactical foul / late challenge in midfield',
        detailFr: '1 duel en retard au milieu de terrain',
        type: 'negative',
      }
    );
  } else {
    // Defenders
    contributions.push(
      {
        id: 'c-def-1',
        minute: 69,
        label: 'Build-Up Progression & Press Evasion',
        labelFr: 'Relance propre & sortie de pressing',
        delta: +0.58,
        detail: `${player.passesCompleted} completed passes (${player.passAccuracy}% accuracy, ${player.touches} touches)`,
        detailFr: `${player.passesCompleted} passes réussies (${player.passAccuracy}% de précision, ${player.touches} ballons)`,
        type: 'positive',
      },
      {
        id: 'c-def-2',
        minute: 57,
        label: 'Defensive Third Interceptions & 1v1 Duels Won',
        labelFr: 'Interceptions défensives & duels 1v1 gagnés',
        delta: +0.52,
        detail: `${Math.max(
          3,
          Math.round(player.pressures * 0.35)
        )} clean recoveries halting box entries`,
        detailFr: `${Math.max(
          3,
          Math.round(player.pressures * 0.35)
        )} récupérations nettes devant la surface`,
        type: 'positive',
      },
      {
        id: 'c-def-3',
        minute: 46,
        label: 'Possession Lost in Defensive Third',
        labelFr: 'Perte de balle dans le tiers défensif',
        delta: -0.18,
        detail: '1 clearance forced under aggressive 4-2-4 press',
        detailFr: '1 dégagement sous la pression du 4-2-4 adverse',
        type: 'negative',
      },
      {
        id: 'c-def-4',
        minute: 22,
        label: 'Unsuccessful Ground / Aerial Duel',
        labelFr: 'Duel au sol ou aérien perdu',
        delta: -0.12,
        detail: '1 half-space channel run conceded',
        detailFr: '1 appel concédé dans le demi-espace',
        type: 'negative',
      }
    );
  }

  // Reconcile the exact sum so Base (6.50) + Contributions === Current Rating
  const currentSum = contributions.reduce((acc, item) => acc + item.delta, 0);
  const residual = Number((targetDelta - currentSum).toFixed(2));
  if (Math.abs(residual) >= 0.01 && contributions.length > 0) {
    contributions[0] = {
      ...contributions[0],
      delta: Number((contributions[0].delta + residual).toFixed(2)),
    };
  }

  const positiveContributions = contributions.filter(
    (c) => c.type === 'positive'
  );
  const negativeDeductions = contributions.filter((c) => c.type === 'negative');

  // Build Minute-by-Minute Trajectory Sparkline from 00:00' to currentMinute
  const steps = [
    0,
    15,
    30,
    45,
    60,
    Math.max(65, currentMinute - 6),
    currentMinute,
  ];
  const sparkline = steps.map((min, idx) => {
    if (min === 0) return { minute: 0, rating: 6.5 };
    if (idx === steps.length - 1) {
      return { minute: currentMinute, rating: Number(player.rating.toFixed(2)) };
    }
    const progress = idx / (steps.length - 1);
    const wave = Math.sin(idx * 1.4 + player.number) * 0.14;
    const interpolated = Number(
      Math.max(
        5.8,
        Math.min(9.9, baseRating + targetDelta * progress + wave)
      ).toFixed(2)
    );
    return { minute: min, rating: interpolated };
  });

  return {
    playerId: player.id,
    baseRating,
    currentRating: Number(player.rating.toFixed(2)),
    contributions,
    positiveContributions,
    negativeDeductions,
    sparkline,
  };
}
