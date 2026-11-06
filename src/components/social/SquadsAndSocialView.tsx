import React, { useState } from 'react';
import {
  Award,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Crosshair,
  Film,
  Flame,
  Gift,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Pin,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Volume2,
  Zap,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import {
  SharedLiveWidget,
  SquadMessage,
  SquadSubChannel,
} from '../../types/scorecer';

const SQUAD_TRANSLATIONS: Record<
  string,
  { nameFr: string; clubTagFr: string }
> = {
  'squad-north-london': {
    nameFr: 'Analystes Tactiques N5 & Soirée Match',
    clubTagFr: 'Arsenal',
  },
  'squad-ucl-nerds': {
    nameFr: 'Passionnés xG & Fantasy Europe',
    clubTagFr: 'Ligue des Champions',
  },
  'squad-madridistas': {
    nameFr: 'Bernabéu Nocturne Crew',
    clubTagFr: 'Real Madrid',
  },
};

const MESSAGE_TEXT_FR: Record<string, string> = {
  'sq-m1':
    'Regardez comment Saka a aspiré Mendy sur l’aile avant ce centre en retrait pour Havertz ! Je partage le widget xG en direct ici :',
  'sq-m2':
    'Rice et Odegaard contrôlent totalement le milieu ce soir. Regardez le bond de la note live de Saka :',
  'sq-ucl-1':
    'Le PPDA d’Arsenal à 7.4 contre le Real Madrid en quart de finale est exceptionnel. Regardez la bascule de probabilité de victoire :',
  'sq-mad-1':
    'Ancelotti vient de passer en 4-2-4 ! Un ballon dans le dos pour Mbappé ou Vini et tout est relancé. Hala Madrid !',
};

const FALLBACK_SQUAD_MESSAGES: Record<string, SquadMessage[]> = {
  'squad-ucl-nerds': [
    {
      id: 'sq-ucl-1',
      squadId: 'squad-ucl-nerds',
      subChannel: 'match-day-thread',
      author: 'Luka V.',
      authorHandle: '@luka_xthreat',
      avatarColor: '#B8FF01',
      timestamp: "71:15'",
      text: "Arsenal's PPDA sitting at 7.4 against Real Madrid in a Quarter-Final is absurdly elite. Look at the live Win Probability swing:",
      isPro: true,
      widget: {
        type: 'win-prob',
        widgetType: 'win-prob',
        title: 'Live Win Probability',
        subtitle: 'Home 64% · Draw 22% · Away 14%',
        metricPrimary: '64% ARS',
        metricSecondary: '+16% post-Havertz Goal',
        accentColor: '#B8FF01',
        pointer: {
          widgetType: 'win-prob',
          matchId: 'ucl-qf-ars-rma-2026',
          sharedAtMinute: 71,
        },
      },
      reactions: [
        { emoji: '🧠', count: 14 },
        { emoji: '📈', count: 7 },
      ],
    },
  ],
  'squad-madridistas': [
    {
      id: 'sq-mad-1',
      squadId: 'squad-madridistas',
      subChannel: 'match-day-thread',
      author: 'Carlos M.',
      authorHandle: '@carlos_bernabeu',
      avatarColor: '#38BDF8',
      timestamp: "73:40'",
      text: 'Ancelotti just switched to 4-2-4! One ball over the top to Mbappe or Vini and we are right back in this tie. Hala Madrid!',
      isPro: false,
      widget: {
        type: 'ai-highlight',
        widgetType: 'ai-highlight',
        title: "39' Mbappe 34.8 km/h Transition Goal",
        subtitle: 'Auto-Clipped Highlight · 109 dB Roar',
        metricPrimary: '0.51 xG',
        metricSecondary: '0:27 Clip Ready',
        accentColor: '#B8FF01',
        pointer: {
          widgetType: 'ai-highlight',
          matchId: 'ucl-qf-ars-rma-2026',
          sharedAtMinute: 73,
        },
      },
      reactions: [
        { emoji: '🔥', count: 19 },
        { emoji: '👑', count: 11 },
      ],
    },
  ],
};

const PREDICTION_FR: Record<
  string,
  { matchMinute: string; question: string; contextMetric: string }
> = {
  'pred-1': {
    matchMinute: "DÉFI TACTIQUE · 79'",
    question:
      'Le coup franc de 22m de Bukayo Saka côté droit sera-t-il cadré ?',
    contextMetric:
      'Contexte IA : Saka cadre 41% de ses coups francs directs depuis la Zone 15 ; taux d’arrêt de Courtois à 82%.',
  },
  'pred-2': {
    matchMinute: "FENÊTRE 5 MIN · 80'-85'",
    question:
      'Le Real Madrid va-t-il générer plus de 0.25 Expected Goals (xG) avant la 85e minute ?',
    contextMetric:
      'Contexte IA : Le passage en 4-2-4 du Real génère 1,4 centre/min dans la surface.',
  },
  'pred-3': {
    matchMinute: 'HOMME DU MATCH · FIN DE RENCONTRE',
    question:
      'Bukayo Saka terminera-t-il avec une meilleure note algorithmique que Declan Rice ?',
    contextMetric:
      'Notes en direct : Saka (9.1) vs Rice (8.7) — Rice gagne +0.08/min grâce à ses récupérations.',
  },
};

const REWARD_FR: Record<
  string,
  { title: string; description: string; badgeText: string }
> = {
  'rew-neon-badge': {
    title: 'Cadre d’Avatar « Oracle xG » Volt Neon',
    description:
      'Bordure d’avatar numérique exclusive visible dans tous les Squads privés et salons publics de match.',
    badgeText: 'BADGE PROFIL',
  },
  'rew-commentator-pack': {
    title: 'Pack Voix IA « Légende du Stade » (Sonic-3.6)',
    description:
      'Débloquez des profils vocaux Cartesia Sonic-3.6 supplémentaires pour vos résumés tactiques d’après-match.',
    badgeText: 'PACK AUDIO',
  },
  'rew-camera-angle': {
    title: 'Vue Caméra Tactique Panoramique « All-22 »',
    description:
      'Activez la vue radar tactique haute altitude et les vecteurs de passes sur le terrain 2D.',
    badgeText: 'VUE TACTIQUE',
  },
  'rew-sponsor-raffle': {
    title: 'Tirage Fidélité Maillot Officiel (100% Gratuit)',
    description:
      'Participation fidélité 100% gratuite au tirage mensuel de maillots officiels (sans valeur monétaire).',
    badgeText: 'FIDÉLITÉ GRATUITE',
  },
};

const MEGATHREAD_FR: Record<string, string> = {
  'mega-1':
    'Ancelotti qui passe en 4-2-4 à 18 minutes de la fin c’est du chaos pur, si Rice ne verrouillait pas la Zone 14 il y aurait déjà égalité !',
  'mega-2':
    'J’écoute le commentaire IA en mode Supporter Passionné et l’intonation sur la volée de Havertz m’a donné des frissons !',
  'mega-3':
    'Arsenal qui gare le bus dans son propre stade pendant les 10 dernières minutes haha tenez bon !',
};

export const SquadsAndSocialView: React.FC = () => {
  const {
    uiLanguage,
    user,
    activeMatch,
    players,
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
    rewardsCatalog,
    redeemReward,
    addFanScore,
    setActiveTab,
    triggerToast,
    pureTacticalMode,
    togglePureTacticalMode,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  // Watch Party Voice State & LiveKit AI Co-Host
  const [inVoiceChannel, setInVoiceChannel] = useState<boolean>(true);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [aiCoHostActive, setAiCoHostActive] = useState<boolean>(false);

  // 3-Channel Squads Architecture State
  const [activeSubChannel, setActiveSubChannel] =
    useState<SquadSubChannel>('match-day-thread');

  // Squad Chat State
  const [chatInput, setChatInput] = useState<string>('');
  const [localReactionBumps, setLocalReactionBumps] = useState<
    Record<string, number>
  >({});

  // Megathread Moderation State
  const [megaInput, setMegaInput] = useState<string>('');
  const [overrideShieldMode, setOverrideShieldMode] = useState<
    'auto' | 'standard' | 'deficit'
  >('auto');
  const [lastModerationResult, setLastModerationResult] = useState<{
    status: 'approved-banter' | 'verified-analysis' | 'filtered-toxic';
    reason: string;
  } | null>(null);
  const [upvotedPostIds, setUpvotedPostIds] = useState<string[]>([]);
  const [revealedToxicIds, setRevealedToxicIds] = useState<string[]>([]);

  const currentSquad =
    squads.find((s) => s.id === activeSquadId) || squads[0];

  const directMessages = squadMessages.filter(
    (m) => m.squadId === activeSquadId
  );
  const baseSquadMessages =
    directMessages.length > 0
      ? directMessages
      : FALLBACK_SQUAD_MESSAGES[activeSquadId] || squadMessages;

  const displayedSquadMessages = baseSquadMessages.filter((m) => {
    const channelKey = m.subChannel || m.channel || 'match-day-thread';
    if (activeSubChannel === 'pinned-widgets') {
      return Boolean(m.widget) || channelKey === 'pinned-widgets';
    }
    if (activeSubChannel === 'general-banter') {
      return channelKey === 'general-banter';
    }
    // 'match-day-thread'
    return channelKey === 'match-day-thread' || channelKey === 'match-day';
  });

  const isDeficitShieldMode =
    overrideShieldMode === 'deficit'
      ? true
      : overrideShieldMode === 'standard'
      ? false
      : activeMatch.homeScore !== activeMatch.awayScore;

  const topPlayer =
    [...players].sort((a, b) => b.rating - a.rating)[0] || {
      name: 'Bukayo Saka',
      rating: 9.1,
      ratingDelta: 0.8,
      xg: 0.89,
      xa: 0.62,
    };

  const handleInviteAiCoHost = () => {
    const next = !aiCoHostActive;
    setAiCoHostActive(next);
    if (next) {
      sendSquadMessage(
        isFr
          ? `🎙️ [Co-Hôte Vocal IA LiveKit Connecté · $0.01/min] Point tactique à la ${activeMatch.minute}' : Arsenal mène ${activeMatch.homeScore}-${activeMatch.awayScore} (${activeMatch.homeXG.toFixed(2)} vs ${activeMatch.awayXG.toFixed(2)} xG). La note live de ${topPlayer.name} est à ${topPlayer.rating.toFixed(1)}.`
          : `🎙️ [LiveKit AI Voice Co-Host Joined · $0.01/min] Live ${activeMatch.minute}' briefing: ${activeMatch.homeShort} leads ${activeMatch.homeScore}-${activeMatch.awayScore} (${activeMatch.homeXG.toFixed(2)} vs ${activeMatch.awayXG.toFixed(2)} xG). ${topPlayer.name} leads the pitch at ${topPlayer.rating.toFixed(1)} rating.`,
        undefined,
        activeSubChannel,
        true
      );
      triggerToast(
        isFr
          ? 'Co-Hôte Vocal IA Scorecer connecté au salon LiveKit SFU !'
          : 'Scorecer AI Voice Co-Host joined the LiveKit SFU room!'
      );
    } else {
      triggerToast(
        isFr
          ? 'Co-Hôte Vocal IA déconnecté.'
          : 'Scorecer AI Voice Co-Host disconnected.'
      );
    }
  };

  const handleSendSquadChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendSquadMessage(chatInput.trim(), undefined, activeSubChannel);
    setChatInput('');
    addFanScore(
      5,
      isFr ? 'Message envoyé dans le Squad' : 'Posted in Squad Watch Party'
    );
  };

  const handleDropPresetWidget = (
    presetType: 'xg-chart' | 'player-rating' | 'ai-highlight'
  ) => {
    let widget: SharedLiveWidget;
    if (presetType === 'xg-chart') {
      widget = {
        type: 'xg-chart',
        widgetType: 'xg-chart',
        title: isFr
          ? `Poussée xG en direct · ${activeMatch.minute}'`
          : `Live xG Surge · ${activeMatch.minute}'`,
        subtitle: `${activeMatch.homeTeam} ${activeMatch.homeXG.toFixed(
          2
        )} vs ${activeMatch.awayTeam} ${activeMatch.awayXG.toFixed(2)} xG`,
        metricPrimary: `${activeMatch.homeXG.toFixed(
          2
        )} — ${activeMatch.awayXG.toFixed(2)} xG`,
        metricSecondary: isFr
          ? `+${(activeMatch.homeXG - activeMatch.awayXG).toFixed(2)} écart xG`
          : `+${(activeMatch.homeXG - activeMatch.awayXG).toFixed(2)} xG edge`,
        accentColor: '#B8FF01',
        pointer: {
          widgetType: 'xg-chart',
          matchId: activeMatch.id,
          sharedAtMinute: activeMatch.minute,
        },
      };
    } else if (presetType === 'player-rating') {
      widget = {
        type: 'player-rating',
        widgetType: 'player-rating',
        title: isFr
          ? `${topPlayer.name} · Note du match`
          : `${topPlayer.name} · Live Player Rating`,
        subtitle: `${topPlayer.xg} xG · ${topPlayer.xa} xA`,
        metricPrimary: `${topPlayer.rating.toFixed(1)} ★`,
        metricSecondary: isFr
          ? `▲ +${Math.abs(topPlayer.ratingDelta).toFixed(1)} sur 15 min`
          : `▲ +${Math.abs(topPlayer.ratingDelta).toFixed(1)} last 15m`,
        accentColor: '#B8FF01',
        pointer: {
          widgetType: 'player-rating',
          matchId: activeMatch.id,
          sharedAtMinute: activeMatch.minute,
        },
      };
    } else {
      widget = {
        type: 'ai-highlight',
        widgetType: 'ai-highlight',
        title: isFr
          ? "67' Extrait But Havertz (0.64 xG)"
          : "67' Havertz Goal Clip (0.64 xG)",
        subtitle: isFr
          ? 'Centre en retrait de Saka · Clameur 114 dB'
          : 'Saka half-space cutback · 114 dB roar',
        metricPrimary: "67' · 0.64 xG",
        metricSecondary: isFr ? 'Vidéo 0:24' : '0:24 Clip',
        accentColor: '#B8FF01',
        pointer: {
          widgetType: 'ai-highlight',
          matchId: activeMatch.id,
          sharedAtMinute: activeMatch.minute,
        },
      };
    }
    shareWidgetToSquad(widget);
    addFanScore(
      10,
      isFr ? 'Widget partagé dans le Squad' : `Shared ${widget.title} to Squad`
    );
  };

  const handleSubmitMegathread = (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;
    const res = submitMegathreadPost(textToSubmit.trim());
    setLastModerationResult(res);
    setMegaInput('');
  };

  return (
    <div className="bg-[#050D08] text-slate-100">
      {/* Step 1: Pure Tactical Mode Collapse Notice */}
      {pureTacticalMode && (
        <div className="bg-[#00F59B]/10 border-b border-[#00F59B]/30 px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#00F59B]">
            <span className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 shrink-0" />
              <strong>PURE TACTICAL MODE ACTIVE</strong> — Gamification (FanScore Pick&apos;Em) and social chat drawers are collapsed so purist supporters experience distraction-free match analytics.
            </span>
            <button
              onClick={() => togglePureTacticalMode(false)}
              className="px-3 py-1 rounded bg-[#00F59B] text-[#050D08] font-bold text-xs cursor-pointer hover:bg-[#00d685]"
            >
              Disable Pure Tactical
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          HERO HEADER — Backed by /images/squads-pub.jpg
      ===================================================================== */}
      <section className="relative min-h-[440px] lg:min-h-[500px] flex items-end border-b border-[#162B1E] overflow-hidden">
        <img
          src="/images/squads-pub.jpg"
          alt={
            isFr
              ? 'Amis regardant un match de football ensemble'
              : 'Friends watching live football together in a pub'
          }
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D08]/95 via-[#050D08]/75 to-[#050D08]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/35 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16 lg:py-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr
                ? 'SQUADS · PRONOSTICS · SALON PUBLIC'
                : 'SQUADS · PREDICTIONS · PUBLIC MEGATHREAD'}
            </p>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              {isFr
                ? 'La chambre qui suit le match.'
                : 'Banter that travels with the match.'}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl">
              {isFr
                ? 'Des Squads privés avec salon vocal synchronisé et widgets en direct — partagez une poussée xG, la note de Saka ou un extrait de but directement dans la discussion, et jouez vos pronostics FanScore à chaque arrêt de jeu.'
                : 'Private Squads with synced voice rooms and live widgets — drop an xG surge, player rating, or goal clip straight into the chat thread, and lock in FanScore micro-predictions at every stoppage.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#section-private-squads"
                className="px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer"
              >
                {isFr ? 'Ouvrir mon Squad' : 'Open Squad Chat'}
              </a>
              <a
                href="#section-predictions"
                className="px-5 py-2.5 rounded-lg bg-[#08140C]/90 hover:bg-[#0B1A11] text-white font-medium text-sm border border-[#1F3B2A] transition-all cursor-pointer backdrop-blur-md"
              >
                {isFr
                  ? 'Pronostics & Récompenses'
                  : 'Matchday Predictions'}
              </a>
              <button
                onClick={() => {
                  setActiveTab('o2o-local');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08140C]/80 hover:bg-[#0B1A11] text-slate-200 border border-[#162B1E] text-sm transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#B8FF01]" />
                <span>
                  {isFr ? 'Soirées Pub & Foot à 5' : 'Find Pub Watch Parties'}
                </span>
              </button>
            </div>
          </div>

          {/* Live FanScore & Accuracy Summary Card */}
          <div className="w-full sm:w-auto bg-[#08140C]/90 backdrop-blur-md border border-[#1F3B2A] rounded-xl p-5 flex items-center gap-6 self-start lg:self-end">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                {isFr ? 'SOLDE FANSCORE' : 'FANSCORE BALANCE'}
              </div>
              <div className="font-wide text-2xl font-extrabold text-[#B8FF01] flex items-center gap-1.5 mt-1">
                <Zap className="w-5 h-5 fill-[#B8FF01] text-[#B8FF01]" />
                <span>{user.fanScore.toLocaleString()}</span>
                <span className="font-mono text-xs font-normal text-slate-400">
                  PTS
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-[#162B1E]" />

            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                {isFr ? 'PRÉCISION PRONOS' : 'PREDICTION ACCURACY'}
              </div>
              <div className="font-wide text-xl font-bold text-white mt-1">
                {user.predictionAccuracy}%{' '}
                <span className="font-mono text-xs font-normal text-slate-400">
                  ({user.predictionsWon}/{user.predictionsTotal})
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          01 · PRIVATE SQUADS & WATCH PARTY
      ===================================================================== */}
      <section
        id="section-private-squads"
        className="border-b border-[#162B1E] py-16 lg:py-20 px-6"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr
                  ? '01 · SQUADS PRIVÉS & SALON VOCAL'
                  : '01 · PRIVATE SQUADS & WATCH PARTY'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Votre groupe d’amis, branché sur le direct.'
                  : 'Your matchday group chat, wired to the pitch.'}
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                {isFr
                  ? 'Basculez entre vos Squads, rejoignez le salon audio synchronisé et partagez des cartes xG, la note de Saka (9.1) ou l’extrait vidéo d’un but en un clic.'
                  : 'Switch between your private Squads, hop into the low-latency voice room, and drop live xG surges, player ratings, or goal clips directly into the thread.'}
              </p>
            </div>

            {/* Live Match Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#08140C] border border-[#162B1E] self-start lg:self-end">
              <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
              <span className="font-mono text-xs text-slate-300">
                {activeMatch.homeShort} {activeMatch.homeScore} —{' '}
                {activeMatch.awayScore} {activeMatch.awayShort}
              </span>
              <span className="font-mono text-xs text-[#B8FF01] font-semibold">
                {activeMatch.minute}&apos;
              </span>
            </div>
          </div>

          {pureTacticalMode ? (
            <div className="rounded-2xl bg-[#08140C] border border-[#00F59B]/30 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/15 border border-[#00F59B]/40 text-[#00F59B] mx-auto flex items-center justify-center">
                <Crosshair className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {isFr
                  ? 'Salons Squads & Audio LiveKit Masqués en Mode Pur Tactique'
                  : 'Squad Chat Drawers & LiveKit Audio Collapsed in Pure Tactical Mode'}
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {isFr
                  ? 'Les salons de discussion de groupe et le salon vocal LiveKit sont masqués pour offrir une vue 100% dédiée à l’analyse statistique du match.'
                  : 'Private Squad group threads, voice rooms, and banter drawers are collapsed so purist supporters experience a distraction-free statistical Match Center.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => togglePureTacticalMode(false)}
                  className="px-4 py-2 rounded-xl bg-[#00F59B] text-[#050D08] font-bold text-xs cursor-pointer hover:bg-[#00d685]"
                >
                  {isFr ? 'Désactiver le Mode Pur Tactique' : 'Disable Pure Tactical Mode'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (4 cols): 3 Squad Switcher Cards + Voice Room Control + Highlight Preview */}
            <div className="lg:col-span-4 space-y-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    {isFr ? 'VOS 3 SQUADS ACTIFS' : 'YOUR 3 ACTIVE SQUADS'}
                  </span>
                  <span className="font-mono text-xs text-[#B8FF01]">
                    {currentSquad.onlineCount}/{currentSquad.memberCount}{' '}
                    {isFr ? 'en ligne' : 'online'}
                  </span>
                </div>

                {squads.map((sq) => {
                  const isSelected = sq.id === activeSquadId;
                  const tr = SQUAD_TRANSLATIONS[sq.id];
                  const displayName = isFr && tr ? tr.nameFr : sq.name;
                  const displayClub = isFr && tr ? tr.clubTagFr : sq.clubTag;

                  return (
                    <button
                      key={sq.id}
                      type="button"
                      onClick={() => setActiveSquadId(sq.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B1A11] border-[#B8FF01] shadow-md'
                          : 'bg-[#08140C] border-[#162B1E] hover:border-[#254732]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#B8FF01]">
                          {displayClub}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          ● {sq.onlineCount} {isFr ? 'actifs' : 'live'}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base text-white">
                        {displayName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {sq.activeVoiceMembers.length}{' '}
                        {isFr
                          ? 'amis dans le salon vocal'
                          : 'friends in voice room'}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* LiveKit Cloud WebRTC SFU Watch Party Bar */}
              <div className="rounded-xl bg-[#08140C] border border-[#162B1E] p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#B8FF01] animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#B8FF01] font-semibold">
                      {isFr
                        ? 'SALON VOCAL LIVEKIT SFU'
                        : 'LIVEKIT CLOUD WEBRTC SFU'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#050D08] border border-[#1F3B2A] text-cyan-400">
                    $0.00025–$0.0004/min vs Agora
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFr
                    ? 'Routage audio WebRTC SFU ultra-basse latence (12ms) avec synchronisation d’horloge de match.'
                    : 'Ultra-low-latency WebRTC SFU audio routing (12ms sync) with optional Scorecer AI Voice Agent co-host.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentSquad.activeVoiceMembers.map((vm, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1A11] border border-[#162B1E]"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          vm.isSpeaking
                            ? 'bg-[#B8FF01] animate-pulse'
                            : 'bg-slate-500'
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-200">
                        {vm.name}
                      </span>
                      {vm.isSpeaking && (
                        <Volume2 className="w-3.5 h-3.5 text-[#B8FF01]" />
                      )}
                    </div>
                  ))}

                  {inVoiceChannel && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#B8FF01]/15 border border-[#B8FF01]/40">
                      <span className="w-2 h-2 rounded-full bg-[#B8FF01]" />
                      <span className="text-xs font-semibold text-[#B8FF01]">
                        {isFr ? 'Vous' : 'You'} ({user.username.split(' ')[0]})
                      </span>
                    </div>
                  )}

                  {aiCoHostActive && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-semibold text-cyan-300">
                        Scorecer AI Co-Host (Sonic-3.6)
                      </span>
                    </div>
                  )}
                </div>

                {/* Invite Scorecer AI Voice Co-Host Button */}
                <button
                  type="button"
                  onClick={handleInviteAiCoHost}
                  className={`w-full py-2.5 px-3.5 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center justify-between border ${
                    aiCoHostActive
                      ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200'
                      : 'bg-[#050D08] hover:bg-[#0B1A11] border-[#1F3B2A] hover:border-cyan-400/50 text-slate-200'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    {aiCoHostActive
                      ? isFr
                        ? 'Co-Hôte Vocal IA Actif (Cliquer pour retirer)'
                        : 'AI Voice Co-Host Active (Click to Dismiss)'
                      : isFr
                      ? 'Inviter le Co-Hôte Vocal IA Scorecer'
                      : 'Invite Scorecer AI Voice Co-Host'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    $0.01/min • PRO
                  </span>
                </button>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !inVoiceChannel;
                      setInVoiceChannel(next);
                      triggerToast(
                        next
                          ? isFr
                            ? 'Connecté au salon vocal LiveKit du Squad !'
                            : 'Joined Squad LiveKit SFU voice room!'
                          : isFr
                          ? 'Vous avez quitté le salon vocal.'
                          : 'Left Squad voice room.'
                      );
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      inVoiceChannel
                        ? 'bg-[#0B1A11] hover:bg-[#12281B] text-white border border-[#244430]'
                        : 'bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08]'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>
                      {inVoiceChannel
                        ? isFr
                          ? 'Quitter l’audio'
                          : 'Leave Voice'
                        : isFr
                        ? 'Rejoindre l’audio'
                        : 'Join Voice'}
                    </span>
                  </button>

                  {inVoiceChannel && (
                    <button
                      type="button"
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                        isMicMuted
                          ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                          : 'bg-[#0B1A11] border-[#162B1E] text-slate-200 hover:border-[#B8FF01]/50'
                      }`}
                      title={
                        isMicMuted
                          ? isFr
                            ? 'Activer le micro'
                            : 'Unmute microphone'
                          : isFr
                          ? 'Couper le micro'
                          : 'Mute microphone'
                      }
                    >
                      {isMicMuted ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4 text-[#B8FF01]" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Editorial Clip Card inside Sidebar */}
              <div className="relative rounded-xl overflow-hidden border border-[#162B1E] bg-[#08140C]">
                <img
                  src="/images/highlight-goal.jpg"
                  alt="Havertz 67' goal clip"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/30 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01]">
                      {isFr ? 'EXTRAIT EN DIRECT · 67’' : 'LIVE CLIP · 67’'}
                    </span>
                    <p className="font-display text-sm font-bold text-white">
                      {isFr
                        ? 'Volée de Havertz sur un centre de Saka'
                        : 'Havertz volley off Saka cutback (0.64 xG)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDropPresetWidget('ai-highlight')}
                    className="px-3 py-1.5 rounded-md bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs shrink-0 cursor-pointer"
                  >
                    {isFr ? 'Partager' : 'Drop Clip'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (8 cols): 3-Channel Squad Chat Thread + 1-Tap Live Widget Dropper */}
            <div className="lg:col-span-8 rounded-xl bg-[#08140C] border border-[#162B1E] overflow-hidden flex flex-col">
              {/* Chat Header + 3-Channel Squads Architecture Tabs */}
              <div className="px-6 py-4 bg-[#0B1A11] border-b border-[#162B1E] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#B8FF01]" />
                      <h3 className="font-display font-bold text-base text-white">
                        {isFr && SQUAD_TRANSLATIONS[currentSquad.id]
                          ? SQUAD_TRANSLATIONS[currentSquad.id].nameFr
                          : currentSquad.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isFr
                        ? 'Architecture Squads 3-Canaux · Les widgets JSON se synchronisent à 60fps avec le match.'
                        : '3-Channel Squads Architecture · Shared JSON pointer widgets render at 60fps synced to match clock.'}
                    </p>
                  </div>

                  <span className="font-mono text-xs px-3 py-1 rounded-md bg-[#050D08] border border-[#162B1E] text-[#B8FF01]">
                    {currentSquad.onlineCount} {isFr ? 'connectés' : 'in chat'}
                  </span>
                </div>

                {/* 3-Channel Sub-Navigation */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {(
                    [
                      {
                        id: 'match-day-thread',
                        labelEn: '# Match Day Thread',
                        labelFr: '# Fil Jour de Match',
                      },
                      {
                        id: 'general-banter',
                        labelEn: '# General Banter',
                        labelFr: '# Chambrage Général',
                      },
                      {
                        id: 'pinned-widgets',
                        labelEn: '📌 Pinned Widgets & Highlights',
                        labelFr: '📌 Widgets & Extraits Épinglés',
                      },
                    ] as const
                  ).map((ch) => {
                    const active = activeSubChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setActiveSubChannel(ch.id)}
                        className={`px-3.5 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer border ${
                          active
                            ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-bold'
                            : 'bg-[#050D08] text-slate-300 border-[#162B1E] hover:border-[#B8FF01]/40'
                        }`}
                      >
                        {isFr ? ch.labelFr : ch.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Messages Stream */}
              <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto">
                {displayedSquadMessages.map((msg) => {
                  const localizedText =
                    isFr && MESSAGE_TEXT_FR[msg.id]
                      ? MESSAGE_TEXT_FR[msg.id]
                      : msg.text;
                  const widgetPointer = msg.widget?.pointer || {
                    widgetType: msg.widget?.widgetType || msg.widget?.type || 'xg-chart',
                    matchId: activeMatch.id,
                    sharedAtMinute: activeMatch.minute,
                  };

                  return (
                    <div
                      key={msg.id}
                      className={`rounded-xl border p-4 space-y-3 ${
                        msg.isAiCoHost
                          ? 'bg-cyan-950/20 border-cyan-500/40'
                          : 'bg-[#050D08] border-[#162B1E]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#050D08]"
                            style={{
                              backgroundColor: msg.isAiCoHost
                                ? '#00D4FF'
                                : '#B8FF01',
                            }}
                          >
                            {msg.author.charAt(0)}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">
                              {msg.author}
                            </span>
                            <span className="font-mono text-xs text-slate-400">
                              {msg.authorHandle}
                            </span>
                            {msg.isPro && (
                              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#B8FF01]/15 text-[#B8FF01] border border-[#B8FF01]/30">
                                PRO
                              </span>
                            )}
                            {msg.isAiCoHost && (
                              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                LIVEKIT AI CO-HOST
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-mono text-xs text-slate-400 tabular-nums">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed">
                        {localizedText}
                      </p>

                      {/* Embedded Live 60fps JSON Pointer Widget inside Message */}
                      {msg.widget && (
                        <div className="rounded-lg bg-[#0B1A11] border border-[#1F3B2A] p-3.5 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01] flex items-center gap-1">
                                  <Pin className="w-3 h-3" />
                                  {isFr
                                    ? 'WIDGET 60FPS EN DIRECT'
                                    : '60FPS LIVE TELEMETRY WIDGET'}{' '}
                                  · {msg.widget.type.toUpperCase()}
                                </span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#050D08] text-cyan-300 border border-cyan-500/30">
                                  SYNCED @ {activeMatch.minute}&apos;
                                </span>
                              </div>
                              <div className="font-display font-bold text-sm text-white">
                                {msg.widget.title}
                              </div>
                              <div className="text-xs text-slate-400">
                                {msg.widget.subtitle}
                              </div>
                            </div>

                            <div className="sm:text-right bg-[#050D08] px-3.5 py-2 rounded-lg border border-[#162B1E] shrink-0">
                              <div className="font-wide text-base font-extrabold text-[#B8FF01] tabular-nums">
                                {msg.widget.type === 'xg-chart'
                                  ? `${activeMatch.homeXG.toFixed(2)} — ${activeMatch.awayXG.toFixed(2)} xG`
                                  : msg.widget.type === 'player-rating'
                                  ? `${topPlayer.rating.toFixed(1)} ★`
                                  : msg.widget.metricPrimary}
                              </div>
                              <div className="font-mono text-[11px] text-slate-300 tabular-nums">
                                {msg.widget.metricSecondary}
                              </div>
                            </div>
                          </div>

                          {/* Lightweight JSON Pointer Pill */}
                          <div className="pt-2 border-t border-[#162B1E] flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                            <span className="inline-flex items-center gap-1 text-cyan-400">
                              <Code2 className="w-3 h-3" />
                              JSON Pointer:
                            </span>
                            <code className="text-slate-300 bg-[#050D08] px-2 py-0.5 rounded border border-[#162B1E] truncate">
                              {`{ "widgetType": "${widgetPointer.widgetType}", "matchId": "${widgetPointer.matchId}", "sharedAtMinute": ${widgetPointer.sharedAtMinute} }`}
                            </code>
                          </div>
                        </div>
                      )}

                      {/* Reactions */}
                      <div className="flex items-center gap-2 pt-1">
                        {msg.reactions.map((r, i) => {
                          const reactionKey = `${msg.id}-${r.emoji}-${i}`;
                          const extra = localReactionBumps[reactionKey] || 0;
                          return (
                            <button
                              key={reactionKey}
                              type="button"
                              onClick={() =>
                                setLocalReactionBumps((prev) => ({
                                  ...prev,
                                  [reactionKey]: (prev[reactionKey] || 0) + 1,
                                }))
                              }
                              className="px-2.5 py-1 rounded-md bg-[#08140C] hover:bg-[#0B1A11] border border-[#162B1E] text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>{r.emoji}</span>
                              <span className="font-mono text-[11px] tabular-nums">
                                {r.count + extra}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 1-Tap Drop Live Widget Bar + Chat Input */}
              <div className="p-5 bg-[#0B1A11]/70 border-t border-[#162B1E] space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8FF01]" />
                    {isFr
                      ? 'Partager un pointeur JSON de widget 60fps dans le chat (+10 FanScore) :'
                      : '1-Tap Drop 60fps JSON Widget Pointer into Chat (+10 FanScore):'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDropPresetWidget('xg-chart')}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#050D08] hover:bg-[#08140C] border border-[#1F3B2A] hover:border-[#B8FF01]/60 text-left transition-all cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-[#B8FF01] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {isFr ? 'Poussée xG' : 'xG Surge'}
                      </div>
                      <div className="font-mono text-[11px] text-[#B8FF01] truncate tabular-nums">
                        {activeMatch.homeXG.toFixed(2)} vs{' '}
                        {activeMatch.awayXG.toFixed(2)} xG
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDropPresetWidget('player-rating')}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#050D08] hover:bg-[#08140C] border border-[#1F3B2A] hover:border-[#B8FF01]/60 text-left transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-[#B8FF01] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {isFr ? 'Note Joueur' : 'Player Rating'}
                      </div>
                      <div className="font-mono text-[11px] text-[#B8FF01] truncate tabular-nums">
                        {topPlayer.name.split(' ').pop()} {topPlayer.rating.toFixed(1)} ★
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDropPresetWidget('ai-highlight')}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#050D08] hover:bg-[#08140C] border border-[#1F3B2A] hover:border-[#B8FF01]/60 text-left transition-all cursor-pointer"
                  >
                    <Film className="w-4 h-4 text-[#B8FF01] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {isFr ? 'Extrait But' : 'Goal Clip'}
                      </div>
                      <div className="font-mono text-[11px] text-[#B8FF01] truncate">
                        67&apos; Havertz (0.64 xG)
                      </div>
                    </div>
                  </button>
                </div>

                <form
                  onSubmit={handleSendSquadChat}
                  className="flex items-center gap-2.5 pt-1"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      isFr
                        ? 'Écrire un message à votre Squad...'
                        : `Message ${currentSquad.name} (${activeSubChannel})...`
                    }
                    className="flex-1 bg-[#050D08] border border-[#1F3B2A] focus:border-[#B8FF01] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Envoyer' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          02 · LIVE TACTICAL CHALLENGES (FANSCORE PICK'EM) — APPLE 5.3.2 COMPLIANT
      ===================================================================== */}
      <section
        id="section-predictions"
        className="border-b border-[#162B1E] py-16 lg:py-20 px-6"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {pureTacticalMode ? (
            <div className="rounded-2xl bg-[#08140C] border border-[#162B1E] p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/15 border border-[#00F59B]/40 text-[#00F59B] mx-auto flex items-center justify-center">
                <Crosshair className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {isFr ? 'Défis Gamifiés Masqués en Mode Pur Tactique' : 'Gamification Collapsed in Pure Tactical Mode'}
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {isFr
                  ? 'Les cartes FanScore Pick’Em et la boutique de fidélité sont masquées pour garantir une expérience de match 100% statistique et sans distraction.'
                  : 'FanScore Pick’Em challenge cards and loyalty redemption are collapsed so purist supporters experience a distraction-free statistical Match Center.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => togglePureTacticalMode(false)}
                  className="px-4 py-2 rounded-xl bg-[#00F59B] text-[#050D08] font-bold text-xs cursor-pointer hover:bg-[#00d685]"
                >
                  {isFr ? 'Désactiver le Mode Pur Tactique' : 'Disable Pure Tactical Mode'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                      {isFr
                        ? '02 · DÉFIS TACTIQUES EN DIRECT (FANSCORE PICK’EM)'
                        : "02 · LIVE TACTICAL CHALLENGES (FANSCORE PICK'EM)"}
                    </p>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      APPLE GUIDELINE 5.3.2 COMPLIANT · 100% FREE-TO-PLAY
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {isFr
                      ? 'Défis Tactiques Gratuits & Fidélité Numérique FanScore.'
                      : "Live Tactical Challenges (FanScore Pick'Em)."}
                  </h2>
                  <p className="text-base text-slate-400 leading-relaxed">
                    {isFr
                      ? '100% gratuit, sans mise d’argent réel ni valeur monétaire. Testez votre lecture tactique du match pour débloquer des badges de profil, des packs vocaux Sonic-3.6 et des vues caméras tactiques.'
                      : '100% free-to-play skill challenges with zero real-money wagering or cash value. Test your live tactical IQ to unlock digital profile frames, Cartesia Sonic-3.6 voice packs, and All-22 camera angles.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#08140C] border border-[#162B1E] self-start lg:self-end">
                  <Flame className="w-4 h-4 text-[#B8FF01]" />
                  <span className="font-mono text-xs text-slate-300">
                    {isFr ? 'Solde Fidélité :' : 'Loyalty Balance:'}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#B8FF01] tabular-nums">
                    {user.fanScore.toLocaleString()} PTS
                  </span>
                </div>
              </div>

              {/* Persistent Compliance Badge on Tactical Challenges View */}
              <div className="rounded-xl bg-[#050D08] border border-[#1F3B2A] p-3.5 flex items-center justify-between gap-3 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F59B] shrink-0" />
                  <span>
                    100% Free-to-Play Skill Challenges (Apple Guideline 5.3.2 Compliant). FanScore points are virtual, have no monetary value, and cannot be purchased, transferred, or cashed out.
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] shrink-0 font-bold">
                  GUIDELINE 5.3.2
                </span>
              </div>

          {/* 3 Live Tactical Challenge (Pick'Em) Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {microPredictions.map((pred) => {
              const isLocked = Boolean(pred.userChoice);
              const prFr = PREDICTION_FR[pred.id];
              const displayMinute =
                isFr && prFr ? prFr.matchMinute : pred.matchMinute;
              const displayQuestion =
                isFr && prFr ? prFr.question : pred.question;
              const displayContext =
                isFr && prFr ? prFr.contextMetric : pred.contextMetric;

              return (
                <div
                  key={pred.id}
                  className={`rounded-xl p-6 border flex flex-col justify-between gap-6 transition-all ${
                    isLocked
                      ? 'bg-[#0B1A11] border-[#B8FF01]/70'
                      : 'bg-[#08140C] border-[#162B1E] hover:border-[#244430]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#B8FF01]">
                        {displayMinute}
                      </span>
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#B8FF01]/15 text-[#B8FF01] border border-[#B8FF01]/30">
                        +{pred.pointsReward} FanScore
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white leading-snug">
                      {displayQuestion}
                    </h3>

                    <p className="text-xs text-slate-300 bg-[#050D08] border border-[#162B1E] rounded-lg p-3 leading-relaxed">
                      {displayContext}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {!isLocked ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => submitMicroPrediction(pred.id, 'yes')}
                          className="py-3 px-4 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between"
                        >
                          <span>{isFr ? 'OUI' : 'YES'}</span>
                          <span className="font-mono tabular-nums">
                            {pred.yesOddsPct}%
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => submitMicroPrediction(pred.id, 'no')}
                          className="py-3 px-4 rounded-lg bg-[#050D08] hover:bg-[#0B1A11] text-white border border-[#244430] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between"
                        >
                          <span>{isFr ? 'NON' : 'NO'}</span>
                          <span className="font-mono text-slate-400 tabular-nums">
                            {pred.noOddsPct}%
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-[#050D08] border border-[#B8FF01]/40 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#B8FF01] font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          {isFr
                            ? `Choix tactique verrouillé (${pred.userChoice?.toUpperCase()})`
                            : `Pick'Em Locked (${pred.userChoice?.toUpperCase()})`}
                        </span>
                        <span className="font-mono text-[#B8FF01] font-bold">
                          +{pred.pointsReward} PTS
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{pred.sponsorName}</span>
                      <span>
                        {isFr
                          ? '100% Gratuit · Sans mise'
                          : 'Free-to-Play · Zero Wager'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Non-Monetary Digital Loyalty Rewards Store */}
          <div className="pt-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                  {isFr
                    ? 'RÉCOMPENSES NUMÉRIQUES DE FIDÉLITÉ (SANS VALEUR MONÉTAIRE)'
                    : 'DIGITAL LOYALTY REWARDS (100% NON-MONETARY)'}
                </p>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  {isFr
                    ? 'Débloquez des badges, voix IA et angles tactiques'
                    : 'Unlock digital profile badges, AI voices & tactical angles'}
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {isFr
                  ? 'Conforme Apple 5.3.2 · Aucune valeur monétaire'
                  : 'Apple 5.3.2 Compliant · Zero cash value'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {rewardsCatalog.map((reward) => {
                const isRedeemed = user.redeemedRewards.includes(reward.id);
                const canAfford = user.fanScore >= reward.costPoints;
                const rwFr = REWARD_FR[reward.id];

                return (
                  <div
                    key={reward.id}
                    className="rounded-xl bg-[#08140C] border border-[#162B1E] p-5 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1A11] text-[#B8FF01] border border-[#1F3B2A]">
                          {isFr && rwFr ? rwFr.badgeText : reward.badgeText}
                        </span>
                        <Gift className="w-4 h-4 text-[#B8FF01]" />
                      </div>

                      <h4 className="font-display font-bold text-base text-white">
                        {isFr && rwFr ? rwFr.title : reward.title}
                      </h4>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isFr && rwFr ? rwFr.description : reward.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#162B1E] flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-[#B8FF01] tabular-nums">
                        {reward.costPoints} PTS
                      </span>

                      <button
                        type="button"
                        disabled={isRedeemed}
                        onClick={() => redeemReward(reward)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isRedeemed
                            ? 'bg-[#0B1A11] text-[#B8FF01] border border-[#1F3B2A] cursor-default'
                            : canAfford
                            ? 'bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08]'
                            : 'bg-[#050D08] text-slate-400 border border-[#162B1E]'
                        }`}
                      >
                        {isRedeemed ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isFr ? 'Débloqué' : 'Unlocked'}
                          </span>
                        ) : isFr ? (
                          'Échanger'
                        ) : (
                          'Redeem'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mandatory Store Compliance Footer (Apple Guideline 5.3.2) */}
            <div className="rounded-xl bg-[#050D08] border border-[#1F3B2A] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B8FF01] shrink-0 mt-0.5" />
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  100% Free-to-Play Skill Challenges (Apple Guideline 5.3.2 Compliant). FanScore points are virtual, have no monetary value, and cannot be purchased, transferred, or cashed out. Apple Inc. and Google LLC are not sponsors of, nor affiliated with, Scorecer rewards.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded bg-[#0B1A11] text-[#B8FF01] border border-[#1F3B2A] shrink-0">
                GUIDELINE 5.3.2 COMPLIANT
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  </section>

      {/* =====================================================================
          03 · PUBLIC MATCH MEGATHREAD (SCORELINE-ADAPTIVE TWO-STAGE NLP SHIELD)
      ===================================================================== */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {pureTacticalMode ? (
            <div className="rounded-2xl bg-[#08140C] border border-[#00F59B]/30 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/15 border border-[#00F59B]/40 text-[#00F59B] mx-auto flex items-center justify-center">
                <Crosshair className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {isFr
                  ? 'Fil Public Megathread Masqué en Mode Pur Tactique'
                  : 'Public Megathread Collapsed in Pure Tactical Mode'}
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {isFr
                  ? 'Les réactions de supporters et les débats publics sont masqués pour concentrer toute la bande passante visuelle sur la télémétrie du match en direct.'
                  : 'Public social comment streams and reaction threads are collapsed for distraction-free tactical analysis.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => togglePureTacticalMode(false)}
                  className="px-4 py-2 rounded-xl bg-[#00F59B] text-[#050D08] font-bold text-xs cursor-pointer hover:bg-[#00d685]"
                >
                  {isFr ? 'Désactiver le Mode Pur Tactique' : 'Disable Pure Tactical Mode'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Editorial Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr
                ? '03 · BOUCLIER NLP À DEUX ÉTAPES ADAPTATIF AU SCORE'
                : '03 · SCORELINE-ADAPTIVE TWO-STAGE NLP MODERATION SHIELD'}
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Toute la ferveur des tribunes. Zéro pollution.'
                : 'All the stadium rivalry. None of the toxic spam.'}
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'L’Étape 1 autorise les expressions culturelles de football (« parked the bus », « bottled it ») avec un badge VALID BANTER. L’Étape 2 bloque les insultes, dog-whistles extrémistes (88/18) et spams crypto avec une courbe de sensibilité -0.352 quand une équipe est menée.'
                : 'Stage 1 whitelists cultural football idioms ("parked the bus", "bottled it", "cooked") with a green VALID BANTER badge. Stage 2 quarantines personal abuse, extremist dog-whistle numerology (88/18), and crypto spam along a -0.352 deficit decay curve.'}
            </p>

            {/* 1-Click Test Buttons in EN/FR */}
            <div className="space-y-2.5 pt-2">
              <div className="font-mono text-xs uppercase tracking-wider text-slate-300">
                {isFr
                  ? 'Tester le Bouclier NLP à 2 étapes en 1 clic :'
                  : '1-Click Two-Stage NLP Shield Tests:'}
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSubmitMegathread(
                    isFr
                      ? 'Arsenal qui gare le bus dans les 10 dernières minutes, tenez bon !'
                      : 'Arsenal parking the bus in the last 10 minutes, hold that nerve!'
                  )
                }
                className="w-full text-left p-3.5 rounded-lg bg-[#08140C] hover:bg-[#0B1A11] border border-[#162B1E] hover:border-[#B8FF01]/50 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <span className="text-xs sm:text-sm text-slate-200 truncate">
                  {isFr
                    ? '🔥 Étape 1 : Chambrage (« parking the bus... »)'
                    : '🔥 Stage 1 Whitelist ("Arsenal parking the bus...")'}
                </span>
                <span className="font-mono text-xs text-[#B8FF01] shrink-0">
                  VALID BANTER (+10)
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSubmitMegathread(
                    isFr
                      ? 'Rice qui décroche en Zone 14 a totalement bloqué la progression xG du 4-2-4'
                      : 'Rice dropping into Zone 14 completely shut down the 4-2-4 central xG progression'
                  )
                }
                className="w-full text-left p-3.5 rounded-lg bg-[#08140C] hover:bg-[#0B1A11] border border-[#162B1E] hover:border-[#B8FF01]/50 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <span className="text-xs sm:text-sm text-slate-200 truncate">
                  {isFr
                    ? '🧠 Analyse Tactique (« Rice en Zone 14... »)'
                    : '🧠 Tactical Insight ("Rice dropping into Zone 14...")'}
                </span>
                <span className="font-mono text-xs text-[#B8FF01] shrink-0">
                  +15 PTS
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSubmitMegathread(
                    'You are an idiot 88 buy my crypto pump token scam'
                  )
                }
                className="w-full text-left p-3.5 rounded-lg bg-[#08140C] hover:bg-[#0B1A11] border border-[#162B1E] hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <span className="text-xs sm:text-sm text-slate-300 truncate">
                  {isFr
                    ? '🛡️ Étape 2 : Insulte / Dog-Whistle 88 / Spam Crypto'
                    : '🛡️ Stage 2 Shield: Abuse / 88 Dog-Whistle / Crypto Spam'}
                </span>
                <span className="font-mono text-xs text-rose-400 shrink-0">
                  {isFr ? 'Quarantaine' : 'Quarantined'}
                </span>
              </button>
            </div>

            {lastModerationResult && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  lastModerationResult.status === 'filtered-toxic'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-[#0B1A11] border-[#B8FF01]/40 text-slate-200'
                }`}
              >
                {lastModerationResult.status === 'filtered-toxic' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#B8FF01] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-mono uppercase font-semibold text-[#B8FF01]">
                    {lastModerationResult.status === 'filtered-toxic'
                      ? isFr
                        ? 'STAGE_2_TOXICITY_SHIELD · Quarantaine'
                        : 'STAGE_2_TOXICITY_SHIELD · Quarantined'
                      : lastModerationResult.status === 'verified-analysis'
                      ? isFr
                        ? 'Analyse Tactique Vérifiée (+15 PTS)'
                        : 'Verified Tactical Insight (+15 PTS)'
                      : isFr
                      ? 'STAGE_1_BANTER_WHITELIST · VALID BANTER (+10 PTS)'
                      : 'STAGE_1_BANTER_WHITELIST · VALID BANTER (+10 PTS)'}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {lastModerationResult.reason}
                  </p>
                </div>
              </div>
            )}

            <div className="relative h-44 rounded-xl overflow-hidden border border-[#162B1E]">
              <img
                src="/images/hero-goalnet.jpg"
                alt="Stadium goal net view"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/40 to-transparent" />
              <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200">
                  {activeMatch.homeTeam} vs {activeMatch.awayTeam}
                </span>
                <span className="text-[#B8FF01]">
                  {isFr ? '99.4% Précision NLP' : '99.4% NLP Precision'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Live Public Megathread Feed with Moderation Shield Monitor */}
          <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] overflow-hidden flex flex-col">
            {/* Moderation Shield Monitor Header */}
            <div className="px-6 py-4 bg-[#0B1A11] border-b border-[#162B1E] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B8FF01]" />
                  <h3 className="font-display font-bold text-base text-white">
                    {isFr
                      ? 'Moniteur du Bouclier de Modération NLP'
                      : 'Moderation Shield Monitor · Public Megathread'}
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#B8FF01] tabular-nums">
                  {megathreadPosts.length} {isFr ? 'messages' : 'posts'}
                </span>
              </div>

              {/* Scoreline-Adaptive Sensitivity State Bar */}
              <div className="p-3 rounded-lg bg-[#050D08] border border-[#1F3B2A] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {isFr
                      ? 'ÉTAT DE SENSIBILITÉ ADAPTATIF AU SCORE'
                      : 'SCORELINE-ADAPTIVE NLP SENSITIVITY STATE'}
                  </div>
                  {isDeficitShieldMode ? (
                    <div className="font-mono text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>
                        High-Alert Deficit Mode (-0.352 Decay Curve Active —
                        Away Team Trailing)
                      </span>
                    </div>
                  ) : (
                    <div className="font-mono text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Standard Mode (Scoreline Tied)</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setOverrideShieldMode('standard')}
                    className={`px-2.5 py-1 rounded font-mono text-[10px] cursor-pointer border ${
                      !isDeficitShieldMode
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-[#08140C] text-slate-400 border-[#162B1E]'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverrideShieldMode('deficit')}
                    className={`px-2.5 py-1 rounded font-mono text-[10px] cursor-pointer border ${
                      isDeficitShieldMode
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-[#08140C] text-slate-400 border-[#162B1E]'
                    }`}
                  >
                    -0.352 Deficit Mode
                  </button>
                </div>
              </div>
            </div>

            {/* Post Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitMegathread(megaInput);
              }}
              className="p-4 bg-[#050D08] border-b border-[#162B1E] flex items-center gap-2.5"
            >
              <input
                type="text"
                value={megaInput}
                onChange={(e) => setMegaInput(e.target.value)}
                placeholder={
                  isFr
                    ? 'Partagez votre réaction ou analyse tactique...'
                    : 'Post your live reaction, banter, or tactical take...'
                }
                className="flex-1 bg-[#08140C] border border-[#1F3B2A] focus:border-[#B8FF01] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-colors cursor-pointer"
              >
                {isFr ? 'Publier' : 'Post'}
              </button>
            </form>

            {/* Posts List */}
            <div className="p-6 space-y-4 max-h-[520px] overflow-y-auto">
              {megathreadPosts.map((post) => {
                const isToxic = post.moderationStatus === 'filtered-toxic';
                const isRevealed = revealedToxicIds.includes(post.id);
                const isUpvoted = upvotedPostIds.includes(post.id);
                const displayPostText =
                  isFr && MEGATHREAD_FR[post.id]
                    ? MEGATHREAD_FR[post.id]
                    : post.text;

                return (
                  <div
                    key={post.id}
                    className={`rounded-xl p-4 border transition-all ${
                      isToxic
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : 'bg-[#050D08] border-[#162B1E]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">
                          {post.author}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {post.handle}
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#08140C] border border-[#162B1E] text-slate-300">
                          {post.clubBadge}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        {post.timestamp}
                      </span>
                    </div>

                    {isToxic && !isRevealed ? (
                      <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-3 my-1">
                        <div className="flex items-center gap-2 text-xs text-rose-200">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            {isFr
                              ? `STAGE_2_TOXICITY_SHIELD (${post.nlpConfidence}%) : Insulte, dog-whistle ou spam mis en quarantaine.`
                              : `STAGE_2_TOXICITY_SHIELD (${post.nlpConfidence}%): Abusive, dog-whistle, or spam content quarantined.`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedToxicIds((prev) => [...prev, post.id])
                          }
                          className="font-mono text-[11px] underline text-rose-300 hover:text-white shrink-0 cursor-pointer"
                        >
                          {isFr ? 'Voir' : 'Inspect'}
                        </button>
                      </div>
                    ) : (
                      <p
                        className={`text-sm leading-relaxed ${
                          isToxic
                            ? 'text-rose-300 line-through opacity-75'
                            : 'text-slate-200'
                        }`}
                      >
                        {displayPostText}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#162B1E]">
                      <div className="flex flex-wrap items-center gap-2">
                        {post.moderationStatus === 'verified-analysis' && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#B8FF01]/15 text-[#B8FF01] border border-[#B8FF01]/30">
                            ✓{' '}
                            {isFr
                              ? `ANALYSE TACTIQUE (${post.nlpConfidence}%)`
                              : `VERIFIED TACTICAL INSIGHT (${post.nlpConfidence}%)`}
                          </span>
                        )}
                        {post.moderationStatus === 'approved-banter' && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                            ✓ VALID BANTER · STAGE 1 WHITELIST (
                            {post.nlpConfidence}%)
                            {post.banterIdiomMatched
                              ? ` · "${post.banterIdiomMatched}"`
                              : ''}
                          </span>
                        )}
                        {isToxic && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            ✕ STAGE 2 QUARANTINE (-0.352 DECAY)
                          </span>
                        )}
                      </div>

                      {!isToxic && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isUpvoted) return;
                            setUpvotedPostIds((prev) => [...prev, post.id]);
                            addFanScore(
                              2,
                              isFr
                                ? 'Vote positif sur le salon public'
                                : 'Upvoted community post'
                            );
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer tabular-nums ${
                            isUpvoted
                              ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                              : 'bg-[#08140C] hover:bg-[#0B1A11] text-slate-300 border border-[#162B1E]'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{post.upvotes + (isUpvoted ? 1 : 0)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
          )}
        </div>
      </section>
    </div>
  );
};
