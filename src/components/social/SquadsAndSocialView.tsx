import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Film,
  Flame,
  Gift,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Users,
  Volume2,
  Zap,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { SharedLiveWidget, SquadMessage } from '../../types/scorecer';

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
      author: 'Luka V.',
      authorHandle: '@luka_xthreat',
      avatarColor: '#B8FF01',
      timestamp: "71:15'",
      text: "Arsenal's PPDA sitting at 7.4 against Real Madrid in a Quarter-Final is absurdly elite. Look at the live Win Probability swing:",
      isPro: true,
      widget: {
        type: 'win-prob',
        title: 'Live Win Probability',
        subtitle: 'Home 64% · Draw 22% · Away 14%',
        metricPrimary: '64% ARS',
        metricSecondary: '+16% post-Havertz Goal',
        accentColor: '#B8FF01',
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
      author: 'Carlos M.',
      authorHandle: '@carlos_bernabeu',
      avatarColor: '#38BDF8',
      timestamp: "73:40'",
      text: 'Ancelotti just switched to 4-2-4! One ball over the top to Mbappe or Vini and we are right back in this tie. Hala Madrid!',
      isPro: false,
      widget: {
        type: 'ai-highlight',
        title: "39' Mbappe 34.8 km/h Transition Goal",
        subtitle: 'Auto-Clipped Highlight · 109 dB Roar',
        metricPrimary: '0.51 xG',
        metricSecondary: '0:27 Clip Ready',
        accentColor: '#B8FF01',
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
    matchMinute: "ARRÊT DE JEU · 79'",
    question:
      'Le coup franc de 22m de Bukayo Saka côté droit sera-t-il cadré ?',
    contextMetric:
      'Contexte IA : Saka cadre 41% de ses coups francs directs depuis la Zone 15 ; taux d’arrêt de Courtois à 82%.',
  },
  'pred-2': {
    matchMinute: "5 PROCHAINES MINUTES · 80'-85'",
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
  'rew-ppv-pass': {
    title: 'Pass Stream Direct Match Unique (PPV)',
    description:
      'Débloquez un match en direct 1080p60 (Serie A, MLS Next Pro ou club partenaire) avec vos points.',
    badgeText: 'POPULAIRE',
  },
  'rew-pro-week': {
    title: 'Accès Scorecer Pro Tactique — 7 Jours',
    description:
      'Zéro mention sponsor, export des données xG et questions illimitées à l’Assistant Match IA.',
    badgeText: 'EXPERT',
  },
  'rew-badge-oracle': {
    title: 'Badge de Squad « Oracle xG »',
    description:
      'Distinction exclusive visible sur votre profil dans tous les Squads et salons publics de match.',
    badgeText: 'ÉDITION LIMITÉE',
  },
  'rew-o2o-drink': {
    title: 'Accès Prioritaire Soirée Match & Avantage Pub',
    description:
      'Table réservée et boisson offerte dans les pubs partenaires certifiés Scorecer.',
    badgeText: 'SOIRÉE PUB',
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
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  // Watch Party Voice State
  const [inVoiceChannel, setInVoiceChannel] = useState<boolean>(true);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);

  // Squad Chat State
  const [chatInput, setChatInput] = useState<string>('');
  const [localReactionBumps, setLocalReactionBumps] = useState<
    Record<string, number>
  >({});

  // Megathread Moderation State
  const [megaInput, setMegaInput] = useState<string>('');
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
  const displayedSquadMessages =
    directMessages.length > 0
      ? directMessages
      : FALLBACK_SQUAD_MESSAGES[activeSquadId] || squadMessages;

  const topPlayer =
    [...players].sort((a, b) => b.rating - a.rating)[0] || {
      name: 'Bukayo Saka',
      rating: 9.1,
      ratingDelta: 0.8,
      xg: 0.89,
      xa: 0.62,
    };

  const handleSendSquadChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendSquadMessage(chatInput.trim());
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
      };
    } else if (presetType === 'player-rating') {
      widget = {
        type: 'player-rating',
        title: isFr
          ? `${topPlayer.name} · Note du match`
          : `${topPlayer.name} · Live Player Rating`,
        subtitle: `${topPlayer.xg} xG · ${topPlayer.xa} xA`,
        metricPrimary: `${topPlayer.rating.toFixed(1)} ★`,
        metricSecondary: isFr
          ? `▲ +${Math.abs(topPlayer.ratingDelta).toFixed(1)} sur 15 min`
          : `▲ +${Math.abs(topPlayer.ratingDelta).toFixed(1)} last 15m`,
        accentColor: '#B8FF01',
      };
    } else {
      widget = {
        type: 'ai-highlight',
        title: isFr
          ? "67' Extrait But Havertz (0.64 xG)"
          : "67' Havertz Goal Clip (0.64 xG)",
        subtitle: isFr
          ? 'Centre en retrait de Saka · Clameur 114 dB'
          : 'Saka half-space cutback · 114 dB roar',
        metricPrimary: "67' · 0.64 xG",
        metricSecondary: isFr ? 'Vidéo 0:24' : '0:24 Clip',
        accentColor: '#B8FF01',
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

              {/* Live Voice Room Card */}
              <div className="rounded-xl bg-[#08140C] border border-[#162B1E] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#B8FF01] animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#B8FF01] font-semibold">
                      {isFr ? 'SALON VOCAL LIVE' : 'LIVE VOICE ROOM'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {isFr ? 'Sync 12ms' : '12ms sync'}
                  </span>
                </div>

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
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !inVoiceChannel;
                      setInVoiceChannel(next);
                      triggerToast(
                        next
                          ? isFr
                            ? 'Connecté au salon vocal du Squad !'
                            : 'Joined Squad live voice room!'
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

            {/* Right Column (8 cols): Squad Chat Thread + 1-Tap Live Widget Dropper */}
            <div className="lg:col-span-8 rounded-xl bg-[#08140C] border border-[#162B1E] overflow-hidden flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 bg-[#0B1A11] border-b border-[#162B1E] flex flex-wrap items-center justify-between gap-3">
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
                      ? 'Les widgets partagés se mettent à jour automatiquement avec le match en direct.'
                      : 'Shared widgets stay live-synced as the match clock ticks.'}
                  </p>
                </div>

                <span className="font-mono text-xs px-3 py-1 rounded-md bg-[#050D08] border border-[#162B1E] text-[#B8FF01]">
                  {currentSquad.onlineCount} {isFr ? 'connectés' : 'in chat'}
                </span>
              </div>

              {/* Messages Stream */}
              <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto">
                {displayedSquadMessages.map((msg) => {
                  const localizedText =
                    isFr && MESSAGE_TEXT_FR[msg.id]
                      ? MESSAGE_TEXT_FR[msg.id]
                      : msg.text;

                  return (
                    <div
                      key={msg.id}
                      className="rounded-xl bg-[#050D08] border border-[#162B1E] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#050D08]"
                            style={{ backgroundColor: '#B8FF01' }}
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
                          </div>
                        </div>
                        <span className="font-mono text-xs text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed">
                        {localizedText}
                      </p>

                      {/* Embedded Live Widget inside Message */}
                      {msg.widget && (
                        <div className="rounded-lg bg-[#0B1A11] border border-[#1F3B2A] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01]">
                              {isFr ? 'WIDGET EN DIRECT' : 'LIVE MATCH WIDGET'} ·{' '}
                              {msg.widget.type.toUpperCase()}
                            </span>
                            <div className="font-display font-bold text-sm text-white">
                              {msg.widget.title}
                            </div>
                            <div className="text-xs text-slate-400">
                              {msg.widget.subtitle}
                            </div>
                          </div>

                          <div className="sm:text-right bg-[#050D08] px-3.5 py-2 rounded-lg border border-[#162B1E] shrink-0">
                            <div className="font-wide text-base font-extrabold text-[#B8FF01]">
                              {msg.widget.metricPrimary}
                            </div>
                            <div className="font-mono text-[11px] text-slate-300">
                              {msg.widget.metricSecondary}
                            </div>
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
                              <span className="font-mono text-[11px]">
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
                      ? 'Partager un widget live dans le chat (+10 FanScore) :'
                      : '1-Tap Drop Live Match Widget into Chat (+10 FanScore):'}
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
                      <div className="font-mono text-[11px] text-[#B8FF01] truncate">
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
                      <div className="font-mono text-[11px] text-[#B8FF01] truncate">
                        Saka 9.1 ★
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
                        : `Message ${currentSquad.name}...`
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
        </div>
      </section>

      {/* =====================================================================
          02 · STOP-PLAY MICRO-PREDICTIONS & FANSCORE REWARDS
      ===================================================================== */}
      <section
        id="section-predictions"
        className="border-b border-[#162B1E] py-16 lg:py-20 px-6"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr
                  ? '02 · PRONOSTICS D’ARRÊT DE JEU & RÉCOMPENSES FANSCORE'
                  : '02 · STOP-PLAY MICRO-PREDICTIONS & FANSCORE REWARDS'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Transformez votre lecture du jeu en FanScore.'
                  : 'Turn your football IQ into FanScore.'}
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                {isFr
                  ? 'Chaque coup franc, corner ou bascule tactique ouvre un pronostic rapide. Verrouillez OUI ou NON avant le coup de sifflet et échangez vos points contre des streams ou des avantages au pub.'
                  : 'Every free-kick, VAR check, or tactical shift triggers a live micro-prediction. Lock in YES or NO before the whistle and redeem your FanScore for streams or pub perks.'}
              </p>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#08140C] border border-[#162B1E] self-start lg:self-end">
              <Flame className="w-4 h-4 text-[#B8FF01]" />
              <span className="font-mono text-xs text-slate-300">
                {isFr ? 'Solde disponible :' : 'Available Balance:'}
              </span>
              <span className="font-mono text-sm font-bold text-[#B8FF01]">
                {user.fanScore.toLocaleString()} PTS
              </span>
            </div>
          </div>

          {/* 3 Stop-Play Micro-Prediction Cards */}
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
                          <span className="font-mono">{pred.yesOddsPct}%</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => submitMicroPrediction(pred.id, 'no')}
                          className="py-3 px-4 rounded-lg bg-[#050D08] hover:bg-[#0B1A11] text-white border border-[#244430] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between"
                        >
                          <span>{isFr ? 'NON' : 'NO'}</span>
                          <span className="font-mono text-slate-400">
                            {pred.noOddsPct}%
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-[#050D08] border border-[#B8FF01]/40 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#B8FF01] font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          {isFr
                            ? `Pronostic validé (${pred.userChoice?.toUpperCase()})`
                            : `Prediction Locked (${pred.userChoice?.toUpperCase()})`}
                        </span>
                        <span className="font-mono text-[#B8FF01] font-bold">
                          +{pred.pointsReward} PTS
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{pred.sponsorName}</span>
                      <span>
                        {isFr ? 'Résolution instantanée' : 'Instant settlement'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FanScore Rewards Store */}
          <div className="pt-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                  {isFr ? 'BOUTIQUE FANSCORE' : 'FANSCORE REWARDS'}
                </p>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  {isFr
                    ? 'Échangez vos points contre des avantages réels'
                    : 'Redeem your points for match passes & pub perks'}
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {isFr
                  ? 'Déblocage en 1 clic · Sans carte bancaire'
                  : '1-click instant unlock · Zero checkout friction'}
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
                      <span className="font-mono text-sm font-bold text-[#B8FF01]">
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          03 · PUBLIC MATCH MEGATHREAD (BANTER VS ABUSE AI GUARD)
      ===================================================================== */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Editorial Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr
                ? '03 · SALON PUBLIC DU MATCH (IA CHAMBRAGE VS ABUS)'
                : '03 · PUBLIC MATCH MEGATHREAD (BANTER VS ABUSE AI GUARD)'}
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Toute la ferveur des tribunes. Zéro pollution.'
                : 'All the stadium rivalry. None of the toxic spam.'}
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Le football vit de chambrage et de débats tactiques. Notre modération IA distingue la vraie passion des supporters (+10 FanScore) et l’analyse tactique (+15 FanScore) des insultes ou arnaques crypto.'
                : 'Football thrives on rivalry banter and tactical debate. Scorecer’s NLP Guard welcomes passionate supporter banter (+10 FanScore) and tactical insight (+15 FanScore) while filtering out personal abuse and spam.'}
            </p>

            {/* 1-Click Test Buttons in EN/FR */}
            <div className="space-y-2.5 pt-2">
              <div className="font-mono text-xs uppercase tracking-wider text-slate-300">
                {isFr
                  ? 'Tester le filtre IA en 1 clic :'
                  : '1-Click Interactive AI Guard Tests:'}
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
                    ? '🔥 Tester un chambrage de supporter (« Arsenal qui gare le bus... »)'
                    : '🔥 Test Rivalry Banter ("Arsenal parking the bus...")'}
                </span>
                <span className="font-mono text-xs text-[#B8FF01] shrink-0">
                  +10 PTS
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
                    ? '🧠 Tester une analyse tactique (« Rice en Zone 14... »)'
                    : '🧠 Test Tactical Insight ("Rice dropping into Zone 14...")'}
                </span>
                <span className="font-mono text-xs text-[#B8FF01] shrink-0">
                  +15 PTS
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSubmitMegathread(
                    'You are an idiot buy my crypto pump token scam'
                  )
                }
                className="w-full text-left p-3.5 rounded-lg bg-[#08140C] hover:bg-[#0B1A11] border border-[#162B1E] hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <span className="text-xs sm:text-sm text-slate-300 truncate">
                  {isFr
                    ? '🛡️ Tester le blocage d’insulte / spam crypto'
                    : '🛡️ Test Toxic Abuse / Crypto Spam Filter'}
                </span>
                <span className="font-mono text-xs text-rose-400 shrink-0">
                  {isFr ? 'Bloqué' : 'Filtered'}
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
                        ? 'Message intercepté par l’IA'
                        : 'Intercepted by AI Guard'
                      : lastModerationResult.status === 'verified-analysis'
                      ? isFr
                        ? 'Analyse Tactique Vérifiée (+15 PTS)'
                        : 'Verified Tactical Insight (+15 PTS)'
                      : isFr
                      ? 'Chambrage Football Approuvé (+10 PTS)'
                      : 'Approved Football Banter (+10 PTS)'}
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

          {/* Right Column (7 cols): Live Public Megathread Feed */}
          <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#0B1A11] border-b border-[#162B1E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8FF01]" />
                <h3 className="font-display font-bold text-base text-white">
                  {isFr
                    ? 'Fil Public du Match en Direct'
                    : 'Live Public Match Megathread'}
                </h3>
              </div>
              <span className="font-mono text-xs text-[#B8FF01]">
                {megathreadPosts.length} {isFr ? 'messages' : 'posts'}
              </span>
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
                      <span className="font-mono text-xs text-slate-400">
                        {post.timestamp}
                      </span>
                    </div>

                    {isToxic && !isRevealed ? (
                      <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-3 my-1">
                        <div className="flex items-center gap-2 text-xs text-rose-200">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            {isFr
                              ? `Filtré par l’IA (${post.nlpConfidence}%) : Insulte ou spam détecté.`
                              : `Filtered by AI Guard (${post.nlpConfidence}%): Abusive or spam content quarantined.`}
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

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#162B1E]">
                      <div>
                        {post.moderationStatus === 'verified-analysis' && (
                          <span className="font-mono text-[11px] text-[#B8FF01]">
                            ✓{' '}
                            {isFr
                              ? `Analyse Tactique (${post.nlpConfidence}%)`
                              : `Verified Tactical Insight (${post.nlpConfidence}%)`}
                          </span>
                        )}
                        {post.moderationStatus === 'approved-banter' && (
                          <span className="font-mono text-[11px] text-slate-300">
                            ✓{' '}
                            {isFr
                              ? `Chambrage Approuvé (${post.nlpConfidence}%)`
                              : `Approved Football Banter (${post.nlpConfidence}%)`}
                          </span>
                        )}
                        {isToxic && (
                          <span className="font-mono text-[11px] text-rose-400">
                            ✕ {isFr ? 'Spam / Abus bloqué' : 'Quarantined'}
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
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
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
      </section>
    </div>
  );
};
