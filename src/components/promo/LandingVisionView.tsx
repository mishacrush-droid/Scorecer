import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  MapPin,
  MessageSquare,
  Pause,
  Play,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { ScorecerLogo } from '../common/ScorecerLogo';
import { HoverPlayVideo } from '../common/HoverPlayVideo';
import { RealMatchDataImporter } from '../match/RealMatchDataImporter';
import { VideoTutorialsAndActionSection } from './VideoTutorialsAndActionSection';
import { TeamAndFaqSection } from './TeamAndFaqSection';
import {
  COMPETITOR_BENCHMARKS_2026,
  SLEEPER_OUTLIER_CALLOUT,
} from '../../services/telemetryProviderAdapter';

interface HighlightVideoItem {
  id: string;
  matchTag: { en: string; fr: string };
  minute: string;
  title: { en: string; fr: string };
  subtitle: { en: string; fr: string };
  duration: string;
  poster: string;
  videoUrl: string;
  scoreline: string;
  beats: {
    label: { en: string; fr: string };
    time: string;
    pct: number;
    description: { en: string; fr: string };
  }[];
  commentary: {
    tactical: { en: string[]; fr: string[] };
    passionate: { en: string[]; fr: string[] };
    neutral: { en: string[]; fr: string[] };
  };
}

