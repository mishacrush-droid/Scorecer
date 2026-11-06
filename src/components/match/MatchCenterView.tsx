import React, { useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Check,
  Cpu,
  Crosshair,
  Flame,
  Info,
  Lock,
  MessageSquare,
  Pause,
  Play,
  Share2,
  Smartphone,
  Sparkles,
  TrendingUp,
  Tv,
  Unlock,
  Volume2,
  VolumeX,
  X,
  Zap,
  Clock,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { DataFeedTierPhase, MatchEvent, PlayerTelemetry, ShotPoint } from '../../types/scorecer';
import { RealMatchDataImporter } from './RealMatchDataImporter';
import { NativeLockScreenSimulatorHUD } from './NativeLockScreenSimulatorHUD';
import {
  TELEMETRY_PROVIDER_PHASES,
  buildPlayerRatingLedger,
} from '../../services/telemetryProviderAdapter';

type PitchLayerMode = 'pass-network' | 'heatmap' | 'shot-map';
type StreamAspectRatio = '16:9' | '9:16' | '1:1';

export const MatchCenterView: React.FC = () => {
  const {
    user,
    matches,
    selectedMatchId,
    setSelectedMatchId,
    activeMatch,
    players,
    passLinks,
    shotMap,
    xgTimeline,
    matchEvents,
    simulateLiveGoalOrShift,
    unlockPPVMatch,
    shareWidgetToSquad,
    setActiveTab,
    uiLanguage,
    pureTacticalMode,
    dataFeedPhase,
    setDataFeedPhase,
    heartbeatCountdownSec,
    lane2SyncStatus,
    isProvisionalAttribution,
    setIsProvisionalAttribution,
    setIsPaywallOpen,
    simulateMatchStatusChange,
    simulateMoneylineShift,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  const [pitchMode, setPitchMode] = useState<PitchLayerMode>('pass-network');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('p-h9'); // Bukayo Saka default
  const [isRatingDrawerOpen, setIsRatingDrawerOpen] = useState<boolean>(false);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [streamAspect, setStreamAspect] = useState<StreamAspectRatio>('16:9');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [eventFilter, setEventFilter] = useState<'all' | 'goal' | 'tactical-shift'>('all');
  const [showProvisionalExplainer, setShowProvisionalExplainer] = useState<boolean>(false);

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setIsRatingDrawerOpen(true);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isPPVUnlocked = user.unlockedPPVMatches.includes(activeMatch.id);

  const selectedPlayer: PlayerTelemetry = useMemo(() => {
    return players.find((p) => p.id === selectedPlayerId) || players[8] || players[0];
  }, [players, selectedPlayerId]);

  const playerLedger = useMemo(() => {
    return buildPlayerRatingLedger(selectedPlayer, activeMatch.minute);
  }, [selectedPlayer, activeMatch.minute]);

  const activeProviderConfig = TELEMETRY_PROVIDER_PHASES[dataFeedPhase];

  const selectedShot: ShotPoint | null = useMemo(() => {
    if (!selectedShotId) return shotMap[shotMap.length - 1] || null;
    return shotMap.find((s) => s.id === selectedShotId) || null;
  }, [shotMap, selectedShotId]);

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return matchEvents.slice(0, 6);
    return matchEvents.filter((e) => e.type === eventFilter).slice(0, 6);
  }, [matchEvents, eventFilter]);

  const handleTogglePlay = () => {
    const vid = videoRef.current;
    if (!vid) {
      setIsVideoPlaying(!isVideoPlaying);
      return;
    }
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsVideoPlaying(true);
    } else {
      vid.pause();
      setIsVideoPlaying(false);
    }
  };

  // Bilingual plain-language Win Likelihood explanation
  const getWinLikelihoodExplanation = (): string => {
    if (!isFr) {
      if (activeMatch.id === 'match-ucl-01') {
        return `Arsenal control the right half-space and have limited Real Madrid to ${activeMatch.awayXG.toFixed(
          2
        )} xG despite their late attacking push.`;
      }
      if (activeMatch.id === 'match-seria-02') {
        return `Inter Milan are pinning Napoli back through fluid wing-backs, creating the clearer chances (${activeMatch.homeXG.toFixed(
          2
        )} vs ${activeMatch.awayXG.toFixed(2)} xG).`;
      }
      return `Leverkusen's compact mid-block is protecting their lead after clinical transition finishing (${activeMatch.homeXG.toFixed(
        2
      )} xG).`;
    }

    if (activeMatch.id === 'match-ucl-01') {
      return `Arsenal maîtrise le demi-espace droit et limite le Real Madrid à ${activeMatch.awayXG.toFixed(
        2
      )} xG malgré leur poussée offensive en fin de match.`;
    }
    if (activeMatch.id === 'match-seria-02') {
      return `L'Inter Milan fait reculer Naples grâce à ses pistons très hauts, se créant les occasions les plus franches (${activeMatch.homeXG.toFixed(
        2
      )} contre ${activeMatch.awayXG.toFixed(2)} xG).`;
    }
    return `Le bloc compact de Leverkusen protège son avantage après des transitions offensives chirurgicales (${activeMatch.homeXG.toFixed(
      2
    )} xG).`;
  };

  // Bilingual competition name
  const getLocalizedCompetition = (comp: string): string => {
    if (!isFr) return comp;
    return comp
      .replace('Quarter-Final', 'Quart de finale')
      .replace('Direct D2C Partner Stream', 'Diffusion directe partenaire')
      .replace('Matchday', 'Journée');
  };

  // Bilingual position label
  const getLocalizedPosition = (pos: string): string => {
    if (!isFr) return pos;
    const map: Record<string, string> = {
      GK: 'Gardien (GB)',
      RB: 'Latéral Droit (DD)',
      LB: 'Latéral Gauche (DG)',
      CB: 'Défenseur Central (DC)',
      CDM: 'Milieu Défensif (MDC)',
      RCM: 'Milieu Relayeur Droit',
      LCM: 'Milieu Relayeur Gauche',
      CM: 'Milieu Central (MC)',
      CAM: 'Milieu Offensif (MOC)',
      RW: 'Ailier Droit (AD)',
      LW: 'Ailier Gauche (AG)',
      ST: 'Avant-Centre (BU)',
      'RB/RM': 'Piston Droit (DD/MD)',
    };
    return map[pos] || pos;
  };

  // Bilingual event translation helper
  const getLocalizedEvent = (ev: MatchEvent): { title: string; detail: string; badge: string } => {
    if (!isFr) {
      const badgeMap: Record<MatchEvent['type'], string> = {
        goal: 'GOAL',
        'tactical-shift': 'TACTICAL SHIFT',
        sub: 'SUBSTITUTION',
        'xg-chance': 'BIG CHANCE',
        'card-yellow': 'YELLOW CARD',
        'card-red': 'RED CARD',
        'var-review': 'VAR REVIEW',
      };
      return {
        title: ev.title,
        detail: ev.detail,
        badge: badgeMap[ev.type] || 'KEY MOMENT',
      };
    }

    const frBadgeMap: Record<MatchEvent['type'], string> = {
      goal: 'BUT',
      'tactical-shift': 'TACTIQUE IA',
      sub: 'REMPLACEMENT',
      'xg-chance': 'OCCASION CLÉ',
      'card-yellow': 'CARTON JAUNE',
      'card-red': 'CARTON ROUGE',
      'var-review': 'RÉVISION VAR',
    };

    if (ev.id === 'ev-1') {
      return {
        title: 'Frappe de transition sauvée (0.31 xG)',
        detail: 'Vinicius Jr repique dans le demi-espace ; Raya repousse en corner.',
        badge: frBadgeMap[ev.type],
      };
    }
    if (ev.id === 'ev-2') {
      return {
        title: 'ALERTE TACTIQUE : Le Real Madrid passe en 4-2-4',
        detail: 'Entrée de Modric ; +40% de centres sur les 5 dernières minutes.',
        badge: frBadgeMap[ev.type],
      };
    }
    if (ev.id === 'ev-3') {
      return {
        title: 'BUT ! Kai Havertz (2-1 Arsenal)',
        detail: 'Centre en retrait de B. Saka • 0.64 xG • Clameur du stade à 114 dB.',
        badge: frBadgeMap[ev.type],
      };
    }
    if (ev.id === 'ev-4') {
      return {
        title: 'Ajustement défensif (Remplacement)',
        detail: 'Sortie de Militão ; la ligne défensive recule de 6,5 mètres.',
        badge: frBadgeMap[ev.type],
      };
    }
    if (ev.id === 'ev-5') {
      return {
        title: 'BUT ! Kylian Mbappé (1-1 Real Madrid)',
        detail: 'Passe verticale de Bellingham en contre-attaque • 0.51 xG.',
        badge: frBadgeMap[ev.type],
      };
    }
    if (ev.id === 'ev-6') {
      return {
        title: 'BUT ! Bukayo Saka (1-0 Arsenal)',
        detail: 'Passe masquée d’Odegaard dans l’intervalle • Enroulé petit filet • 0.42 xG.',
        badge: frBadgeMap[ev.type],
      };
    }

    // Simulated events fallback translation
    return {
      title: ev.title
        .replace('GOAL!', 'BUT !')
        .replace('AI TACTICAL ALERT:', 'ALERTE TACTIQUE IA :')
        .replace('shift to', 'passe en'),
      detail: ev.detail
        .replace('Sub-second 0.68s WebSocket push', 'Flux direct 0.68s')
        .replace('Roar Spike auto-clipped by CV.', 'Extrait vidéo généré par IA.')
        .replace('Central progression', 'Progression axiale')
        .replace('Opposition high press neutralized.', 'Pressing adverse neutralisé.'),
      badge: frBadgeMap[ev.type],
    };
  };

  const handleSharePlayerToSquad = () => {
    shareWidgetToSquad({
      type: 'player-rating',
      title: `${selectedPlayer.name} (#${selectedPlayer.number})`,
      subtitle: `${getLocalizedPosition(selectedPlayer.position)} · ${
        selectedPlayer.team === 'home' ? activeMatch.homeTeam : activeMatch.awayTeam
      } (${activeMatch.minute}')`,
      metricPrimary: `${selectedPlayer.rating.toFixed(1)} ${
        isFr ? 'Note Live' : 'Live Rating'
      } (${
        selectedPlayer.ratingDelta >= 0
          ? `+${selectedPlayer.ratingDelta.toFixed(1)}`
          : selectedPlayer.ratingDelta.toFixed(1)
      })`,
      metricSecondary: `${selectedPlayer.xg.toFixed(2)} xG · ${selectedPlayer.xa.toFixed(
        2
      )} xA · ${selectedPlayer.passAccuracy}% ${isFr ? 'Passes' : 'Pass Acc'}`,
      accentColor: '#B8FF01',
    });
  };

  const handleShareMomentumToSquad = () => {
    shareWidgetToSquad({
      type: 'xg-chart',
      title: `${activeMatch.homeShort} ${activeMatch.homeScore} — ${activeMatch.awayScore} ${activeMatch.awayShort} · ${
        isFr ? 'Dynamique du Match' : 'Match Momentum'
      }`,
      subtitle: `${activeMatch.minute}' · ${getWinLikelihoodExplanation()}`,
      metricPrimary: `xG: ${activeMatch.homeShort} ${activeMatch.homeXG.toFixed(2)} — ${activeMatch.awayXG.toFixed(
        2
      )} ${activeMatch.awayShort}`,
      metricSecondary: `${isFr ? 'Probabilité :' : 'Win Likelihood:'} ${
        activeMatch.homeShort
      } ${activeMatch.winProbability.home}% · ${
        isFr ? 'Nul' : 'Draw'
      } ${activeMatch.winProbability.draw}% · ${activeMatch.awayShort} ${
        activeMatch.winProbability.away
      }%`,
      accentColor: '#B8FF01',
    });
  };

  return (
    <div className="bg-[#050D08] text-slate-100">
      {/* Step 1: Global Pure Tactical Mode Banner when Active */}
      {pureTacticalMode && (
        <div className="bg-[#00F59B]/10 border-b border-[#00F59B]/30 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#00F59B]">
            <span className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 shrink-0" />
              <strong>PURE TACTICAL MODE ACTIVE</strong> — All gamification (FanScore Pick&apos;Em), Squad chat drawers, and O2O venue widgets are collapsed for distraction-free statistical analysis.
            </span>
            <span className="text-[11px] text-slate-400">Opta-Grade Telemetry</span>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 1: STADIUM MATCH HEADER & LIVE SWITCHER
      ===================================================================== */}
      <section className="relative min-h-[540px] flex items-end border-b border-[#162B1E] overflow-hidden">
        <img
          src="/images/hero-goalnet.jpg"
          alt="Floodlit stadium pitch through the goal net"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D08]/95 via-[#050D08]/80 to-[#050D08]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 lg:py-16 space-y-10">
          {/* Top Bar: 3 Live Match Switcher Pills + Simulation Demo Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#162B1E]/90">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8FF01] mr-1">
                {isFr ? 'EN DIRECT' : 'LIVE MATCHES'}
              </span>
              {matches.map((match) => {
                const isSelected = match.id === selectedMatchId;
                return (
                  <button
                    key={match.id}
                    onClick={() => setSelectedMatchId(match.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-2.5 border ${
                      isSelected
                        ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold shadow-lg shadow-[#B8FF01]/10'
                        : 'bg-[#08140C]/90 text-slate-200 border-[#162B1E] hover:border-[#B8FF01]/50 backdrop-blur-md'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#050D08]' : 'bg-[#B8FF01] animate-pulse'
                      }`}
                    />
                    <span>
                      {match.homeTeam} vs {match.awayTeam}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] ${
                        isSelected
                          ? 'bg-[#050D08]/15 text-[#050D08] font-bold'
                          : 'bg-[#0B1A11] text-[#B8FF01]'
                      }`}
                    >
                      {match.homeScore}–{match.awayScore} · {match.minute}&apos;
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clean Demo Buttons & Scout Lane 1 Status Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => simulateLiveGoalOrShift('goal')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs transition-all cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isFr ? 'Simuler but' : 'Simulate Goal'}</span>
              </button>
              <button
                onClick={() => simulateLiveGoalOrShift('tactical-shift')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08140C]/90 hover:bg-[#0B1A11] text-white font-medium text-xs border border-[#162B1E] hover:border-[#B8FF01]/50 transition-all cursor-pointer backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8FF01]" />
                <span>{isFr ? 'Shift tactique' : 'Tactical Shift'}</span>
              </button>
              <button
                onClick={() =>
                  simulateMatchStatusChange(
                    activeMatch.status === 'LIVE' ? 'HALFTIME' : activeMatch.status === 'HT' ? 'RESUMED' : 'KICK_OFF'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F59B]/15 hover:bg-[#00F59B]/25 text-[#00F59B] border border-[#00F59B]/35 font-mono text-xs font-bold transition-all cursor-pointer"
                title="Lane 1 Scout instant match_status_change (<200ms frame)"
              >
                <Clock className="w-3 h-3" />
                <span>Status: {activeMatch.status}</span>
              </button>
              <button
                onClick={() =>
                  simulateMoneylineShift(
                    Math.round(Math.random() * 20 + 55),
                    Math.round(Math.random() * 10 + 15),
                    Math.round(Math.random() * 15 + 10)
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 text-[#00D4FF] border border-[#00D4FF]/35 font-mono text-xs font-bold transition-all cursor-pointer"
                title="Lane 1 Scout instant 3-Way Moneyline shift (<200ms frame)"
              >
                <TrendingUp className="w-3 h-3" />
                <span>Moneyline Shift</span>
              </button>
            </div>
          </div>

          {/* Main Editorial Scoreboard & Plain-Language Win Likelihood */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Left 7 Cols: Competition, Teams, Bold Scoreboard */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B1A11] border border-[#162B1E] text-[#B8FF01] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                  {activeMatch.minute}&apos; {isFr ? 'EN DIRECT' : 'LIVE'}
                </span>
                <span>{getLocalizedCompetition(activeMatch.competition)}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{activeMatch.stadium}</span>
              </div>

              {/* Bold Scoreboard */}
              <div className="flex flex-wrap items-baseline gap-4 sm:gap-7">
                <div className="space-y-1">
                  <span className="font-wide text-4xl sm:text-6xl font-extrabold tracking-wider text-white">
                    {activeMatch.homeShort}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {activeMatch.homeTeam}
                  </p>
                </div>

                <div className="px-5 py-2.5 rounded-xl bg-[#08140C]/90 border border-[#162B1E] backdrop-blur-md">
                  <span className="font-wide text-4xl sm:text-6xl font-extrabold tracking-wider text-[#B8FF01]">
                    {activeMatch.homeScore} — {activeMatch.awayScore}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-wide text-4xl sm:text-6xl font-extrabold tracking-wider text-white">
                    {activeMatch.awayShort}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {activeMatch.awayTeam}
                  </p>
                </div>
              </div>

              {/* Clean, Fan-Friendly Key Context Pills */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono text-slate-300 tabular-nums">
                <div>
                  <span className="text-slate-400">
                    {isFr ? 'Buts attendus (xG) :' : 'Expected Goals (xG):'}
                  </span>{' '}
                  <strong className="text-white">
                    {activeMatch.homeShort} {activeMatch.homeXG.toFixed(2)}
                  </strong>{' '}
                  —{' '}
                  <strong className="text-white">
                    {activeMatch.awayXG.toFixed(2)} {activeMatch.awayShort}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">
                    {isFr ? 'Possession :' : 'Possession:'}
                  </span>{' '}
                  <strong className="text-white">{activeMatch.homePossession}%</strong> —{' '}
                  <strong className="text-white">{activeMatch.awayPossession}%</strong>
                </div>
                <div>
                  <span className="text-slate-400">PPDA:</span>{' '}
                  <strong className="text-[#00F59B]">{activeMatch.homePPDA}</strong> vs{' '}
                  <strong className="text-[#00D4FF]">{activeMatch.awayPPDA}</strong>
                </div>
              </div>

              {/* Step 2: Provisional Opta Attribution Badge + 1-Click Explanation Popover */}
              {isProvisionalAttribution && (
                <div className="pt-2 space-y-2">
                  <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/50 text-[#FFB800] text-xs font-mono">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-bold">
                      PROVISIONAL ATTRIBUTION — PENDING OPTA VERIFICATION
                    </span>
                    <button
                      onClick={() => setShowProvisionalExplainer(!showProvisionalExplainer)}
                      className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 text-white text-[10px] font-mono inline-flex items-center gap-1 border border-white/15 cursor-pointer"
                    >
                      <Info className="w-3 h-3 text-[#FFB800]" />
                      {showProvisionalExplainer ? 'Hide Policy' : 'Why Provisional?'}
                    </button>
                    <button
                      onClick={() => setIsProvisionalAttribution(false)}
                      className="px-2 py-0.5 rounded bg-[#00F59B]/20 hover:bg-[#00F59B]/30 text-[#00F59B] text-[10px] font-mono font-bold cursor-pointer"
                    >
                      ✓ Mark Opta F24 Verified
                    </button>
                  </div>

                  {showProvisionalExplainer && (
                    <div className="p-3.5 rounded-xl bg-[#0B1510]/95 border border-[#FFB800]/40 text-xs text-slate-200 max-w-2xl leading-relaxed space-y-1">
                      <div className="font-mono font-bold text-[#FFB800]">
                        Sub-Second Lane 1 Scout Feed vs. Official Opta F24 Video Review:
                      </div>
                      <p>
                        Scorecer dispatches goal and assist alerts in <strong>0.68s</strong> via Lane 1 (&lt;200ms Stadium Scout WebSocket). Because deflections in crowded penalty boxes occasionally cause official league statisticians (Opta SDAPI / Genius Sports) to revise a goal into an Own Goal or adjust assist attribution 2–5 minutes later, Scorecer displays this transparent provisional badge until the official Opta F24 XML/JSON verification frame arrives.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 5 Cols: Plain-Language AI Win Likelihood Card */}
            <div className="lg:col-span-5 rounded-xl bg-[#08140C]/95 backdrop-blur-md border border-[#162B1E] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#B8FF01]">
                  {isFr ? 'PROBABILITÉ DE VICTOIRE IA' : 'AI WIN LIKELIHOOD'}
                </span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {activeMatch.minute}&apos;
                </span>
              </div>

              {/* Percentages Row */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono tabular-nums">
                <span className="text-[#B8FF01] font-semibold">
                  {activeMatch.homeShort} {activeMatch.winProbability.home}%
                </span>
                <span className="text-slate-400">
                  {isFr ? 'Nul' : 'Draw'} {activeMatch.winProbability.draw}%
                </span>
                <span className="text-white font-semibold">
                  {activeMatch.awayShort} {activeMatch.winProbability.away}%
                </span>
              </div>

              {/* Clean 3-Part Bar */}
              <div className="w-full h-2.5 bg-[#050D08] rounded-full overflow-hidden flex gap-1 p-0.5 border border-[#162B1E]">
                <div
                  className="h-full bg-[#B8FF01] rounded-l-full transition-all duration-500"
                  style={{ width: `${activeMatch.winProbability.home}%` }}
                />
                <div
                  className="h-full bg-slate-600 transition-all duration-500"
                  style={{ width: `${activeMatch.winProbability.draw}%` }}
                />
                <div
                  className="h-full bg-slate-200 rounded-r-full transition-all duration-500"
                  style={{ width: `${activeMatch.winProbability.away}%` }}
                />
              </div>

              {/* 1-Sentence Plain-Language Explanation */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {getWinLikelihoodExplanation()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          STEP 2: TIERED B2B DATA ADAPTER & DUAL-LANE MULTIPLEXER INSPECTOR
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-8 px-6 bg-[#07110B]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00F59B]">
                <Cpu className="w-4 h-4" />
                <span className="uppercase tracking-wider font-bold">
                  TelemetryProviderAdapter • B2B Data Feed Tier & Dual-Lane Multiplexer
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Switch B2B licensing tiers dynamically without refactoring downstream UI components.
              </p>
            </div>

            {/* 3 Phase Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['PHASE_1_MVP', 'PHASE_2_GROWTH', 'PHASE_3_ENTERPRISE'] as DataFeedTierPhase[]).map(
                (phaseKey) => {
                  const cfg = TELEMETRY_PROVIDER_PHASES[phaseKey];
                  const active = dataFeedPhase === phaseKey;
                  return (
                    <button
                      key={phaseKey}
                      onClick={() => setDataFeedPhase(phaseKey)}
                      className={`px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#00F59B]/15 border-[#00F59B] text-white'
                          : 'bg-[#08140C] border-[#162B1E] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{cfg.label}</div>
                      <div className="text-[10px] font-mono text-[#00F59B]">
                        {cfg.monthlyCostRange} • {cfg.providers}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Dual-Lane Status Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#0B1710] border border-[#1A3324] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">
                  Lane 1: Ultra-Low-Latency Scout Feed
                </div>
                <div className="text-white font-bold mt-0.5">
                  {activeProviderConfig.lane1Protocol}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#00F59B]/15 text-[#00F59B] font-bold tabular-nums">
                HB: {heartbeatCountdownSec}s
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1710] border border-[#1A3324] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">
                  Lane 2: Async Opta Analytical Matrix
                </div>
                <div className="text-white font-bold mt-0.5">
                  {activeProviderConfig.lane2AnalyticalDepth}
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded font-bold ${
                  lane2SyncStatus === 'SYNCED_60FPS'
                    ? 'bg-[#00D4FF]/15 text-[#00D4FF]'
                    : 'bg-[#FFB800]/20 text-[#FFB800] animate-pulse'
                }`}
              >
                {lane2SyncStatus}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1710] border border-[#1A3324] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">
                  SLA Uptime & Target Latency
                </div>
                <div className="text-white font-bold mt-0.5 tabular-nums">
                  {activeProviderConfig.slaUptime} • {activeProviderConfig.targetLatencyMs}ms Edge
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px]">
                Redis Pub/Sub
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          STEP 4: NATIVE LOCK-SCREEN & DYNAMIC ISLAND LIVE PREVIEW HUD
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-10 px-6 bg-[#050D08]">
        <div className="max-w-7xl mx-auto">
          <NativeLockScreenSimulatorHUD />
        </div>
      </section>

      {/* =====================================================================
          REAL-TIME ESPN API & HISTORICAL ARCHIVE IMPORTER
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-12 px-6 bg-[#050D08]">
        <div className="max-w-7xl mx-auto">
          <RealMatchDataImporter compact />
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: 01 · LIVE STREAM & HIGHLIGHTS — Watch the Match Your Way
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 5 Columns: Editorial Context + Format Toggle + 1-Click D2C Pass */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr
                ? '01 · DIRECT & TEMPS FORTS'
                : '01 · LIVE STREAM & HIGHLIGHTS'}
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Regardez le match à votre façon.'
                : 'Watch the match your way.'}
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Basculez instantanément entre le flux TV 16:9, le format Story vertical 9:16 et le format carré 1:1 générés par notre pipeline CV YOLOv8-medium.'
                : 'Switch seamlessly between 16:9 widescreen broadcast, 9:16 vertical Stories, and 1:1 Square social feeds powered by YOLOv8-medium ball-tracking smart crop.'}
            </p>

            {/* Clean 16:9 Broadcast vs 9:16 Vertical Story vs 1:1 Square Toggle */}
            <div className="space-y-2 pt-1">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                {isFr ? 'FORMAT D’ÉCRAN (SMART-CROP CV)' : 'VIEWING FORMAT (CV SMART-CROP)'}
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => setStreamAspect('16:9')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    streamAspect === '16:9'
                      ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                      : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>16:9 TV</span>
                </button>
                <button
                  onClick={() => setStreamAspect('9:16')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    streamAspect === '9:16'
                      ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                      : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 Story</span>
                </button>
                <button
                  onClick={() => setStreamAspect('1:1')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    streamAspect === '1:1'
                      ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                      : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>1:1 Square</span>
                </button>
              </div>
            </div>

            {/* Frictionless 1-Click D2C Match Pass Card (Step 7 RevenueCat StoreKit 2 / Play Billing) */}
            <div className="rounded-xl bg-[#08140C] border border-[#162B1E] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPPVUnlocked ? (
                    <Unlock className="w-4 h-4 text-[#B8FF01]" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#B8FF01]" />
                  )}
                  <span className="font-display font-semibold text-sm text-white">
                    {isFr ? 'Pass Match Direct D2C (RevenueCat)' : '1-Click D2C Match Pass (Consumable IAP)'}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#B8FF01] tabular-nums">
                  {isPPVUnlocked
                    ? isFr
                      ? 'DÉBLOQUÉ · 1080P60'
                      : 'UNLOCKED · 1080P60'
                    : `${activeMatch.ppvPrice} StoreKit 2 / Play Billing`}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {isPPVUnlocked
                  ? isFr
                    ? 'Accès complet au flux direct 1080p60 sans latence et aux ralentis tactiques activé pour ce match.'
                    : 'Full zero-latency 1080p60 broadcast and instant multi-angle tactical replays are active for this match.'
                  : isFr
                  ? 'Pas d’abonnement mensuel imposé. Débloquez uniquement ce match en un clic via StoreKit 2 / Google Play Billing (Reconnaissance serveur 3 jours).'
                  : 'No forced monthly bundle. Unlock just this match in one click via StoreKit 2 / Google Play Billing (with 3-day server webhook acknowledgment).'}
              </p>

              {isPPVUnlocked ? (
                <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF01] bg-[#0B1A11] border border-[#162B1E] rounded-lg px-3.5 py-2.5">
                  <Check className="w-4 h-4" />
                  <span>
                    {isFr
                      ? 'Flux direct actif — bon match !'
                      : 'Live stream unlocked — enjoy the match!'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => unlockPPVMatch(activeMatch.id, false)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs transition-all cursor-pointer text-center"
                  >
                    {isFr
                      ? `Débloquer (${activeMatch.ppvPrice} IAP)`
                      : `1-Click Unlock (${activeMatch.ppvPrice} IAP)`}
                  </button>
                  <button
                    onClick={() => setIsPaywallOpen(true)}
                    className="py-2.5 px-4 rounded-lg bg-[#0B1A11] hover:bg-[#12281B] text-[#00D4FF] border border-[#00D4FF]/40 font-mono text-xs transition-all cursor-pointer"
                  >
                    RevenueCat Paywall
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right 7 Columns: Playable HTML5 Football Video / Live Stream Player */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className={`rounded-xl overflow-hidden bg-[#08140C] border border-[#162B1E] transition-all duration-500 ${
                streamAspect === '9:16'
                  ? 'w-full max-w-[340px]'
                  : streamAspect === '1:1'
                  ? 'w-full max-w-[460px]'
                  : 'w-full'
              }`}
            >
              <div
                className={`relative bg-black overflow-hidden group ${
                  streamAspect === '9:16'
                    ? 'aspect-[9/16]'
                    : streamAspect === '1:1'
                    ? 'aspect-square'
                    : 'aspect-video'
                }`}
              >
                <video
                  ref={videoRef}
                  src="https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-stadium-43479-large.mp4"
                  poster="/images/highlight-goal.jpg"
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  className="w-full h-full object-cover opacity-90 group-hover:scale-[1.01] transition-transform duration-700"
                />
                <img
                  src="/images/highlight-goal.jpg"
                  alt="Live football match action"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-30 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/65 pointer-events-none" />

                {/* Top Overlay Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#050D08]/85 backdrop-blur-md border border-[#162B1E] text-xs font-mono tabular-nums">
                    <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                    <span className="text-white font-semibold">
                      {activeMatch.homeShort} {activeMatch.homeScore} —{' '}
                      {activeMatch.awayScore} {activeMatch.awayShort}
                    </span>
                    <span className="text-[#B8FF01]">{activeMatch.minute}&apos;</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="p-2 rounded-md bg-[#050D08]/80 hover:bg-[#0B1A11] text-slate-200 border border-[#162B1E] cursor-pointer"
                      title={isFr ? 'Son' : 'Mute / Unmute'}
                    >
                      {isVideoMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#B8FF01]" />
                      )}
                    </button>
                    <button
                      onClick={handleTogglePlay}
                      className="p-2 rounded-md bg-[#B8FF01] text-[#050D08] hover:bg-[#c8ff38] cursor-pointer"
                      title={isFr ? 'Lecture / Pause' : 'Play / Pause'}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#B8FF01] text-[#050D08] font-semibold">
                      {streamAspect === '9:16'
                        ? isFr
                          ? 'STORY VERTICALE 9:16 (YOLOV8 POI)'
                          : '9:16 VERTICAL STORY (YOLOV8 POI)'
                        : streamAspect === '1:1'
                        ? '1:1 SQUARE SOCIAL CROP (YOLOV8 POI)'
                        : isFr
                        ? 'DIFFUSION 16:9 EN DIRECT'
                        : '16:9 LIVE BROADCAST'}
                    </span>
                    <span className="font-mono text-xs text-slate-300 bg-[#050D08]/85 px-2.5 py-1 rounded border border-[#162B1E] tabular-nums">
                      {selectedPlayer.name} · {selectedPlayer.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="bg-[#050D08]/90 backdrop-blur-md border border-[#162B1E] rounded-lg p-3">
                    <p className="text-xs sm:text-sm font-display font-semibold text-white">
                      {isFr
                        ? 'Action clé : Surcharge dans le demi-espace droit et finition instantanée (+0.64 xG)'
                        : 'Key sequence: Right half-space overload & first-time finish (+0.64 xG)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: 02 · INTERACTIVE PITCH — 3-Layer Hardware-Accelerated Visualizer
          + Explainable Live Player Ratings ("Rating Delta Ledger Drawer")
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 5 Columns: Editorial Explanation + 3 View Buttons + Selected Player & Rating Delta Ledger Drawer */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '02 · TERRAIN INTERACTIF 60FPS' : '02 · 3-LAYER HARDWARE-ACCELERATED PITCH'}
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'La tactique et les notes expliquées.'
                : 'Tactics & player ratings explained in plain sight.'}
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? `${activeMatch.homeTeam} évolue en ${activeMatch.homeFormation} face au ${activeMatch.awayFormation} de ${activeMatch.awayTeam}. Cliquez sur n’importe lequel des 22 joueurs pour ouvrir son Grand Livre de Note Live (Base 6.50).`
                : `${activeMatch.homeTeam} are lined up in a ${activeMatch.homeFormation} against ${activeMatch.awayTeam}'s ${activeMatch.awayFormation}. Click any of the 22 player nodes to inspect their Explainable Rating Delta Ledger.`}
            </p>

            {/* 3 Simple View Buttons: Pass Network, Gaussian KDE Heatmaps, Shot Map */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => setPitchMode('pass-network')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  pitchMode === 'pass-network'
                    ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                    : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isFr ? 'Passes + xT' : 'Pass Network'}</span>
              </button>

              <button
                onClick={() => setPitchMode('heatmap')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  pitchMode === 'heatmap'
                    ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                    : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{isFr ? 'KDE Zones' : 'KDE Heatmaps'}</span>
              </button>

              <button
                onClick={() => setPitchMode('shot-map')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  pitchMode === 'shot-map'
                    ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                    : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{isFr ? 'Carte xG' : 'xG Shot Map'}</span>
              </button>
            </div>

            {/* Selected Player Card + Explainable Rating Delta Ledger Drawer (Step 3) */}
            <div className="rounded-xl bg-[#08140C] border border-[#162B1E] p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#B8FF01]">
                    {selectedPlayer.team === 'home'
                      ? activeMatch.homeTeam
                      : activeMatch.awayTeam}{' '}
                    · #{selectedPlayer.number}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                    {selectedPlayer.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {getLocalizedPosition(selectedPlayer.position)}
                  </p>
                </div>

                <div className="text-right bg-[#0B1A11] border border-[#162B1E] rounded-lg px-3.5 py-2 tabular-nums">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {isFr ? 'NOTE LIVE' : 'LIVE RATING'}
                  </span>
                  <span className="font-wide text-2xl font-extrabold text-[#B8FF01]">
                    {selectedPlayer.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Breathable 3-Metric Strip */}
              <div className="grid grid-cols-3 gap-3 pt-1 tabular-nums">
                <div className="rounded-lg bg-[#0B1A11] border border-[#162B1E] p-3">
                  <span className="block font-mono text-[10px] uppercase text-slate-400">
                    xG + xA
                  </span>
                  <span className="font-mono text-base font-bold text-white mt-0.5 block">
                    {(selectedPlayer.xg + selectedPlayer.xa).toFixed(2)}
                  </span>
                </div>
                <div className="rounded-lg bg-[#0B1A11] border border-[#162B1E] p-3">
                  <span className="block font-mono text-[10px] uppercase text-slate-400">
                    {isFr ? 'Précision passes' : 'Pass Accuracy'}
                  </span>
                  <span className="font-mono text-base font-bold text-white mt-0.5 block">
                    {selectedPlayer.passAccuracy}%
                  </span>
                </div>
                <div className="rounded-lg bg-[#0B1A11] border border-[#162B1E] p-3">
                  <span className="block font-mono text-[10px] uppercase text-slate-400">
                    {isFr ? 'Ballons touchés' : 'Touches'}
                  </span>
                  <span className="font-mono text-base font-bold text-white mt-0.5 block">
                    {selectedPlayer.touches}
                  </span>
                </div>
              </div>

              {/* STEP 3: EXPLAINABLE LIVE PLAYER RATING ("RATING DELTA LEDGER DRAWER") */}
              <div className="rounded-xl bg-[#0B1710] border border-[#1E3B29] p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#00F59B]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>RATING DELTA LEDGER (EXPLAINABLE ML)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-slate-300 tabular-nums">
                    Base: {playerLedger.baseRating.toFixed(2)} → Live: {playerLedger.currentRating.toFixed(2)}
                  </span>
                </div>

                {/* 1-Tap Trigger for Interactive Full-Screen / Modal Ledger Drawer */}
                <button
                  type="button"
                  onClick={() => setIsRatingDrawerOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#00F59B]/15 hover:bg-[#00F59B]/25 border border-[#00F59B]/40 text-[#00F59B] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>
                    {isFr
                      ? 'Ouvrir le Tiroir du Grand Livre (22 Joueurs)'
                      : 'Open Rating Delta Ledger Drawer (22 Players)'}
                  </span>
                </button>

                {/* Positive Contributions */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#00F59B]">
                    Positive Contributions (+xT / +xG / Recoveries)
                  </div>
                  {playerLedger.positiveContributions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs bg-[#08140C] px-2.5 py-1.5 rounded-lg border border-[#00F59B]/20"
                    >
                      <span className="text-slate-200">
                        <span className="font-mono text-slate-400 mr-1.5 tabular-nums">
                          {item.minute}&apos;
                        </span>
                        {item.label}
                      </span>
                      <span className="font-mono font-bold text-[#00F59B] tabular-nums">
                        +{item.delta.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Negative Deductions */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF3366]">
                    Negative Deductions (Turnovers / Duels Lost)
                  </div>
                  {playerLedger.negativeDeductions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs bg-[#08140C] px-2.5 py-1.5 rounded-lg border border-[#FF3366]/20"
                    >
                      <span className="text-slate-200">
                        <span className="font-mono text-slate-400 mr-1.5 tabular-nums">
                          {item.minute}&apos;
                        </span>
                        {item.label}
                      </span>
                      <span className="font-mono font-bold text-[#FF3366] tabular-nums">
                        {item.delta.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live Rating Trajectory Sparkline (00:00' to current minute) */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                    <span>Rating Trajectory Sparkline (00:00&apos; → {activeMatch.minute}:00&apos;)</span>
                    <span className="text-[#00D4FF]">6.50 Base → {selectedPlayer.rating.toFixed(1)}</span>
                  </div>
                  <svg viewBox="0 0 200 42" className="w-full h-11 bg-[#060E09] rounded-lg border border-white/10 p-1">
                    {/* Base 6.50 reference line */}
                    <line
                      x1="6"
                      y1="28"
                      x2="194"
                      y2="28"
                      stroke="#475569"
                      strokeWidth="0.7"
                      strokeDasharray="2 2"
                    />
                    <polyline
                      fill="none"
                      stroke="#00F59B"
                      strokeWidth="2"
                      points={playerLedger.sparkline
                        .map((pt, i, arr) => {
                          const x = 8 + (i / Math.max(1, arr.length - 1)) * 184;
                          const y = 38 - ((pt.rating - 5.5) / 4.3) * 32;
                          return `${x},${Math.max(4, Math.min(38, y))}`;
                        })
                        .join(' ')}
                    />
                    {playerLedger.sparkline.map((pt, i, arr) => {
                      const x = 8 + (i / Math.max(1, arr.length - 1)) * 184;
                      const y = 38 - ((pt.rating - 5.5) / 4.3) * 32;
                      return (
                        <circle
                          key={pt.minute}
                          cx={x}
                          cy={Math.max(4, Math.min(38, y))}
                          r="2.2"
                          fill="#00D4FF"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Selected Shot Context when in Shot Map mode */}
              {pitchMode === 'shot-map' && selectedShot && (
                <div className="rounded-lg bg-[#0B1A11] border border-[#162B1E] p-3.5 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[#B8FF01] tabular-nums">
                    <span>
                      {isFr ? 'TIR SÉLECTIONNÉ :' : 'SELECTED SHOT:'} {selectedShot.player}{' '}
                      ({selectedShot.minute}&apos;)
                    </span>
                    <span>{selectedShot.xg.toFixed(2)} xG</span>
                  </div>
                  <p className="text-slate-300">
                    {isFr ? 'Résultat :' : 'Outcome:'}{' '}
                    <strong className="text-white uppercase">{selectedShot.outcome}</strong>
                  </p>
                </div>
              )}

              {/* 1-Click Drop into Squad Chat Button (Hidden in Pure Tactical Mode) */}
              {!pureTacticalMode && (
                <button
                  onClick={handleSharePlayerToSquad}
                  className="w-full py-3 px-4 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>
                    {isFr ? 'Partager le pointeur 60fps dans Squad' : 'Drop 60fps Pointer into Squad Chat'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right 7 Columns: Crisp Dark-Green SVG Football Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl bg-[#08140C] border border-[#162B1E] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 text-[#B8FF01]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B8FF01]" />
                    {activeMatch.homeTeam} ({activeMatch.homeShort}) →
                  </span>
                  <span className="inline-flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />←{' '}
                    {activeMatch.awayTeam} ({activeMatch.awayShort})
                  </span>
                </div>
                <span className="text-slate-400">
                  {pitchMode === 'pass-network'
                    ? 'Layer 1: Centroids + Directional xT Vectors'
                    : pitchMode === 'heatmap'
                    ? 'Layer 2: Gaussian KDE Density (#00D4FF → #00F59B → #FF3366)'
                    : 'Layer 3: Shot xG Radius (Goal #00F59B • Saved #00D4FF • Blocked #FFB800)'}
                </span>
              </div>

              {/* SVG Pitch Container */}
              <div className="relative w-full overflow-hidden rounded-lg border border-[#1E3B28] bg-[#08140C]">
                <svg
                  viewBox="0 0 100 68"
                  className="w-full h-auto select-none block"
                  style={{ minHeight: '340px' }}
                >
                  <defs>
                    {/* Gaussian KDE Multi-Stop Radial Density Gradients (Step 3 Layer 2) */}
                    <radialGradient id="limeHeat" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF3366" stopOpacity="0.55" />
                      <stop offset="45%" stopColor="#00F59B" stopOpacity="0.32" />
                      <stop offset="80%" stopColor="#00D4FF" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="whiteHeat" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFB800" stopOpacity="0.48" />
                      <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                    </radialGradient>
                    {/* Directional Pass Network Arrowhead Markers (Step 3 Layer 1) */}
                    <marker
                      id="passArrowHome"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="3.2"
                      markerHeight="3.2"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#00F59B" fillOpacity="0.8" />
                    </marker>
                    <marker
                      id="passArrowAway"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="3.2"
                      markerHeight="3.2"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#00D4FF" fillOpacity="0.7" />
                    </marker>
                  </defs>

                  {/* Pitch Turf Background */}
                  <rect x="0" y="0" width="100" height="68" fill="#08140C" />

                  {/* Subtle Half-Pitch Stripes */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
                    <rect
                      key={idx}
                      x={idx * 10}
                      y="0"
                      width="5"
                      height="68"
                      fill="#0B1A11"
                      opacity="0.55"
                    />
                  ))}

                  {/* Pitch Markings (#1E3B28) */}
                  <rect
                    x="2"
                    y="2"
                    width="96"
                    height="64"
                    fill="none"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />
                  <line
                    x1="50"
                    y1="2"
                    x2="50"
                    y2="66"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />
                  <circle
                    cx="50"
                    cy="34"
                    r="9.15"
                    fill="none"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />
                  <circle cx="50" cy="34" r="0.6" fill="#1E3B28" />

                  {/* Left Penalty Area */}
                  <rect
                    x="2"
                    y="13.84"
                    width="16.5"
                    height="40.32"
                    fill="none"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />
                  <rect
                    x="2"
                    y="24.84"
                    width="5.5"
                    height="18.32"
                    fill="none"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />

                  {/* Right Penalty Area */}
                  <rect
                    x="81.5"
                    y="13.84"
                    width="16.5"
                    height="40.32"
                    fill="none"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />
                  <rect
                    x="92.5"
                    y="24.84"
                    width="5.5"
                    height="18.32"
                    fill="none"
                    stroke="#1E3B28"
                    strokeWidth="0.45"
                  />

                  {/* LAYER 1: PASS NETWORK LINES WITH DIRECTIONAL ARROWS */}
                  {pitchMode === 'pass-network' &&
                    passLinks.map((link, idx) => {
                      const y1 = (link.y1 / 100) * 64 + 2;
                      const y2 = (link.y2 / 100) * 64 + 2;
                      const isHome = link.team === 'home';
                      return (
                        <line
                          key={`${link.fromPlayerId}-${link.toPlayerId}-${idx}`}
                          x1={link.x1}
                          y1={y1}
                          x2={link.x2}
                          y2={y2}
                          stroke={isHome ? '#00F59B' : '#00D4FF'}
                          strokeOpacity={isHome ? 0.55 : 0.38}
                          strokeWidth={Math.max(0.3, link.count / 24)}
                          strokeLinecap="round"
                          markerEnd={isHome ? 'url(#passArrowHome)' : 'url(#passArrowAway)'}
                        />
                      );
                    })}

                  {/* LAYER 2: GAUSSIAN KDE HEATMAP RADIAL BLOBS */}
                  {pitchMode === 'heatmap' &&
                    players.map((p) => {
                      const cy = (p.y / 100) * 64 + 2;
                      const r = (p.heatmapRadius / 100) * 44;
                      return (
                        <circle
                          key={`heat-${p.id}`}
                          cx={p.x}
                          cy={cy}
                          r={r}
                          fill={p.team === 'home' ? 'url(#limeHeat)' : 'url(#whiteHeat)'}
                          pointerEvents="none"
                        />
                      );
                    })}

                  {/* LAYER 3: SHOT MAP MARKERS SIZED BY XG & COLOR-CODED BY OUTCOME */}
                  {pitchMode === 'shot-map' &&
                    shotMap.map((shot) => {
                      const cy = (shot.y / 100) * 64 + 2;
                      const isGoal = shot.outcome === 'goal';
                      const isSaved = shot.outcome === 'saved';
                      const fillColor = isGoal
                        ? '#00F59B'
                        : isSaved
                        ? '#00D4FF'
                        : '#FFB800';
                      const isSelected = selectedShot?.id === shot.id;
                      const radius = Math.max(1.4, shot.xg * 4.4);
                      return (
                        <g
                          key={shot.id}
                          onClick={() => setSelectedShotId(shot.id)}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={shot.x}
                            cy={cy}
                            r={radius}
                            fill={fillColor}
                            fillOpacity={isGoal ? 0.95 : 0.78}
                            stroke={isSelected ? '#FFFFFF' : '#050D08'}
                            strokeWidth={isSelected ? '0.65' : '0.35'}
                          />
                        </g>
                      );
                    })}

                  {/* 22 INTERACTIVE PLAYER NODES */}
                  {players.map((p) => {
                    const cy = (p.y / 100) * 64 + 2;
                    const isSelected = p.id === selectedPlayer.id;
                    const isHome = p.team === 'home';

                    return (
                      <g
                        key={p.id}
                        onClick={() => handleSelectPlayer(p.id)}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <circle
                            cx={p.x}
                            cy={cy}
                            r="3.2"
                            fill="none"
                            stroke="#B8FF01"
                            strokeWidth="0.35"
                            strokeDasharray="0.8 0.5"
                          />
                        )}
                        <circle
                          cx={p.x}
                          cy={cy}
                          r={isSelected ? '2.1' : '1.75'}
                          fill={isHome ? '#B8FF01' : '#F8FAFC'}
                          stroke="#050D08"
                          strokeWidth="0.4"
                        />
                        <text
                          x={p.x}
                          y={cy + 0.55}
                          textAnchor="middle"
                          fontSize="1.5"
                          fontWeight="700"
                          fill="#050D08"
                        >
                          {p.number}
                        </text>
                        {isSelected && (
                          <text
                            x={p.x}
                            y={cy - 2.9}
                            textAnchor="middle"
                            fontSize="1.75"
                            fontWeight="700"
                            fill="#B8FF01"
                          >
                            {p.name} ({p.rating.toFixed(1)})
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Complete 22-Player Roster Selector for 1-Tap Rating Delta Ledger Inspection */}
              <div className="space-y-2 pt-1">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {isFr
                    ? 'Inspecter le Grand Livre des 22 Joueurs (Cliquez sur un joueur) :'
                    : 'Inspect All 22 On-Pitch Player Rating Ledgers (1-Tap):'}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {players.map((p) => {
                    const active = p.id === selectedPlayer.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPlayer(p.id)}
                        className={`px-2 py-1 rounded-md text-[11px] font-mono tabular-nums transition-all cursor-pointer border ${
                          active
                            ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-bold'
                            : p.team === 'home'
                            ? 'bg-[#0B1A11] text-slate-200 border-[#162B1E] hover:border-[#B8FF01]/40'
                            : 'bg-[#081218] text-slate-300 border-white/10 hover:border-[#00D4FF]/40'
                        }`}
                      >
                        #{p.number} {p.name} · {p.rating.toFixed(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: 03 · MATCH MOMENTUM & KEY MOMENTS
      ===================================================================== */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header & Share Momentum Button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr
                  ? '03 · DYNAMIQUE DU MATCH & MOMENTS CLÉS'
                  : '03 · MATCH MOMENTUM & KEY MOMENTS'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Le rythme du match, minute par minute.'
                  : 'How the match tilted, minute by minute.'}
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                {isFr
                  ? 'Suivez les vagues de pression et les faits de jeu majeurs sans être noyé sous les tableaux de statistiques.'
                  : 'Follow the swings in pressure and key match events without drowning in dense stat tables.'}
              </p>
            </div>

            {!pureTacticalMode && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleShareMomentumToSquad}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs transition-all cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>
                    {isFr
                      ? 'Partager la dynamique 60fps dans Squads'
                      : 'Share 60fps Momentum Pointer to Squads'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('social-squads');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08140C] hover:bg-[#0B1A11] text-slate-200 border border-[#162B1E] text-xs font-mono transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#B8FF01]" />
                  <span>{isFr ? 'Ouvrir Squads' : 'Open Squad Chat'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 Columns: Visual Momentum Bars Card */}
            <div className="lg:col-span-5 rounded-xl bg-[#08140C] border border-[#162B1E] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">
                  {isFr ? 'Vagues de Pression (xG)' : 'Pressure Swings (xG)'}
                </h3>
                <span className="font-mono text-xs text-[#B8FF01] tabular-nums">
                  {activeMatch.homeShort} {activeMatch.homeXG.toFixed(2)} —{' '}
                  {activeMatch.awayXG.toFixed(2)} {activeMatch.awayShort}
                </span>
              </div>

              {/* Clean Visual Momentum Bars */}
              <div className="space-y-3">
                {xgTimeline.map((pt, idx) => {
                  const isHomeDominant = pt.momentum >= 0;
                  const barWidth = Math.min(100, Math.max(14, Math.abs(pt.momentum)));
                  return (
                    <div key={`${pt.minute}-${idx}`} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                        <span className="text-slate-400">{pt.minute}&apos;</span>
                        <span
                          className={
                            isHomeDominant
                              ? 'text-[#B8FF01] font-semibold'
                              : 'text-slate-200'
                          }
                        >
                          {pt.eventLabel
                            ? isFr
                              ? pt.eventLabel
                                  .replace('GOAL', 'BUT')
                                  .replace('Tactical Shift', 'Tactique')
                              : pt.eventLabel
                            : isHomeDominant
                            ? `${activeMatch.homeShort} ${
                                isFr ? 'Pression' : 'Pressure'
                              }`
                            : `${activeMatch.awayShort} ${
                                isFr ? 'Réaction' : 'Push'
                              }`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#050D08] border border-[#162B1E] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHomeDominant ? 'bg-[#B8FF01]' : 'bg-slate-300'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 7 Columns: Key Match Events Timeline */}
            <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#162B1E] pb-4">
                <h3 className="font-display font-bold text-lg text-white">
                  {isFr ? 'Chronologie des Moments Clés' : 'Key Match Moments'}
                </h3>

                {/* Simple Filter Pills */}
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: 'all', label: isFr ? 'Tous' : 'All' },
                      { id: 'goal', label: isFr ? 'Buts' : 'Goals' },
                      {
                        id: 'tactical-shift',
                        label: isFr ? 'Tactique' : 'Tactics',
                      },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setEventFilter(f.id)}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                        eventFilter === f.id
                          ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                          : 'bg-[#0B1A11] text-slate-300 hover:text-white border border-[#162B1E]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredEvents.map((ev) => {
                  const localized = getLocalizedEvent(ev);
                  const isGoal = ev.type === 'goal';
                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                        isGoal
                          ? 'bg-[#0B1A11] border-[#B8FF01]/50'
                          : 'bg-[#050D08]/70 border-[#162B1E]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#08140C] border border-[#162B1E] text-[#B8FF01] shrink-0 tabular-nums">
                          {ev.minute}&apos;
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                                isGoal
                                  ? 'bg-[#B8FF01] text-[#050D08]'
                                  : 'bg-[#08140C] text-slate-300 border border-[#162B1E]'
                              }`}
                            >
                              {localized.badge}
                            </span>
                            <h4 className="font-display font-bold text-sm sm:text-base text-white">
                              {localized.title}
                            </h4>
                            {ev.isProvisionalAttribution && (
                              <span className="px-2 py-0.5 rounded bg-[#FFB800]/20 border border-[#FFB800]/50 text-[#FFB800] font-mono text-[10px] font-bold">
                                PROVISIONAL ATTRIBUTION — PENDING OPTA VERIFICATION
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            {localized.detail}
                          </p>
                          {ev.provisionalReason && (
                            <p className="text-[11px] font-mono text-[#FFB800]/90">
                              ⚡ {ev.provisionalReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {ev.xgAdded && (
                        <span className="font-mono text-xs text-[#B8FF01] shrink-0 hidden sm:inline-block tabular-nums">
                          +{ev.xgAdded.toFixed(2)} xG
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          STEP 3: EXPLAINABLE ML PLAYER RATING DELTA LEDGER DRAWER (22 PLAYERS)
      ===================================================================== */}
      {isRatingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0B0E14] border border-white/15 rounded-3xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto space-y-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm border border-white/20"
                  style={{
                    backgroundColor:
                      selectedPlayer.team === 'home'
                        ? activeMatch.homeColor
                        : activeMatch.awayColor,
                    color: selectedPlayer.team === 'home' ? '#050D08' : '#FFFFFF',
                  }}
                >
                  #{selectedPlayer.number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-white">
                      {selectedPlayer.name}
                    </h3>
                    <span className="font-mono text-xs text-slate-400">
                      ({getLocalizedPosition(selectedPlayer.position)} ·{' '}
                      {selectedPlayer.team === 'home'
                        ? activeMatch.homeTeam
                        : activeMatch.awayTeam}
                      )
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#00F59B] font-semibold flex items-center gap-1.5 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>EXPLAINABLE ML RATING DELTA LEDGER</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right bg-[#111722] border border-white/10 rounded-xl px-3 py-1.5 tabular-nums">
                  <div className="text-[10px] font-mono text-slate-400">LIVE RATING</div>
                  <div className="text-xl font-mono font-extrabold text-[#00F59B]">
                    {selectedPlayer.rating.toFixed(1)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRatingDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Base Rating to Live Rating Decomposition Bar */}
            <div className="p-3.5 rounded-xl bg-[#111722] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase">
                  Decomposition Formula:
                </span>
                <span className="text-white">
                  Base Starting Prior: <strong className="text-slate-300">6.50</strong> + Net Delta:{' '}
                  <strong
                    className={
                      selectedPlayer.rating >= 6.5 ? 'text-[#00F59B]' : 'text-[#FF3366]'
                    }
                  >
                    {(selectedPlayer.rating - 6.5).toFixed(2)}
                  </strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Minute: <span className="text-white font-bold">{activeMatch.minute}&apos;</span> · Match Status:{' '}
                <span className="text-[#00F59B] font-bold">IN_PLAY</span>
              </div>
            </div>

            {/* Positive Contributions */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F59B] flex items-center justify-between">
                <span>Positive Contributions (+xGOT / Threat / Recoveries)</span>
                <span className="tabular-nums">
                  +
                  {playerLedger.positiveContributions
                    .reduce((acc, c) => acc + c.delta, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="space-y-1.5">
                {playerLedger.positiveContributions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#07110B] border border-[#00F59B]/25 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                          {item.minute}&apos;
                        </span>
                        <span>{isFr ? item.labelFr : item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {isFr ? item.detailFr : item.detail}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#00F59B] shrink-0 tabular-nums">
                      +{item.delta.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative Deductions */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF3366] flex items-center justify-between">
                <span>Negative Deductions (Lost Possession / Duels Lost)</span>
                <span className="tabular-nums">
                  {playerLedger.negativeDeductions
                    .reduce((acc, c) => acc + c.delta, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="space-y-1.5">
                {playerLedger.negativeDeductions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#14080B] border border-[#FF3366]/25 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                          {item.minute}&apos;
                        </span>
                        <span>{isFr ? item.labelFr : item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {isFr ? item.detailFr : item.detail}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#FF3366] shrink-0 tabular-nums">
                      {item.delta.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Minute-by-Minute Live Sparkline Trajectory */}
            <div className="p-4 rounded-xl bg-[#08121A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  Minute-by-Minute Rating Trajectory (00:00&apos; → {activeMatch.minute}&apos;)
                </span>
                <span className="text-[#00D4FF] tabular-nums">
                  6.50 Base → {selectedPlayer.rating.toFixed(1)}
                </span>
              </div>
              <svg viewBox="0 0 400 60" className="w-full h-14 bg-[#050D08] rounded-lg p-1 border border-white/10">
                <line x1="8" y1="38" x2="392" y2="38" stroke="#475569" strokeWidth="0.8" strokeDasharray="3 3" />
                <polyline
                  fill="none"
                  stroke="#00F59B"
                  strokeWidth="2.5"
                  points={playerLedger.sparkline
                    .map((pt, i, arr) => {
                      const x = 12 + (i / Math.max(1, arr.length - 1)) * 376;
                      const y = 52 - ((pt.rating - 5.5) / 4.3) * 44;
                      return `${x},${Math.max(6, Math.min(54, y))}`;
                    })
                    .join(' ')}
                />
                {playerLedger.sparkline.map((pt, i, arr) => {
                  const x = 12 + (i / Math.max(1, arr.length - 1)) * 376;
                  const y = 52 - ((pt.rating - 5.5) / 4.3) * 44;
                  return (
                    <circle
                      key={pt.minute}
                      cx={x}
                      cy={Math.max(6, Math.min(54, y))}
                      r="3"
                      fill="#00D4FF"
                    />
                  );
                })}
              </svg>
            </div>

            {/* 22-Player Quick Switcher */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                Inspect Another Player on the Pitch:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {players.map((p) => {
                  const isCurrent = p.id === selectedPlayer.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlayerId(p.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono tabular-nums transition-all cursor-pointer border ${
                        isCurrent
                          ? 'bg-[#00F59B] text-[#050D08] border-[#00F59B] font-bold'
                          : p.team === 'home'
                          ? 'bg-[#0B1A11] text-slate-200 border-[#162B1E] hover:border-[#00F59B]/40'
                          : 'bg-[#111722] text-slate-300 border-white/10 hover:border-[#00D4FF]/40'
                      }`}
                    >
                      #{p.number} {p.name} · {p.rating.toFixed(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              {!pureTacticalMode && (
                <button
                  type="button"
                  onClick={handleSharePlayerToSquad}
                  className="px-4 py-2 rounded-xl bg-[#00F59B] hover:bg-[#00d685] text-[#050D08] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Drop 60fps Rating Pointer into Squad</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsRatingDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