const FEATURED_HIGHLIGHTS: HighlightVideoItem[] = [
  {
    id: 'hl-ars-mci',
    matchTag: {
      en: 'CHAMPIONS LEAGUE · LIVE FEED',
      fr: 'LIGUE DES CHAMPIONS · EN DIRECT',
    },
    minute: "67'",
    title: {
      en: 'Havertz first-time volley after Saka half-space cutback',
      fr: 'Volée instantanée de Havertz sur un centre en retrait de Saka',
    },
    subtitle: {
      en: 'Odegaard pins the pivot, Saka attacks the byline, Havertz finishes low inside the near post.',
      fr: 'Odegaard fixe le double pivot, Saka déborde et Havertz conclut au premier poteau.',
    },
    duration: '0:24',
    poster: '/images/highlight-goal.jpg',
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-stadium-43479-large.mp4',
    scoreline: 'ARS 2 — 1 RMA',
    beats: [
      {
        label: { en: 'Build-up', fr: 'Construction' },
        time: '0:04',
        pct: 18,
        description: {
          en: 'Rice & Odegaard combine to break the first pressing line.',
          fr: 'Rice et Odegaard combinent pour casser le premier rideau de pressing.',
        },
      },
      {
        label: { en: 'Cutback', fr: 'Centre en retrait' },
        time: '0:11',
        pct: 48,
        description: {
          en: 'Saka isolates Mendy 1v1 and fires a low pullback across the six-yard box.',
          fr: 'Saka provoque Mendy en 1 contre 1 et glisse un ballon rasant devant le but.',
        },
      },
      {
        label: { en: 'Finish', fr: 'Finition' },
        time: '0:17',
        pct: 74,
        description: {
          en: 'Havertz meets it on the half-volley into the bottom corner (0.64 xG).',
          fr: 'Havertz reprend de demi-volée dans le petit filet (0.64 xG).',
        },
      },
      {
        label: { en: 'Celebration', fr: 'Célébration' },
        time: '0:22',
        pct: 94,
        description: {
          en: 'Emirates hits 114 dB as the North Bank erupts.',
          fr: 'Le stade atteint 114 dB alors que la tribune Nord explose.',
        },
      },
    ],
    commentary: {
      tactical: {
        en: [
          "38'  Arsenal shifted to a 3–2 rest-defense after the equalizer — Odegaard dropping between the CBs to break City's 4–4 mid-block.",
          "41'  City's right half-space is overloaded. Expect a switch to Gvardiol then a cutback lane if Saka stays high.",
        ],
        fr: [
          "38'  Arsenal est passé en couverture 3–2 après l'égalisation — Odegaard décroche entre les centraux pour casser le bloc médian en 4–4.",
          "41'  Le demi-espace droit est surchargé. Attendez-vous à un renversement suivi d'un centre en retrait si Saka reste haut.",
        ],
      },
      passionate: {
        en: [
          "38'  LISTEN TO THIS PLACE! Odegaard is conducting the orchestra and they can't get near him right now!",
          "41'  Saka has his man on toast down that right wing — every time he touches it you can feel a goal coming!",
        ],
        fr: [
          "38'  ÉCOUTEZ CE STADE ! Odegaard dirige l'orchestre et personne ne peut l'approcher ce soir !",
          "41'  Saka fait vivre un cauchemar à son défenseur sur l'aile droite — ça sent le but à chaque prise de balle !",
        ],
      },
      neutral: {
        en: [
          "38'  Arsenal settling back into possession after the equalizer, with Odegaard dropping deeper to collect from the back line.",
          "41'  Sustained pressure down the right channel as Saka looks to create space for a cross into the penalty area.",
        ],
        fr: [
          "38'  Arsenal reprend la possession après l'égalisation, avec Odegaard qui redescend pour organiser le jeu.",
          "41'  Pression constante sur le flanc droit alors que Saka cherche l'ouverture pour centrer dans la surface.",
        ],
      },
    },
  },
  {
    id: 'hl-save',
    matchTag: {
      en: 'PREMIER LEAGUE · STOPPER CAM',
      fr: 'PREMIER LEAGUE · CAMÉRA GARDIEN',
    },
    minute: "74'",
    title: {
      en: 'Full-stretch fingertip save denies top-corner curler',
      fr: 'Parade réflexe du bout des doigts en pleine lucarne',
    },
    subtitle: {
      en: 'High-velocity transition strike parried onto the crossbar at full extension.',
      fr: 'Frappe enroulée sur contre-attaque détournée sur la barre transversale en pleine extension.',
    },
    duration: '0:19',
    poster: '/images/highlight-save.jpg',
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-saving-a-goal-in-a-soccer-match-43484-large.mp4',
    scoreline: 'ARS 2 — 1 MCI',
    beats: [
      {
        label: { en: 'Turnover', fr: 'Récupération' },
        time: '0:03',
        pct: 15,
        description: {
          en: 'Quick interception springs a 3v2 counter through the center circle.',
          fr: 'Interception rapide qui lance un 3 contre 2 plein axe.',
        },
      },
      {
        label: { en: 'Cut Inside', fr: 'Crochet intérieur' },
        time: '0:09',
        pct: 45,
        description: {
          en: 'Winger shifts onto his right foot at the edge of the D.',
          fr: 'L’ailier repique sur son pied droit à l’entrée de la surface.',
        },
      },
      {
        label: { en: 'Fingertip Save', fr: 'Parade décisive' },
        time: '0:14',
        pct: 78,
        description: {
          en: 'Goalkeeper tips the 104 km/h strike over the bar at full stretch.',
          fr: 'Le gardien détourne la frappe à 104 km/h au-dessus de la barre.',
        },
      },
      {
        label: { en: 'Corner Roar', fr: 'Clameur' },
        time: '0:18',
        pct: 95,
        description: {
          en: 'Defenders rally around the keeper as the stadium roars.',
          fr: 'La défense félicite son gardien sous l’ovation du public.',
        },
      },
    ],
    commentary: {
      tactical: {
        en: [
          "73'  Transition triggered from a central turnover — defensive line caught 8 meters higher than standard rest-defense.",
          "74'  Post-shot expected goals (PSxG) clocked at 0.58; fingertip parry preserves the one-goal advantage.",
        ],
        fr: [
          "73'  Transition rapide après une perte de balle axiale — ligne défensive surprise 8 mètres plus haut que prévu.",
          "74'  xG après tir évalué à 0.58 ; la claquette du gardien préserve l'avantage d'un but.",
        ],
      },
      passionate: {
        en: [
          "73'  Heart in mouth moment as they break through the middle!",
          "74'  WHAT A SAVE! Fingertips of steel to claw that out of the top corner — worth a goal all on its own!",
        ],
        fr: [
          "73'  Frisson dans tout le stade sur ce contre éclair !",
          "74'  QUEL ARRÊT MONUMENTAL ! Il va la chercher en pleine lucarne du bout des gants — ça vaut un but !",
        ],
      },
      neutral: {
        en: [
          "73'  Quick breakaway opens up space at the edge of the penalty area for a curling effort.",
          "74'  Brilliant acrobatic stop by the goalkeeper to tip the ball over the crossbar for a corner kick.",
        ],
        fr: [
          "73'  Contre-attaque rapide qui offre un angle de tir à l'entrée de la surface.",
          "74'  Superbe détente du gardien qui détourne le ballon en corner au-dessus de sa transversale.",
        ],
      },
    },
  },
  {
    id: 'hl-tactical',
    matchTag: {
      en: 'SCORECER AI · PITCH VISION',
      fr: 'SCORECER IA · VISION TACTIQUE',
    },
    minute: "81'",
    title: {
      en: 'How the 3-2-5 overload unlocked the low block in four passes',
      fr: 'Comment la surcharge en 3-2-5 a fait sauter le bloc bas en quatre passes',
    },
    subtitle: {
      en: 'Synchronized wide-angle tactical view showing the third-man run before the pass is played.',
      fr: 'Vue tactique grand angle montrant l’appel du troisième homme avant même la passe.',
    },
    duration: '0:27',
    poster: '/images/tactical-pitch.jpg',
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-lit-soccer-stadium-at-night-41566-large.mp4',
    scoreline: 'B04 3 — 2 FCB',
    beats: [
      {
        label: { en: 'Pivot Bait', fr: 'Fixation' },
        time: '0:05',
        pct: 20,
        description: {
          en: 'Double pivot draws both opposition midfielders 6 yards higher.',
          fr: 'Le double pivot attire les deux milieux adverses six mètres plus haut.',
        },
      },
      {
        label: { en: 'Half-Space Pocket', fr: 'Intervalle' },
        time: '0:12',
        pct: 50,
        description: {
          en: 'Number 10 receives on the half-turn between the lines.',
          fr: 'Le numéro 10 reçoit entre les lignes et s’oriente vers le but.',
        },
      },
      {
        label: { en: 'Through Ball', fr: 'Passe cachée' },
        time: '0:19',
        pct: 76,
        description: {
          en: 'Disguised reverse pass splits the center-back and full-back.',
          fr: 'Passe masquée dans l’intervalle entre le central et le latéral.',
        },
      },
      {
        label: { en: 'Clinical 1v1', fr: 'Face-à-face' },
        time: '0:25',
        pct: 93,
        description: {
          en: 'Calm dink over the rushing keeper seals the points.',
          fr: 'Petit ballon piqué plein de sang-froid pour sceller la victoire.',
        },
      },
    ],
    commentary: {
      tactical: {
        en: [
          "80'  Notice how the inverted wing-back drags the weak-side midfielder inward, opening the passing lane.",
          "81'  One vertical pass bypasses four defenders — textbook third-man combination in Zone 14.",
        ],
        fr: [
          "80'  Observez comment le piston intérieur attire le milieu adverse et libère la ligne de passe.",
          "81'  Une seule passe verticale élimine quatre défenseurs — combinaison d'école avec le troisième homme.",
        ],
      },
      passionate: {
        en: [
          "80'  Look at the movement off the ball — pure liquid football under the floodlights!",
          "81'  Defense split wide open! You won't see a cleaner team goal than that all season!",
        ],
        fr: [
          "80'  Regardez ce mouvement sans ballon — du football total sous les projecteurs !",
          "81'  La défense est transpercée ! Quel chef-d'œuvre collectif !",
        ],
      },
      neutral: {
        en: [
          "80'  Patient build-up play around the perimeter of the box waiting for an opening.",
          "81'  Incisive through ball finds the runner in behind for a composed finish.",
        ],
        fr: [
          "80'  Circulation patiente aux abords de la surface en attendant la faille.",
          "81'  Passe lumineuse dans la profondeur pour conclure avec maîtrise.",
        ],
      },
    },
  },
];

export const LandingVisionView: React.FC = () => {
  const {
    setActiveTab,
    uiLanguage,
    openAuthModal,
    activeMatch,
    sendAIChatMessage,
    triggerToast,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';
  const lang = isFr ? 'fr' : 'en';

  const [selectedHighlight, setSelectedHighlight] = useState<HighlightVideoItem>(
    FEATURED_HIGHLIGHTS[0]
  );
  const [activeBeatIdx, setActiveBeatIdx] = useState<number>(2);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [chatInput, setChatInput] = useState<string>('');
  const [localMessages, setLocalMessages] = useState<
    { role: 'user' | 'ai'; en: string; fr: string }[]
  >([
    {
      role: 'user',
      en: 'Why did momentum flip after the 38th?',
      fr: 'Pourquoi la dynamique a-t-elle basculé après la 38e ?',
    },
    {
      role: 'ai',
      en: "City's rest-defense collapsed when Rodri dropped too deep — Arsenal won three consecutive second balls in the half-space. Saka's cutback lane opened once Walker was pinned.",
      fr: 'La couverture défensive a reculé quand Rodri a décroché trop bas — Arsenal a gagné trois seconds ballons consécutifs dans le demi-espace, ouvrant le couloir pour Saka.',
    },
    {
      role: 'user',
      en: 'Show me the key clip.',
      fr: 'Montre-moi la séquence vidéo clé.',
    },
    {
      role: 'ai',
      en: 'Clip queued: 37’–39’ — build-up → turnover → finish. xG jump +0.41 across those two minutes.',
      fr: 'Vidéo prête : 37’–39’ — construction → récupération → finition. Bond de +0.41 xG en deux minutes.',
    },
  ]);

  const [storyBeatIndex, setStoryBeatIndex] = useState<number>(2);
  const [activePersonaTab, setActivePersonaTab] = useState<
    'tactical' | 'passionate' | 'neutral'
  >('tactical');
  const [isSpeakingDemo, setIsSpeakingDemo] = useState<boolean>(false);

  const SIX_PILLARS = [
    {
      num: '01',
      title: isFr ? 'Moteur live ultra-rapide' : 'Low-latency live data engine',
      description: isFr
        ? 'Scores en moins d’une seconde, cartons et remplacements livrés comme le système nerveux du produit—pas un tableau figé.'
        : 'Sub-second scores, cards, and substitutions delivered as the nervous system of the product—not a static table.',
      targetTab: 'match-center' as const,
      posterUrl: '/images/hero-goalnet.jpg',
      videoUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-stadium-43479-large.mp4',
      badgeLabel: isFr ? '0.8s TÉLÉMÉTRIE' : '0.8s TELEMETRY',
    },
    {
      num: '02',
      title: isFr ? 'Analyses rendues limpides' : 'Analytics made accessible',
      description: isFr
        ? 'xG, dynamique, notes et formations expliqués en langage clair—sans jamais vous noyer sous les chiffres.'
        : 'xG, momentum, ratings, and formations explained in plain language—not buried as abstract numbers.',
      targetTab: 'match-center' as const,
      posterUrl: '/images/tactical-pitch.jpg',
      videoUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-lit-soccer-stadium-at-night-41566-large.mp4',
      badgeLabel: isFr ? 'CARTES xG & PASSES' : 'xG & PASS MAPS',
    },
    {
      num: '03',
      title: isFr ? 'Temps forts vidéo IA' : 'Multimodal AI highlights',
      description: isFr
        ? 'Extraits courts générés quasi instantanément dès chaque action clé et clameur du stade.'
        : 'Near-instant short-form clips from structured events plus multimedia signals—scaled across competitions.',
      targetTab: 'ai-hub' as const,
      posterUrl: '/images/highlight-goal.jpg',
      videoUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-the-ball-in-the-stadium-43480-large.mp4',
      badgeLabel: isFr ? 'STORIES 9:16 AUTO' : 'AUTO 9:16 STORIES',
    },
    {
      num: '04',
      title: isFr ? 'Commentaires IA multilingues' : 'Multilingual AI commentary',
      description: isFr
        ? 'Audio riche en émotions qui s’adapte à votre langue et votre style—Tactique, Passionné ou Neutre.'
        : 'Emotion-aware audio that adapts language, style, and depth—Tactical, Passionate, Neutral, and more.',
      targetTab: 'ai-hub' as const,
      posterUrl: '/images/highlight-save.jpg',
      videoUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-saving-a-goal-in-a-soccer-match-43484-large.mp4',
      badgeLabel: isFr ? '6 LANGUES AUDIO' : '6 AUDIO LANGUAGES',
    },
    {
      num: '05',
      title: isFr ? 'Assistant ancré dans le direct' : 'Grounded match conversation',
      description: isFr
        ? 'Une IA conversationnelle connectée aux vraies actions du match en cours, pas à des réponses génériques.'
        : 'Conversational AI constrained by the live match state, not generic pre-trained guesses.',
      targetTab: 'ai-hub' as const,
      posterUrl: '/images/wet-turf.jpg',
      videoUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4',
      badgeLabel: isFr ? 'RAG EN DIRECT' : 'LIVE RAG ENGINE',
    },
    {
      num: '06',
      title: isFr ? 'Modération pensée pour les fans' : 'AI-assisted sports moderation',
      description: isFr
        ? 'Des Squads et salons publics qui distinguent le vrai chambrage footballistique des abus.'
        : 'Squads and megathreads that understand football banter versus abuse—across languages and rivalries.',
      targetTab: 'social-squads' as const,
      posterUrl: '/images/squads-pub.jpg',
      videoUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-friends-watching-a-football-match-in-a-bar-42619-large.mp4',
      badgeLabel: isFr ? 'SQUADS & PUBS' : 'SQUADS & PUBS',
    },
  ];

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

  const handleInlineAsk = (questionText?: string) => {
    const q = (questionText ?? chatInput).trim();
    if (!q) return;
    setChatInput('');

    const replyEn =
      "Arsenal's right-sided overload pinned the full-back inside, creating a clean cutback lane for Havertz's finish (+0.64 xG). Clip queued in your feed.";
    const replyFr =
      'La surcharge côté droit d’Arsenal a fixé le latéral intérieur, ouvrant un couloir parfait pour le centre en retrait vers Havertz (+0.64 xG). Extrait vidéo prêt.';

    setLocalMessages((prev) => [
      ...prev.slice(-3),
      { role: 'user', en: q, fr: q },
      { role: 'ai', en: replyEn, fr: replyFr },
    ]);
    sendAIChatMessage(q);
  };

  const handleSpeakPersona = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      triggerToast(
        isFr ? 'Lecture du commentaire IA...' : 'Playing AI Commentary preview...'
      );
      return;
    }
    if (isSpeakingDemo) {
      window.speechSynthesis.cancel();
      setIsSpeakingDemo(false);
      return;
    }
    window.speechSynthesis.cancel();
    const lines = selectedHighlight.commentary[activePersonaTab][lang].join(' ');
    const utterance = new SpeechSynthesisUtterance(lines.replace(/\d+'/g, ''));
    utterance.lang = isFr ? 'fr-FR' : 'en-GB';
    utterance.rate = activePersonaTab === 'passionate' ? 1.12 : 1.0;
    utterance.pitch = activePersonaTab === 'passionate' ? 1.15 : 0.98;
    utterance.onend = () => setIsSpeakingDemo(false);
    utterance.onerror = () => setIsSpeakingDemo(false);
    setIsSpeakingDemo(true);
    window.speechSynthesis.speak(utterance);
  };

  const currentBeat =
    selectedHighlight.beats[activeBeatIdx] || selectedHighlight.beats[0];

  return (
    <div className="bg-[#050D08] text-slate-100">
      {/* =====================================================================
          1. FULL-BLEED STADIUM HERO (Matches Screenshot 1)
      ===================================================================== */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex items-end border-b border-[#162B1E] overflow-hidden">
        <img
          src="/images/hero-goalnet.jpg"
          alt="View through football goal net onto floodlit stadium pitch"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D08]/90 via-[#050D08]/60 to-[#050D08]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/25 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16 lg:py-24 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          {/* Left Hero Content */}
          <div className="max-w-xl space-y-6">
            <ScorecerLogo size="hero" />

            <h1 className="font-display text-3xl sm:text-4xl md:text-[2.65rem] font-semibold tracking-tight text-white leading-tight">
              {isFr
                ? 'Le football qui pense avec vous.'
                : 'Football that thinks with you.'}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-md">
              {isFr
                ? 'Scores en une fraction de seconde, IA de match conversationnelle et Squads pour vivre chaque action entre passionnés.'
                : 'Sub-second scores, conversational match AI, and Squads that keep the banter on the pitch.'}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => openAuthModal('signup')}
                className="px-6 py-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-[#B8FF01]/10"
              >
                {isFr ? 'Commencer' : 'Get started'}
              </button>
              <button
                onClick={() => openAuthModal('signin')}
                className="px-6 py-3 rounded-lg bg-[#09150E]/80 hover:bg-[#0F2317] text-white font-medium text-sm border border-[#244430] transition-all cursor-pointer backdrop-blur-md"
              >
                {isFr ? 'Connexion' : 'Sign in'}
              </button>
            </div>
          </div>

          {/* Bottom-Right Minimal Live Match Glass Card */}
          <button
            onClick={() => setActiveTab('match-center')}
            className="w-full sm:w-72 bg-[#07120B]/85 hover:bg-[#0B1B11]/95 backdrop-blur-md border border-[#1E3B28] hover:border-[#B8FF01]/50 rounded-lg p-4 text-left transition-all cursor-pointer group self-start lg:self-end"
          >
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="inline-flex items-center gap-1.5 text-slate-300 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                {isFr ? 'EN DIRECT' : 'LIVE'}
              </span>
              <span className="text-[#B8FF01] font-semibold">
                {activeMatch.minute}&apos;
              </span>
            </div>

            <div className="flex items-center justify-between text-white mb-3.5">
              <span className="text-xs font-semibold tracking-wider text-slate-200">
                {activeMatch.homeShort}
              </span>
              <span className="font-wide font-extrabold text-lg tracking-wider text-white">
                {activeMatch.homeScore} — {activeMatch.awayScore}
              </span>
              <span className="text-xs font-semibold tracking-wider text-slate-200">
                MCI
              </span>
            </div>

            <div className="w-full h-1 bg-[#162B1E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B8FF01] transition-all duration-500"
                style={{ width: `${activeMatch.winProbability.home}%` }}
              />
            </div>
          </button>
        </div>
      </section>

      {/* =====================================================================
          2. LIVE FEED — LATEST MATCH HIGHLIGHTS
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr ? 'FLUX EN DIRECT' : 'LIVE FEED'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr ? 'Derniers temps forts' : 'Latest match highlights'}
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                {isFr
                  ? 'Extraits vidéo de football et actions clés analysées par l’IA—accessibles immédiatement même sans compte.'
                  : 'Real football clips & AI-tagged match moments—embedded for fans exploring Scorecer without an account.'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('match-center')}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B8FF01] hover:underline cursor-pointer self-start sm:self-end"
            >
              <span>
                {isFr ? 'Ouvrir les matchs en direct' : 'Open full Match Center'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Interactive Football Video Player */}
            <div className="lg:col-span-7 rounded-xl overflow-hidden bg-[#08140C] border border-[#162B1E] flex flex-col justify-between">
              <div className="relative aspect-video bg-black overflow-hidden group">
                <video
                  ref={videoRef}
                  key={selectedHighlight.videoUrl}
                  src={selectedHighlight.videoUrl}
                  poster={selectedHighlight.poster}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
                />
                <img
                  src={selectedHighlight.poster}
                  alt={selectedHighlight.title[lang]}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-35 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/60 pointer-events-none" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#050D08]/85 backdrop-blur-md border border-[#1F3B2A] text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                    <span className="text-white font-semibold">
                      {selectedHighlight.scoreline}
                    </span>
                    <span className="text-[#B8FF01]">{selectedHighlight.minute}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="p-2 rounded-md bg-[#050D08]/80 hover:bg-[#0B1A11] text-slate-200 border border-[#1F3B2A] cursor-pointer"
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
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#B8FF01]">
                        {selectedHighlight.matchTag[lang]}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                        {selectedHighlight.title[lang]}
                      </h3>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#050D08]/80 border border-[#1F3B2A] text-slate-300">
                      {selectedHighlight.duration}
                    </span>
                  </div>

                  <div className="bg-[#050D08]/90 backdrop-blur-md border border-[#1F3B2A] rounded-lg p-2.5">
                    <div className="flex items-center justify-between gap-1.5 mb-2">
                      {selectedHighlight.beats.map((beat, idx) => {
                        const isBeatActive = idx === activeBeatIdx;
                        return (
                          <button
                            key={beat.time}
                            onClick={() => setActiveBeatIdx(idx)}
                            className={`flex-1 py-1 px-2 rounded text-[11px] font-mono transition-all cursor-pointer text-left ${
                              isBeatActive
                                ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                                : 'bg-[#0B1A11] text-slate-300 hover:text-white'
                            }`}
                          >
                            {beat.label[lang]} · {beat.time}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-300">
                      <span className="text-[#B8FF01] font-mono mr-1.5">
                        {isFr ? 'Séq. IA :' : 'AI Beat:'}
                      </span>
                      {currentBeat.description[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Visual Highlight Selector Cards (Hover or Click to Play) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              {FEATURED_HIGHLIGHTS.map((item) => {
                const isSelected = item.id === selectedHighlight.id;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => {
                      if (selectedHighlight.id !== item.id) {
                        setSelectedHighlight(item);
                        setActiveBeatIdx(2);
                        setIsVideoPlaying(true);
                      }
                    }}
                    onClick={() => {
                      setSelectedHighlight(item);
                      setActiveBeatIdx(2);
                      setIsVideoPlaying(true);
                    }}
                    className={`group flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1A11] border-[#B8FF01]/70 shadow-md'
                        : 'bg-[#08140C] border-[#162B1E] hover:border-[#B8FF01]/50'
                    }`}
                  >
                    <HoverPlayVideo
                      posterUrl={item.poster}
                      videoUrl={item.videoUrl}
                      alt={item.title[lang]}
                      duration={item.duration}
                      showHoverHint={false}
                      className="w-32 sm:w-36 aspect-video rounded-lg shrink-0"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-[#B8FF01] font-semibold">
                          {item.minute}
                        </span>
                        <span className="text-slate-400 truncate">
                          {item.scoreline}
                        </span>
                      </div>
                      <h4 className="font-display font-semibold text-sm text-white line-clamp-2 group-hover:text-[#B8FF01] transition-colors">
                        {item.title[lang]}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {item.subtitle[lang]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SIX PILLARS — AI-NATIVE INFRASTRUCTURE (WITH HOVER-PLAY VISUALS)
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? 'SIX PILIERS' : 'SIX PILLARS'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white tracking-tight leading-[1.15]">
              {isFr
                ? 'Une infrastructure IA native pour tout le match.'
                : 'AI-native infrastructure for the whole match.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed pt-1">
              {isFr
                ? 'Survolez chaque carte pour prévisualiser l’expérience vidéo en direct — un seul système nerveux pour tout le match.'
                : 'Hover over any card to preview live match action — explanations, highlights, social prompts, and partner activations in one nervous system.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SIX_PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                onClick={() => {
                  setActiveTab(pillar.targetTab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group text-left rounded-xl bg-[#08140C] border border-[#162B1E] hover:border-[#B8FF01]/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <HoverPlayVideo
                    posterUrl={pillar.posterUrl}
                    videoUrl={pillar.videoUrl}
                    alt={pillar.title}
                    badgeLabel={pillar.badgeLabel}
                    duration="LIVE DEMO"
                    className="h-44 w-full border-b border-[#162B1E]"
                  />

                  <div className="p-6 space-y-2.5">
                    <span className="font-mono text-xs font-semibold text-[#B8FF01]">
                      {pillar.num}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-[#B8FF01] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 group-hover:text-[#B8FF01]">
                    <span>{isFr ? 'Explorer la fonctionnalité' : 'Explore feature'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. 01 · AI MATCH ASSISTANT — "Ask the pitch anything."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '01 · ASSISTANT DE MATCH IA' : '01 · AI MATCH ASSISTANT'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Demandez tout au terrain.'
                : 'Ask the pitch anything.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Un assistant conversationnel ancré dans le flux en direct — bascules de dynamique, accélérations xG et l’extrait vidéo qui le prouve. Natif à chaque match.'
                : 'A conversational Match Assistant grounded in the live feed — momentum shifts, xG jumps, and the clip that proves it. Not a chatbot bolted on; native to every match.'}
            </p>

            <div className="space-y-3 pt-2">
              {(isFr
                ? [
                    'Pourquoi le demi-espace s’est-il ouvert après l’égalisation ?',
                    'Extraits vidéo intégrés directement dans la réponse',
                    'Rumeurs mercato regroupées par l’IA — zéro spam',
                  ]
                : [
                    'Why did the half-space open after the equalizer?',
                    'Clip cards queued from the same answer',
                    'Transfer rumors grouped by AI — not feed spam',
                  ]
              ).map((promptText) => (
                <button
                  key={promptText}
                  onClick={() => handleInlineAsk(promptText)}
                  className="w-full text-left flex items-center gap-3.5 py-1 text-sm text-slate-200 hover:text-[#B8FF01] transition-colors cursor-pointer group"
                >
                  <span className="w-[3px] h-5 bg-[#B8FF01] rounded-full shrink-0 group-hover:scale-y-125 transition-transform" />
                  <span>{promptText}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <HoverPlayVideo
              posterUrl="/images/wet-turf.jpg"
              videoUrl="https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4"
              alt="Floodlit wet stadium turf along touchline"
              badgeLabel={
                isFr
                  ? 'FLUX EN DIRECT · RÉPONSES VÉRIFIÉES'
                  : 'LIVE FEED · GROUNDED ANSWERS'
              }
              duration="0:28"
              className="h-60 sm:h-72 rounded-lg border border-[#162B1E]"
            />

            <div className="rounded-lg bg-[#08140C] border border-[#162B1E] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#162B1E] pb-3.5">
                <div>
                  <h3 className="font-display font-semibold text-sm text-white">
                    {isFr ? 'Assistant Match' : 'Match Assistant'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isFr ? 'Connecté au match en direct' : 'Grounded in the live feed'}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#B8FF01]">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                  {isFr ? 'EN DIRECT' : 'LIVE'}
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {localMessages.map((msg, idx) =>
                  msg.role === 'user' ? (
                    <div key={idx} className="flex justify-end">
                      <div className="px-4 py-2.5 rounded-md bg-[#12261A] border border-[#1F3B2A] text-xs sm:text-sm text-slate-100 max-w-md">
                        {msg[lang]}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex justify-start">
                      <div className="p-4 rounded-md bg-[#0B1B11] border border-[#193122] max-w-lg space-y-1.5">
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#B8FF01]">
                          SCORECER AI
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {msg[lang]}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInlineAsk();
                }}
                className="flex items-center gap-2 pt-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    isFr
                      ? 'Posez une question sur le match, les xG ou un joueur...'
                      : 'Ask about momentum, xG, or a player...'
                  }
                  className="flex-1 bg-[#050D08] border border-[#1A3324] focus:border-[#B8FF01] rounded-md px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-colors cursor-pointer"
                >
                  {isFr ? 'Envoyer' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. 02 · AUTOMATED HIGHLIGHTS — "Stories cut for the phone in your hand."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '02 · TEMPS FORTS AUTOMATISÉS' : '02 · AUTOMATED HIGHLIGHTS'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Des Stories taillées pour votre téléphone.'
                : 'Stories cut for the phone in your hand.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed max-w-xl">
              {isFr
                ? 'Les Stories verticales s’assemblent automatiquement depuis le direct — construction, centre en retrait, finition, célébration. Naviguez sur la timeline : l’IA a déjà marqué les temps forts.'
                : 'Vertical highlight Stories auto-assemble from the live feed — build-up, cutback, finish, celebration. Scrub the timeline; the AI already marked the beats.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {FEATURED_HIGHLIGHTS[0].beats.map((b, i) => (
                <button
                  key={b.time}
                  onClick={() => setStoryBeatIndex(i)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    storyBeatIndex === i
                      ? 'bg-[#0F2417] border-[#B8FF01] text-white'
                      : 'bg-[#08140C] border-[#162B1E] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-[11px] text-[#B8FF01]">
                    0{i + 1} · {b.time}
                  </div>
                  <div className="font-display font-semibold text-sm mt-0.5">
                    {b.label[lang]}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 bg-[#08140C] border border-[#162B1E] rounded-lg p-4">
              <span className="text-[#B8FF01] font-mono uppercase mr-2">
                {isFr ? `Temps ${storyBeatIndex + 1} :` : `Beat ${storyBeatIndex + 1}:`}
              </span>
              {FEATURED_HIGHLIGHTS[0].beats[storyBeatIndex].description[lang]}
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <HoverPlayVideo
              posterUrl="/images/highlight-goal.jpg"
              videoUrl="https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-stadium-43479-large.mp4"
              alt="Vertical 9:16 mobile goal story"
              showHoverHint={false}
              className="w-64 aspect-[9/16] rounded-2xl border-2 border-[#1F3B2A] shadow-2xl"
              overlayChildren={
                <>
                  <div className="absolute top-3 left-3 right-3 space-y-2 z-10 pointer-events-none">
                    <div className="grid grid-cols-4 gap-1">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`h-1 rounded-full ${
                            idx <= storyBeatIndex ? 'bg-[#B8FF01]' : 'bg-white/25'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-white font-semibold">ARS 2 — 1 RMA</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#B8FF01] text-[#050D08] font-bold">
                        9:16 STORY
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 space-y-1.5 z-10 pointer-events-none">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01]">
                      {FEATURED_HIGHLIGHTS[0].beats[storyBeatIndex].label[lang]} ·{' '}
                      {FEATURED_HIGHLIGHTS[0].beats[storyBeatIndex].time}
                    </span>
                    <h4 className="font-display font-bold text-sm text-white leading-snug">
                      {isFr
                        ? 'Volée de Havertz (67’) sur un service de Saka'
                        : "Havertz 67' volley finish from Saka cutback"}
                    </h4>
                  </div>
                </>
              }
            />

            <HoverPlayVideo
              posterUrl="/images/highlight-save.jpg"
              videoUrl="https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-saving-a-goal-in-a-soccer-match-43484-large.mp4"
              alt="Vertical 9:16 goalkeeper save story"
              showHoverHint={false}
              className="hidden sm:block w-56 aspect-[9/16] rounded-2xl border border-[#162B1E] opacity-90 hover:opacity-100 transition-opacity"
              overlayChildren={
                <>
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-200 z-10 pointer-events-none">
                    <span>74&apos; STOPPER CAM</span>
                    <span className="text-[#B8FF01]">108 dB</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                    <h4 className="font-display font-bold text-xs text-white">
                      {isFr
                        ? 'Parade décisive en lucarne pour préserver le score'
                        : 'Full-stretch top corner save preserves the lead'}
                    </h4>
                  </div>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. 03 · COMMENTARY PERSONAS — "Same match. Different voice."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 rounded-lg bg-[#08140C] border border-[#162B1E] overflow-hidden">
            <div className="grid grid-cols-3 border-b border-[#162B1E] text-xs font-mono uppercase tracking-wider">
              {(
                [
                  { id: 'tactical', label: isFr ? 'TACTIQUE' : 'TACTICAL' },
                  { id: 'passionate', label: isFr ? 'PASSIONNÉ' : 'PASSIONATE' },
                  { id: 'neutral', label: isFr ? 'NEUTRE' : 'NEUTRAL' },
                ] as const
              ).map((tab) => {
                const isActive = activePersonaTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePersonaTab(tab.id)}
                    className={`py-4 text-center transition-colors cursor-pointer relative ${
                      isActive
                        ? 'text-[#B8FF01] font-semibold bg-[#0B1A11]/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8FF01]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {isFr
                    ? 'COMMENTAIRE EN DIRECT · ARSENAL VS MAN CITY'
                    : 'LIVE COMMENTARY · ARSENAL VS MAN CITY'}
                </span>
                <button
                  onClick={handleSpeakPersona}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    isSpeakingDemo
                      ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                      : 'bg-[#112418] text-[#B8FF01] border border-[#22432E] hover:bg-[#162F20]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>
                    {isSpeakingDemo
                      ? isFr
                        ? 'Arrêter'
                        : 'Stop voice'
                      : isFr
                      ? 'Écouter la voix'
                      : 'Hear voice'}
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                {selectedHighlight.commentary[activePersonaTab][lang].map(
                  (line, idx) => {
                    const minutePart = line.slice(0, 3);
                    const textPart = line.slice(3).trim();
                    return (
                      <div key={idx} className="flex items-start gap-3.5">
                        <span className="font-mono text-xs font-semibold text-[#B8FF01] pt-0.5 shrink-0">
                          {minutePart}
                        </span>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {textPart}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '03 · PERSONAS DE COMMENTAIRE' : '03 · COMMENTARY PERSONAS'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-tight">
              {isFr ? 'Même match. Autre voix.' : 'Same match. Different voice.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed max-w-xl">
              {isFr
                ? 'Basculez entre Analyste Tactique, Supporter Passionné ou Commentateur Neutre — un commentaire audio qui suit le rythme du match. Testez la démo ici ou ouvrez le Studio IA.'
                : 'Toggle Tactical Analyst, Passionate Fan, or Neutral — emotion-aware commentary that rides the clock. Try the demo; full live TTS ships in 6 languages inside the AI Studio.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab('ai-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#B8FF01] hover:underline cursor-pointer"
              >
                <span>
                  {isFr
                    ? 'Ouvrir le Studio Audio Multilingue'
                    : 'Open Multi-Lingual Audio Studio'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. 04 · SQUADS — "Banter that travels with the match."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              04 · SQUADS
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'La chambre qui suit le match.'
                : 'Banter that travels with the match.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Des Squads privés avec chat en temps réel et widgets live — partagez une courbe xG ou la note d’un joueur directement dans la discussion, pas un lien mort. Groupes d’amis, salons publics et pronostics FanScore à chaque arrêt de jeu.'
                : 'Persistent Squads with realtime chat and live widgets — drop an xG chart or player rating into the thread, not a dead link. Private groups, public megathreads, FanScore micro-predictions mid-stoppage.'}
            </p>

            <div className="space-y-3 pt-2">
              {(isFr
                ? [
                    'L’ambiance soirée match sans quitter Scorecer',
                    'Des widgets qui se mettent à jour à chaque minute',
                    'Pronostics FanScore verrouillés avant le coup de sifflet',
                  ]
                : [
                    'Watch-together energy without leaving Scorecer',
                    'Widgets that update as the clock ticks',
                    'FanScore predictions locked before the whistle',
                  ]
              ).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3.5 text-sm text-slate-200"
                >
                  <span className="w-[3px] h-5 bg-[#B8FF01] rounded-full shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab('social-squads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{isFr ? 'Rejoindre un Squad' : 'Join Squad Watch Party'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('o2o-local');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-slate-200 border border-[#1F3B2A] text-sm transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#B8FF01]" />
                <span>
                  {isFr ? 'Trouver un pub partenaire' : 'Find Local Pub Watch Parties'}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <HoverPlayVideo
              posterUrl="/images/squads-pub.jpg"
              videoUrl="https://assets.mixkit.co/videos/preview/mixkit-friends-watching-a-football-match-in-a-bar-42619-large.mp4"
              alt="Football friends watching live match in a sports pub"
              badgeLabel={isFr ? 'SOIRÉE PUB EN DIRECT' : 'LIVE PUB WATCH PARTY'}
              className="rounded-xl border border-[#162B1E] bg-[#08140C] h-[380px] sm:h-[440px]"
              overlayChildren={
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-[#07120B]/90 backdrop-blur-md border border-[#1F3B2A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF01]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>
                        {isFr
                          ? 'SQUAD ANALYSTES N5 · 11 EN LIGNE'
                          : 'N5 TACTICAL ANALYSTS SQUAD · 11 ONLINE'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200">
                      {isFr
                        ? '« La note de Saka vient de passer à 9.1 après ce centre en retrait — je parie Oui sur le prochain coup franc cadré ! »'
                        : '“Saka’s rating just jumped to 9.1 after that cutback — locking Yes on the next free-kick prediction!”'}
                    </p>
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded bg-[#B8FF01]/15 text-[#B8FF01] border border-[#B8FF01]/30 shrink-0 self-start sm:self-center">
                    +75 FanScore
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. 05 · ANALYTICS DEPTH — "Home stays clean. Discover holds the noise."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <HoverPlayVideo
              posterUrl="/images/tactical-pitch.jpg"
              videoUrl="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-lit-soccer-stadium-at-night-41566-large.mp4"
              alt="Glowing tactical football pitch constellation and pass network"
              badgeLabel={isFr ? 'TÉLÉMÉTRIE OPTIQUE 0.8s' : '0.8s OPTICAL TELEMETRY'}
              className="rounded-xl border border-[#162B1E] bg-[#08140C] h-[360px] sm:h-[420px]"
              overlayChildren={
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 bg-[#050D08]/85 backdrop-blur-md border border-[#1F3B2A] rounded-lg px-4 py-3 z-10">
                  <span className="font-mono text-xs text-slate-300">
                    {isFr
                      ? 'Réseaux de passes · Carte des tirs xG · Probabilité de victoire expliquée'
                      : 'Interactive Pass Networks · Shot xG Maps · Live Win Likelihood'}
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('match-center');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-mono text-xs text-[#B8FF01] hover:underline cursor-pointer"
                  >
                    {isFr ? 'Ouvrir le terrain interactif →' : 'Open Pitch Visualizer →'}
                  </button>
                </div>
              }
            />
          </div>

          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '05 · PROFONDEUR ANALYTIQUE' : '05 · ANALYTICS DEPTH'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'L’accueil reste pur. Découvrir filtre le bruit.'
                : 'Home stays clean. Discover holds the noise.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Courbes xG en direct, notes de joueurs évolutives et probabilité de victoire expliquée simplement. Un accueil épuré les jours de match ; l’onglet Découvrir quand vous voulez explorer.'
                : 'Live xG timelines, fluctuating player ratings, and a win-probability bar that explains itself. Utility Home for match day; Discover when you want to wander.'}
            </p>

            <div className="space-y-2.5 pt-1 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#B8FF01]" />
                <span>
                  {isFr
                    ? 'Zéro publicité plein écran qui coupe le direct'
                    : 'Zero full-screen pop-up ads interrupting live scores'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#B8FF01]" />
                <span>
                  {isFr
                    ? 'Rumeurs mercato regroupées par l’IA en un seul fil vérifié'
                    : 'Transfer rumors deduplicated by AI into clean timelines'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#B8FF01]" />
                <span>
                  {isFr
                    ? '200+ compétitions personnalisées selon vos clubs'
                    : '200+ global leagues personalized to your clubs'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <button
                onClick={() => {
                  setActiveTab('match-center');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer"
              >
                {isFr ? 'Voir les matchs en direct' : 'Explore Match Center'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-white border border-[#1F3B2A] text-sm transition-all cursor-pointer"
              >
                {isFr ? 'Explorer Découvrir' : 'View Discover Feed'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8B. MODULE A: UPGRADED 2026 COMPETITOR BENCHMARK LAB (Step 2)
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-16 lg:py-24 px-6 bg-[#06100A]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00F59B]">
                MODULE A · VERIFIED 2026 EMPIRICAL TELEMETRY BENCHMARK LAB
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Sub-Second Dual-Lane Edge vs. Legacy Polling Trackers
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
                Scorecer decouples Lane 1 (&lt;200ms Scout WebSocket Push) from Lane 2 (+2s Async Opta XY Matrix), delivering verified 0.7s goal alerts while eliminating ad-clutter and social toxicity.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('match-center')}
              className="px-4 py-2.5 rounded-xl bg-[#00F59B]/15 hover:bg-[#00F59B]/25 text-[#00F59B] border border-[#00F59B]/40 text-xs font-mono font-bold cursor-pointer self-start md:self-end"
            >
              Inspect Dual-Lane Multiplexer in Match Center →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Proportional Scale Bar Chart (0.7s to 1.2s) */}
            <div className="lg:col-span-8 rounded-2xl bg-[#0B1710] border border-[#1A3324] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/10">
                <span>PROPORTIONAL SUB-SECOND LATENCY SCALE (0.0s — 1.5s)</span>
                <span className="text-[#00F59B]">Tabular-Nums Verified</span>
              </div>

              <div className="space-y-3.5">
                {COMPETITOR_BENCHMARKS_2026.map((row) => {
                  const widthPct = Math.min(100, Math.round((row.latencySeconds / 1.4) * 100));
                  return (
                    <div key={row.platform} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-display font-bold ${
                              row.highlight ? 'text-[#00F59B]' : 'text-white'
                            }`}
                          >
                            {row.platform}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                            • {row.architecture}
                          </span>
                        </div>
                        <span
                          className={`font-mono font-extrabold tabular-nums ${
                            row.highlight ? 'text-[#00F59B] text-sm' : 'text-slate-300'
                          }`}
                        >
                          {row.latencyLabel}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-black/50 overflow-hidden p-0.5 border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            row.highlight
                              ? 'bg-gradient-to-r from-[#00F59B] to-[#00D4FF]'
                              : 'bg-slate-600/70'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-3 text-[10px] font-mono text-slate-400">
                        <span>Tactical Depth: {row.tacticalDepth}</span>
                        <span>•</span>
                        <span>Social: {row.socialArchitecture}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sleeper 15-Minute Outlier Callout Banner */}
            <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#1A140B] to-[#0B120E] border border-[#FFB800]/40 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] font-mono text-[10px] font-bold uppercase">
                  ⚠️ Non-Proportional Outlier Callout
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  {SLEEPER_OUTLIER_CALLOUT.platform}:{' '}
                  <span className="text-[#FFB800] font-mono tabular-nums">
                    {SLEEPER_OUTLIER_CALLOUT.latencyLabel}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {SLEEPER_OUTLIER_CALLOUT.reason}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400">Chart Scale Protection:</div>
                <div className="text-white">
                  Scorecer: <span className="text-[#00F59B] font-bold">680 ms</span>
                </div>
                <div className="text-white">
                  Sleeper Poll: <span className="text-[#FFB800] font-bold">~900,000 ms (1,323x slower)</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Rendered as an outlier callout badge so 900,000ms does not flatten the 0.7s–1.2s bar chart scale.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. REAL-TIME ESPN API & HISTORICAL MATCH ARCHIVE IMPORTER
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 lg:py-28 px-6 bg-[#050D08]">
        <div className="max-w-7xl mx-auto">
          <RealMatchDataImporter />
        </div>
      </section>

      {/* =====================================================================
          10. APP USAGE TUTORIALS & FOOTBALL GAME VIDEOS SHOWCASE
      ===================================================================== */}
      <VideoTutorialsAndActionSection />

      {/* =====================================================================
          11. LEADERSHIP TEAM (CEO & CTO) + FREQUENTLY ASKED QUESTIONS (FAQ)
      ===================================================================== */}
      <TeamAndFaqSection />

      {/* =====================================================================
          12. FINAL FAN CTA BANNER — PERSONALIZE YOUR PITCH
      ===================================================================== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-br from-[#0B1E12] via-[#08140C] to-[#050D08] border border-[#1F3B2A] p-8 sm:p-14 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF01]/10 border border-[#B8FF01]/30 text-[#B8FF01] font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isFr
                ? '200+ CHAMPIONNATS · PERSONNALISÉ EN 30 SECONDES'
                : '200+ LEAGUES · PERSONALIZED IN 30 SECONDS'}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {isFr
              ? 'Prêt pour le football qui pense avec vous ?'
              : 'Ready for football that thinks with you?'}
          </h2>

          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isFr
              ? 'Choisissez vos clubs favoris, votre voix de commentateur IA et rejoignez votre Squad avant le prochain coup d’envoi.'
              : 'Pick your clubs, choose your AI commentator voice, and join your Squad before the next kickoff.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openAuthModal('signup')}
              className="px-7 py-3.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-[#B8FF01]/15"
            >
              {isFr ? 'Créer un compte gratuit' : 'Create your free account'}
            </button>
            <button
              onClick={() => {
                setActiveTab('match-center');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-lg bg-[#09150E] hover:bg-[#0F2317] text-white border border-[#244430] text-sm font-medium transition-all cursor-pointer"
            >
              {isFr ? 'Voir le match en direct' : 'Jump into live match demo'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
