import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Compass,
  Bot,
  Users,
  Database,
  Maximize2,
  X,
  Film,
  GraduationCap,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { ActiveTab } from '../../types/scorecer';

interface TutorialClip {
  id: string;
  stepNumber: string;
  duration: string;
  badgeEn: string;
  badgeFr: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  videoUrl: string;
  posterUrl: string;
  targetNavTab: ActiveTab;
  ctaLabelEn: string;
  ctaLabelFr: string;
  chapters: {
    timeLabel: string;
    progressPct: number;
    labelEn: string;
    labelFr: string;
    uiMockTitleEn: string;
    uiMockTitleFr: string;
    uiMockDetailEn: string;
    uiMockDetailFr: string;
    uiHighlightPill: string;
  }[];
}

interface FootballGameVideo {
  id: string;
  titleEn: string;
  titleFr: string;
  matchLabel: string;
  competition: string;
  minute: string;
  xgValue: string;
  aiTagEn: string;
  aiTagFr: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  descriptionEn: string;
  descriptionFr: string;
}

const TUTORIAL_CLIPS: TutorialClip[] = [
  {
    id: 'tut-onboarding',
    stepNumber: '01',
    duration: '0:42',
    badgeEn: 'APP WALKTHROUGH · ONBOARDING',
    badgeFr: 'TUTORIEL APP · INSCRIPTION',
    titleEn: '30-Second Club Setup & Encrypted Account Creation',
    titleFr: 'Configuration Club en 30s & Compte Chiffré',
    descEn:
      'See how new fans pick their favorite clubs, set spoiler-shield buffer times, choose their AI commentator persona, and lock in a SHA-256 encrypted profile.',
    descFr:
      'Découvrez comment choisir vos clubs favoris, régler le bouclier anti-spoiler, sélectionner votre commentateur IA et sécuriser votre profil SHA-256.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-the-ball-in-the-stadium-43480-large.mp4',
    posterUrl: '/images/hero-goalnet.jpg',
    targetNavTab: 'vision',
    ctaLabelEn: 'Try Account Setup',
    ctaLabelFr: 'Essayer l’Inscription',
    chapters: [
      {
        timeLabel: '0:00',
        progressPct: 18,
        labelEn: '1. Select Favorite Clubs & Leagues',
        labelFr: '1. Choisir Clubs & Ligues Favoris',
        uiMockTitleEn: 'Personalization Loop: Arsenal, PSG & Champions League',
        uiMockTitleFr: 'Boucle Personnalisée : Arsenal, PSG & Ligue des Champions',
        uiMockDetailEn: 'Home feed immediately filters out noise and prioritizes your squad fixtures.',
        uiMockDetailFr: 'Le flux principal filtre immédiatement le bruit et priorise les matchs de votre équipe.',
        uiHighlightPill: '3 CLUBS SELECTED · +50 XP',
      },
      {
        timeLabel: '0:15',
        progressPct: 54,
        labelEn: '2. Choose AI Commentator Voice & Spoiler Shield',
        labelFr: '2. Voix IA & Bouclier Anti-Spoiler',
        uiMockTitleEn: 'Persona: Tactical Analyst · Stream Buffer: +30s Delay',
        uiMockTitleFr: 'Persona : Analyste Tactique · Tampon Stream : +30s',
        uiMockDetailEn: 'Prevents goal push notifications from spoiling your live broadcast stream.',
        uiMockDetailFr: 'Empêche les notifications de but de gâcher votre diffusion en direct.',
        uiHighlightPill: 'SPOILER SHIELD ARMED',
      },
      {
        timeLabel: '0:31',
        progressPct: 92,
        labelEn: '3. Web Crypto SHA-256 Session Activated',
        labelFr: '3. Session Web Crypto SHA-256 Activée',
        uiMockTitleEn: 'Signed Session Token Issued · Instant Sync Across Tabs',
        uiMockTitleFr: 'Jeton de Session Signé · Synchronisation Instantanée',
        uiMockDetailEn: 'Your FanScore XP, custom Squads, and imported matches persist automatically.',
        uiMockDetailFr: 'Vos XP FanScore, Squads et matchs importés sont sauvegardés automatiquement.',
        uiHighlightPill: 'SHA-256 VERIFIED',
      },
    ],
  },
  {
    id: 'tut-ai-assistant',
    stepNumber: '02',
    duration: '0:55',
    badgeEn: 'APP WALKTHROUGH · SCORECER AI',
    badgeFr: 'TUTORIEL APP · IA SCORECER',
    titleEn: 'Asking the Pitch Anything & Switching Live Audio Personas',
    titleFr: 'Interroger le Terrain & Changer de Voix IA en Direct',
    descEn:
      'Watch how to ask the Match Assistant why momentum flipped, queue the exact 20-second tactical clip, and toggle between Tactical, Passionate Ultras, and Neutral commentary.',
    descFr:
      'Voyez comment demander à l’Assistant pourquoi le momentum a basculé, lancer le clip de 20s correspondant et alterner entre Analyste, Ultra Passionné et Neutre.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4',
    posterUrl: '/images/wet-turf.jpg',
    targetNavTab: 'ai-hub',
    ctaLabelEn: 'Open AI Studio',
    ctaLabelFr: 'Ouvrir Studio IA',
    chapters: [
      {
        timeLabel: '0:00',
        progressPct: 22,
        labelEn: '1. Ask Why Momentum Flipped at 38’',
        labelFr: '1. Demander Pourquoi le Momentum a Basculé (38’)',
        uiMockTitleEn: 'Prompt: "Why did Arsenal overload the right half-space?"',
        uiMockTitleFr: 'Prompt : « Pourquoi Arsenal a-t-il surchargé le demi-espace droit ? »',
        uiMockDetailEn: 'Scorecer AI reads live optical tracking and explains Ødegaard’s rest-defense drop.',
        uiMockDetailFr: 'L’IA Scorecer lit le suivi optique en direct et explique le décrochage d’Ødegaard.',
        uiHighlightPill: 'xG JUMP +0.41 EXPLAINED',
      },
      {
        timeLabel: '0:21',
        progressPct: 60,
        labelEn: '2. Auto-Queue Vertical Highlight Clip',
        labelFr: '2. File d’Attente Automatique du Clip Vertical',
        uiMockTitleEn: 'Clip 37’–39’: Build-up → Cutback → Volley Queued',
        uiMockTitleFr: 'Clip 37’–39’ : Construction → Centre en retrait → Volée',
        uiMockDetailEn: 'Every AI answer links directly to the timestamped video beat—no searching required.',
        uiMockDetailFr: 'Chaque réponse IA renvoie directement à la séquence vidéo horodatée.',
        uiHighlightPill: '9:16 STORY READY',
      },
      {
        timeLabel: '0:40',
        progressPct: 90,
        labelEn: '3. Toggle Live TTS Commentary Persona',
        labelFr: '3. Basculer la Voix TTS du Commentateur',
        uiMockTitleEn: 'Switched from Tactical Analyst → Passionate Fan Voice',
        uiMockTitleFr: 'Passage d’Analyste Tactique → Voix Supporter Passionné',
        uiMockDetailEn: 'Real-time Web Speech synthesis adapts cadence and emotion to the match state.',
        uiMockDetailFr: 'La synthèse vocale adapte sa cadence et son émotion à l’état du match.',
        uiHighlightPill: 'LIVE AUDIO ACTIVE',
      },
    ],
  },
  {
    id: 'tut-real-data',
    stepNumber: '03',
    duration: '0:48',
    badgeEn: 'APP WALKTHROUGH · REAL DATA SYNC',
    badgeFr: 'TUTORIEL APP · DONNÉES RÉELLES',
    titleEn: 'Importing Live ESPN Feeds & Classic Historical Matches',
    titleFr: 'Importer les Flux ESPN en Direct & Matchs Historiques',
    descEn:
      'Learn how to pull live European fixtures by date or league directly from the ESPN Scoreboard API, or load legendary Champions League & El Clásico matches into the engine.',
    descFr:
      'Apprenez à importer les matchs européens par date ou ligue via l’API ESPN, ou à charger des classiques historiques de Ligue des Champions et d’El Clásico.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-illuminated-soccer-stadium-at-night-41585-large.mp4',
    posterUrl: '/images/tactical-pitch.jpg',
    targetNavTab: 'match-center',
    ctaLabelEn: 'Open Live Matches',
    ctaLabelFr: 'Ouvrir Matchs Live',
    chapters: [
      {
        timeLabel: '0:00',
        progressPct: 25,
        labelEn: '1. Select Competition & Match Date',
        labelFr: '1. Choisir Compétition & Date du Match',
        uiMockTitleEn: 'League: UEFA Champions League / Premier League · Date Picker',
        uiMockTitleFr: 'Ligue : UEFA Champions League / Premier League · Sélecteur Date',
        uiMockDetailEn: 'Queries public ESPN Soccer API endpoints for live scores, lineups, and key events.',
        uiMockDetailFr: 'Interroge l’API publique ESPN Soccer pour les scores, compos et événements.',
        uiHighlightPill: 'LIVE API CONNECTED',
      },
      {
        timeLabel: '0:19',
        progressPct: 62,
        labelEn: '2. Load Classic Historical Archive',
        labelFr: '2. Charger l’Archive Historique Classique',
        uiMockTitleEn: 'Imported: PSG 4–2 Man City & Real Madrid 0–4 Barcelona',
        uiMockTitleFr: 'Importé : PSG 4–2 Man City & Real Madrid 0–4 Barcelone',
        uiMockDetailEn: 'Full goal timelines, xG curves, and tactical heatmaps populate inside Match Center.',
        uiMockDetailFr: 'Les chronologies de buts, courbes xG et cartes thermiques s’ouvrent dans le Match Center.',
        uiHighlightPill: 'HISTORICAL ARCHIVE SYNCED',
      },
      {
        timeLabel: '0:36',
        progressPct: 94,
        labelEn: '3. Inspect Sub-Second Telemetry & Lineups',
        labelFr: '3. Inspecter Télémétrie & Compositions',
        uiMockTitleEn: 'Interactive Pitch Map & Win-Probability Wave Updated',
        uiMockTitleFr: 'Carte du Terrain Interactive & Courbe de Probabilité Mises à Jour',
        uiMockDetailEn: 'Click any imported fixture to make it the active match across AI Studio and Squads.',
        uiMockDetailFr: 'Cliquez sur n’importe quel match importé pour l’activer dans le Studio IA et les Squads.',
        uiHighlightPill: '0.8s TELEMETRY FEED',
      },
    ],
  },
  {
    id: 'tut-squads-o2o',
    stepNumber: '04',
    duration: '0:51',
    badgeEn: 'APP WALKTHROUGH · SQUADS & PUBS',
    badgeFr: 'TUTORIEL APP · SQUADS & PUBS',
    titleEn: 'Dropping Live xG Widgets in Squads & Checking Into Pubs',
    titleFr: 'Partager des Widgets xG en Squad & Check-In dans les Pubs',
    descEn:
      'See how friends share live-updating tactical cards inside private Squad rooms, lock VAR micro-predictions for FanScore XP, and RSVP to verified local supporter bars.',
    descFr:
      'Découvrez comment partager des cartes tactiques en direct dans vos Squads, verrouiller vos pronos VAR et réserver dans les bars de supporters partenaires.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-watching-a-football-match-in-a-bar-42619-large.mp4',
    posterUrl: '/images/squads-pub.jpg',
    targetNavTab: 'social-squads',
    ctaLabelEn: 'Explore Squads',
    ctaLabelFr: 'Explorer les Squads',
    chapters: [
      {
        timeLabel: '0:00',
        progressPct: 24,
        labelEn: '1. Drop Live xG Widget into Squad Thread',
        labelFr: '1. Insérer un Widget xG en Direct dans le Chat',
        uiMockTitleEn: 'North London Derby Crew · Live Widget Shared',
        uiMockTitleFr: 'North London Derby Crew · Widget Live Partagé',
        uiMockDetailEn: 'Instead of static screenshots, shared cards keep updating as the match clock ticks.',
        uiMockDetailFr: 'Au lieu de captures figées, les cartes partagées se mettent à jour en temps réel.',
        uiHighlightPill: 'LIVE WIDGET EMBEDDED',
      },
      {
        timeLabel: '0:20',
        progressPct: 58,
        labelEn: '2. Lock Stoppage-Time Micro-Prediction',
        labelFr: '2. Verrouiller un Micro-Pronostic pendant l’Arrêt de Jeu',
        uiMockTitleEn: 'VAR Check Triggered → 45s Prediction Window Opened',
        uiMockTitleFr: 'Vérification VAR → Fenêtre de Pronostic de 45s Ouverte',
        uiMockDetailEn: 'Predict whether the free-kick hits the target to climb the global FanScore leaderboard.',
        uiMockDetailFr: 'Prédisez si le coup franc sera cadré pour grimper au classement FanScore.',
        uiHighlightPill: '+50 FANSCORE XP',
      },
      {
        timeLabel: '0:38',
        progressPct: 91,
        labelEn: '3. RSVP & Unlock Verified Pub Perks',
        labelFr: '3. Réserver & Débloquer les Avantages Pub',
        uiMockTitleEn: 'The Twelve Pins (London) / Café Oz (Paris) · QR Pass Ready',
        uiMockTitleFr: 'The Twelve Pins (Londres) / Café Oz (Paris) · Pass QR Prêt',
        uiMockDetailEn: 'Check in with your Squad to unlock 2-for-1 matchday pints and reserved screen tables.',
        uiMockDetailFr: 'Faites votre check-in en Squad pour débloquer des pintes 2-pour-1 et des tables réservées.',
        uiHighlightPill: 'O2O VENUE VERIFIED',
      },
    ],
  },
];

const FOOTBALL_GAME_VIDEOS: FootballGameVideo[] = [
  {
    id: 'game-vid-1',
    titleEn: ' Saka Half-Space Cutback & First-Time Volley',
    titleFr: 'Centre en Retrait Demi-Espace de Saka & Volée Instantanée',
    matchLabel: 'ARS 2 – 1 MCI',
    competition: 'Premier League · Emirates Stadium',
    minute: "38'",
    xgValue: '0.44 xG',
    aiTagEn: 'AI BEAT: REST-DEFENSE BREAK',
    aiTagFr: 'BEAT IA : RUPTURE DÉFENSIVE',
    duration: '0:24',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-on-the-field-43479-large.mp4',
    posterUrl: '/images/highlight-goal.jpg',
    descriptionEn:
      'Optical tracking captures how Ødegaard pinned City’s pivot before Saka’s cutback created a high-velocity 0.44 xG finish.',
    descriptionFr:
      'Le suivi optique montre comment Ødegaard a fixé le pivot de City avant que le centre en retrait de Saka ne crée une finition à 0.44 xG.',
  },
  {
    id: 'game-vid-2',
    titleEn: 'Fingertip Top-Corner Reflex Save Under Floodlights',
    titleFr: 'Arrêt Réflexe du Bout des Doigts en Lucarne sous les Projecteurs',
    matchLabel: 'RMA 1 – 1 BAY',
    competition: 'UEFA Champions League · Bernabéu',
    minute: "81'",
    xgValue: '0.68 PSxG',
    aiTagEn: 'AI BEAT: +0.62 GOALS PREVENTED',
    aiTagFr: 'BEAT IA : +0.62 BUT ÉVITÉ',
    duration: '0:19',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-catching-the-ball-in-the-goal-43481-large.mp4',
    posterUrl: '/images/highlight-save.jpg',
    descriptionEn:
      'Post-shot xG model rated this curling strike at 0.68—see the frame-by-frame dive trajectory and reaction latency.',
    descriptionFr:
      'Le modèle PSxG a évalué cette frappe enroulée à 0.68 — voyez la trajectoire du plongeon image par image.',
  },
  {
    id: 'game-vid-3',
    titleEn: 'Parc des Princes Rain-Soaked Counter-Press Remontada',
    titleFr: 'Contre-Pressing sous la Pluie & Remontada au Parc des Princes',
    matchLabel: 'PSG 4 – 2 MCI',
    competition: 'UEFA Champions League · Paris',
    minute: "78'",
    xgValue: '0.51 xG',
    aiTagEn: 'AI BEAT: 4-SECOND TRANSITION',
    aiTagFr: 'BEAT IA : TRANSITION EN 4 SECONDES',
    duration: '0:28',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4',
    posterUrl: '/images/wet-turf.jpg',
    descriptionEn:
      'Barcola and João Neves trigger a 4-pass vertical counter-attack from edge of box to back of the net in 6.2 seconds.',
    descriptionFr:
      'Barcola et João Neves déclenchent une contre-attaque verticale en 4 passes d’une surface à l’autre en 6,2 secondes.',
  },
  {
    id: 'game-vid-4',
    titleEn: 'High-Line Offside Trap & 40-Meter Diagonal Through-Ball',
    titleFr: 'Piège du Hors-Jeu Ligne Haute & Passe Diagonale de 40 Mètres',
    matchLabel: 'RMA 0 – 4 BAR',
    competition: 'LaLiga El Clásico · Madrid',
    minute: "56'",
    xgValue: '0.59 xG',
    aiTagEn: 'AI BEAT: LINE-BREAKING PASS',
    aiTagFr: 'BEAT IA : PASSE CASSANT LES LIGNES',
    duration: '0:22',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-illuminated-soccer-stadium-at-night-41585-large.mp4',
    posterUrl: '/images/tactical-pitch.jpg',
    descriptionEn:
      'Hansi Flick’s synchronized defensive line steps up at 55:42 before Pedri threads a diagonal pass bypassing 5 defenders.',
    descriptionFr:
      'La ligne défensive synchronisée de Hansi Flick remonte à 55:42 avant que Pedri ne glisse une diagonale éliminant 5 défenseurs.',
  },
  {
    id: 'game-vid-5',
    titleEn: '89th-Minute Penalty Box Scramble & Curled Far-Post Winner',
    titleFr: 'Cafouillage dans la Surface à la 89e & But Vainqueur Enroulé',
    matchLabel: 'INT 4 – 4 JUV',
    competition: 'Serie A Derby d’Italia · San Siro',
    minute: "89'",
    xgValue: '0.39 xG',
    aiTagEn: 'AI BEAT: 114 dB CROWD ROAR',
    aiTagFr: 'BEAT IA : CLAMEUR STADE 114 dB',
    duration: '0:26',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-the-ball-in-the-stadium-43480-large.mp4',
    posterUrl: '/images/hero-goalnet.jpg',
    descriptionEn:
      'Acoustic stadium sensors peaked at 114 dB, automatically triggering Scorecer’s vertical Story cutter within 1.8 seconds.',
    descriptionFr:
      'Les capteurs acoustiques du stade ont culminé à 114 dB, déclenchant automatiquement le montage Story vertical en 1,8s.',
  },
  {
    id: 'game-vid-6',
    titleEn: 'Supporter Pub Goal Eruption & Synchronized Squad Reaction',
    titleFr: 'Explosion de Joie au Pub & Réaction Squad Synchronisée',
    matchLabel: 'LIV 2 – 0 RMA',
    competition: 'Champions League Night · Anfield & Partner Pubs',
    minute: "52'",
    xgValue: 'LIVE O2O SYNC',
    aiTagEn: 'AI BEAT: 420 SQUADS ACTIVE',
    aiTagFr: 'BEAT IA : 420 SQUADS ACTIFS',
    duration: '0:21',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-watching-a-football-match-in-a-bar-42619-large.mp4',
    posterUrl: '/images/squads-pub.jpg',
    descriptionEn:
      'See how goal notifications sync simultaneously across home second-screens and verified Scorecer partner pubs.',
    descriptionFr:
      'Voyez comment les alertes de but se synchronisent simultanément sur le second écran à domicile et dans les pubs partenaires.',
  },
];

export const VideoTutorialsAndActionSection: React.FC = () => {
  const { uiLanguage, setActiveTab, openAuthModal } = useScorecer();
  const isFr = uiLanguage === 'fr';

  // Active sub-tab: 'tutorials' | 'match-videos'
  const [activeMediaTab, setActiveMediaTab] = useState<'tutorials' | 'match-videos'>('tutorials');

  // Tutorial state
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>(TUTORIAL_CLIPS[0].id);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isTutorialPlaying, setIsTutorialPlaying] = useState<boolean>(true);
  const [isTutorialMuted, setIsTutorialMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState<boolean>(false);
  const tutorialVideoRef = useRef<HTMLVideoElement | null>(null);

  // Match video modal state
  const [activeMatchVideo, setActiveMatchVideo] = useState<FootballGameVideo | null>(null);
  const [playingGridVideoId, setPlayingGridVideoId] = useState<string | null>('game-vid-1');

  const activeTutorial =
    TUTORIAL_CLIPS.find((t) => t.id === selectedTutorialId) || TUTORIAL_CLIPS[0];
  const currentChapter =
    activeTutorial.chapters[activeChapterIdx] || activeTutorial.chapters[0];

  // Auto-advance tutorial chapter every 5 seconds while playing so the interactive walkthrough feels alive
  useEffect(() => {
    if (!isTutorialPlaying || activeMediaTab !== 'tutorials') return;
    const timer = window.setInterval(() => {
      setActiveChapterIdx((prev) => (prev + 1) % activeTutorial.chapters.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isTutorialPlaying, activeMediaTab, activeTutorial.chapters.length]);

  const handleSelectTutorial = (clip: TutorialClip) => {
    setSelectedTutorialId(clip.id);
    setActiveChapterIdx(0);
    setIsTutorialPlaying(true);
    if (tutorialVideoRef.current) {
      tutorialVideoRef.current.currentTime = 0;
      tutorialVideoRef.current.play().catch(() => {});
    }
  };

  const toggleTutorialPlay = () => {
    const vid = tutorialVideoRef.current;
    if (!vid) {
      setIsTutorialPlaying((prev) => !prev);
      return;
    }
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsTutorialPlaying(true);
    } else {
      vid.pause();
      setIsTutorialPlaying(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (tutorialVideoRef.current) {
      tutorialVideoRef.current.playbackRate = speed;
    }
  };

  const handleVoiceoverGuide = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeakingGuide) {
      setIsSpeakingGuide(false);
      return;
    }
    const textToSpeak = isFr
      ? `${activeTutorial.titleFr}. ${currentChapter.uiMockTitleFr}. ${currentChapter.uiMockDetailFr}`
      : `${activeTutorial.titleEn}. ${currentChapter.uiMockTitleEn}. ${currentChapter.uiMockDetailEn}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isFr ? 'fr-FR' : 'en-GB';
    utterance.rate = 1.02;
    utterance.onend = () => setIsSpeakingGuide(false);
    utterance.onerror = () => setIsSpeakingGuide(false);
    setIsSpeakingGuide(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleTutorialActionClick = (clip: TutorialClip) => {
    if (clip.id === 'tut-onboarding') {
      openAuthModal('signup');
    } else {
      setActiveTab(clip.targetNavTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="tutorials-and-videos"
      className="border-b border-[#162B1E] bg-[#050D08] py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header & Switcher */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8FF01] mb-3 flex items-center gap-2">
              <Film className="w-3.5 h-3.5" />
              {isFr
                ? 'VIDÉOS & TUTORIELS INTERACTIFS'
                : 'APP TUTORIALS & MATCH ACTION VIDEOS'}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl max-w-3xl leading-[1.1]">
              {isFr
                ? 'Voyez Scorecer en action — sur le terrain et dans votre main.'
                : 'See Scorecer in motion — on the pitch and in your hand.'}
            </h2>
            <p className="mt-4 max-w-2xl text-base text-[#9EB5A5] leading-relaxed">
              {isFr
                ? 'Explorez nos guides vidéo étape par étape pour maîtriser l’application en moins d’une minute, ou visionnez des séquences de matchs réels enrichies par la télémétrie IA Scorecer.'
                : 'Watch step-by-step interactive app walkthroughs to master Scorecer in under a minute, or stream real football match clips overlaid with live AI telemetry.'}
            </p>
          </div>

          {/* Media Mode Switcher */}
          <div className="inline-flex rounded-xl border border-[#1E3B29] bg-[#08140C] p-1.5 self-start md:self-auto">
            <button
              onClick={() => setActiveMediaTab('tutorials')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                activeMediaTab === 'tutorials'
                  ? 'bg-[#B8FF01] text-[#050D08] shadow-sm'
                  : 'text-[#9EB5A5] hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              {isFr ? 'Tutoriels & Usage App (4)' : 'App Tutorials & Walkthroughs (4)'}
            </button>
            <button
              onClick={() => setActiveMediaTab('match-videos')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                activeMediaTab === 'match-videos'
                  ? 'bg-[#B8FF01] text-[#050D08] shadow-sm'
                  : 'text-[#9EB5A5] hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isFr ? 'Vidéos de Matchs (6)' : 'Football Game Videos (6)'}
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: APP USAGE CLIPS & INTERACTIVE USER TUTORIALS
           ========================================================= */}
        {activeMediaTab === 'tutorials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Tutorial Selector List (4 Steps — Hover or Click to Play) */}
            <div className="lg:col-span-5 space-y-3.5">
              {TUTORIAL_CLIPS.map((clip) => {
                const isSelected = clip.id === activeTutorial.id;
                return (
                  <div
                    key={clip.id}
                    onMouseEnter={() => {
                      if (selectedTutorialId !== clip.id) {
                        handleSelectTutorial(clip);
                      }
                    }}
                    onClick={() => handleSelectTutorial(clip)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-[#B8FF01] bg-[#0B1C11] shadow-[0_0_30px_rgba(184,255,1,0.08)]'
                        : 'border-[#162B1E] bg-[#08140C]/80 hover:border-[#B8FF01]/50 hover:bg-[#0B1910]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-[#1E3B29] bg-black">
                        <img
                          src={clip.posterUrl}
                          alt={clip.titleEn}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              isSelected
                                ? 'bg-[#B8FF01] text-[#050D08]'
                                : 'bg-[#050D08]/80 text-white'
                            }`}
                          >
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B8FF01]">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B8FF01]/15 text-[#B8FF01] font-mono text-[9px]">
                              {clip.stepNumber}
                            </span>
                            {isFr ? clip.badgeFr : clip.badgeEn}
                          </span>
                          <span className="rounded-md bg-[#050D08] border border-[#1E3B29] px-1.5 py-0.5 font-mono text-[10px] text-[#9EB5A5]">
                            {clip.duration}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                          {isFr ? clip.titleFr : clip.titleEn}
                        </h3>
                        <p className="text-xs text-[#9EB5A5] leading-relaxed line-clamp-2">
                          {isFr ? clip.descFr : clip.descEn}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-[#162B1E] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#B8FF01] flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#B8FF01] animate-ping" />
                          {isFr ? 'En lecture (survolez un autre pour changer)' : 'Playing now (hover any card to switch)'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTutorialActionClick(clip);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-[#B8FF01] transition-colors"
                        >
                          {isFr ? clip.ctaLabelFr : clip.ctaLabelEn}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Interactive Video + Simulated App HUD Player */}
            <div className="lg:col-span-7 rounded-2xl border border-[#1E3B29] bg-[#08140C] overflow-hidden shadow-2xl">
              {/* Top Player Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#162B1E] bg-[#050D08] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#B8FF01]" />
                  <span className="text-xs font-bold text-white">
                    {isFr ? activeTutorial.titleFr : activeTutorial.titleEn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Voiceover Guide Button */}
                  <button
                    onClick={handleVoiceoverGuide}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      isSpeakingGuide
                        ? 'border-[#B8FF01] bg-[#B8FF01] text-[#050D08]'
                        : 'border-[#1E3B29] bg-[#0B1910] text-[#9EB5A5] hover:text-white'
                    }`}
                    title={isFr ? 'Écouter le guide vocal' : 'Listen to voiceover guide'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {isSpeakingGuide
                      ? isFr
                        ? 'Guide Audio Actif...'
                        : 'Voice Guide On...'
                      : isFr
                      ? 'Guide Vocal IA'
                      : 'AI Voice Guide'}
                  </button>

                  {/* Speed selector */}
                  <div className="flex items-center rounded-lg border border-[#162B1E] bg-[#0B1910] p-0.5 text-[10px] font-mono">
                    {[0.5, 1, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          playbackSpeed === spd
                            ? 'bg-[#B8FF01] text-[#050D08] font-bold'
                            : 'text-[#8FA696] hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Canvas + App Walkthrough HUD Overlay */}
              <div className="relative aspect-[16/10] w-full bg-[#040A06] overflow-hidden">
                <video
                  ref={tutorialVideoRef}
                  key={activeTutorial.videoUrl}
                  className="h-full w-full object-cover opacity-65"
                  poster={activeTutorial.posterUrl}
                  autoPlay
                  loop
                  muted={isTutorialMuted}
                  playsInline
                >
                  <source src={activeTutorial.videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/45 to-transparent" />

                {/* Top-Left Step Pill */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#B8FF01]/40 bg-[#050D08]/90 px-3.5 py-1.5 text-[11px] font-bold text-[#B8FF01] backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isFr ? currentChapter.labelFr : currentChapter.labelEn}
                  </span>
                  <span className="rounded-full border border-[#1E3B29] bg-[#050D08]/90 px-3 py-1 font-mono text-[11px] font-bold text-white backdrop-blur-md">
                    {currentChapter.uiHighlightPill}
                  </span>
                </div>

                {/* Simulated Interactive App Card Floating Over Video */}
                <div className="absolute bottom-16 left-5 right-5 rounded-xl border border-[#234730] bg-[#08140C]/95 p-4 backdrop-blur-md shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#B8FF01]/15 border border-[#B8FF01]/40 text-[#B8FF01]">
                        {activeTutorial.id === 'tut-onboarding' && <Compass className="w-4 h-4" />}
                        {activeTutorial.id === 'tut-ai-assistant' && <Bot className="w-4 h-4" />}
                        {activeTutorial.id === 'tut-real-data' && <Database className="w-4 h-4" />}
                        {activeTutorial.id === 'tut-squads-o2o' && <Users className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8FF01]">
                            {isFr ? 'APERÇU ÉCRAN SCORECER' : 'SCORECER LIVE UI OVERLAY'} ·{' '}
                            {currentChapter.timeLabel}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {isFr ? currentChapter.uiMockTitleFr : currentChapter.uiMockTitleEn}
                        </h4>
                        <p className="text-xs text-[#9EB5A5] mt-1 leading-relaxed">
                          {isFr ? currentChapter.uiMockDetailFr : currentChapter.uiMockDetailEn}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTutorialActionClick(activeTutorial)}
                      className="shrink-0 rounded-lg bg-[#B8FF01] px-3.5 py-2 text-xs font-bold text-[#050D08] hover:bg-[#c9ff33] transition-colors"
                    >
                      {isFr ? activeTutorial.ctaLabelFr : activeTutorial.ctaLabelEn}
                    </button>
                  </div>

                  {/* Animated Chapter Progress Bar */}
                  <div className="mt-3.5 h-1.5 w-full rounded-full bg-[#12261A] overflow-hidden">
                    <div
                      className="h-full bg-[#B8FF01] transition-all duration-500"
                      style={{ width: `${currentChapter.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Transport Controls */}
                <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleTutorialPlay}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8FF01] text-[#050D08] hover:bg-[#c9ff33] transition-colors"
                      title={isTutorialPlaying ? 'Pause' : 'Play'}
                    >
                      {isTutorialPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setActiveChapterIdx(0);
                        if (tutorialVideoRef.current) {
                          tutorialVideoRef.current.currentTime = 0;
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E3B29] bg-[#08140C]/90 text-[#9EB5A5] hover:text-white transition-colors"
                      title={isFr ? 'Recommencer' : 'Restart clip'}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsTutorialMuted((prev) => !prev)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E3B29] bg-[#08140C]/90 text-[#9EB5A5] hover:text-white transition-colors"
                      title={isTutorialMuted ? 'Unmute' : 'Mute'}
                    >
                      {isTutorialMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-[#B8FF01]" />
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-[#9EB5A5]">
                    {isFr ? 'Étape' : 'Chapter'} {activeChapterIdx + 1} /{' '}
                    {activeTutorial.chapters.length} · {activeTutorial.duration}
                  </span>
                </div>
              </div>

              {/* Interactive Chapter Step Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#162B1E] bg-[#050D08] divide-y sm:divide-y-0 sm:divide-x divide-[#162B1E]">
                {activeTutorial.chapters.map((chap, idx) => {
                  const isCurrent = idx === activeChapterIdx;
                  return (
                    <button
                      key={chap.timeLabel}
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`p-4 text-left transition-colors ${
                        isCurrent ? 'bg-[#0C1D12]' : 'hover:bg-[#08140C]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className={isCurrent ? 'text-[#B8FF01] font-bold' : 'text-[#6E8B77]'}>
                          {chap.timeLabel}
                        </span>
                        {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#B8FF01]" />}
                      </div>
                      <p
                        className={`text-xs font-semibold line-clamp-1 ${
                          isCurrent ? 'text-white' : 'text-[#9EB5A5]'
                        }`}
                      >
                        {isFr ? chap.labelFr : chap.labelEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: FOOTBALL GAME VIDEOS SHOWCASE (6 PLAYABLE CLIPS)
           ========================================================= */}
        {activeMediaTab === 'match-videos' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FOOTBALL_GAME_VIDEOS.map((vid) => {
                const isInlinePlaying = playingGridVideoId === vid.id;
                return (
                  <div
                    key={vid.id}
                    onMouseEnter={() => setPlayingGridVideoId(vid.id)}
                    onMouseLeave={() => setPlayingGridVideoId(null)}
                    className="group rounded-2xl border border-[#162B1E] bg-[#08140C] overflow-hidden flex flex-col justify-between hover:border-[#B8FF01]/60 transition-all"
                  >
                    <div>
                      {/* Video Surface (Auto-plays on cursor hover!) */}
                      <div
                        onClick={() =>
                          setPlayingGridVideoId(isInlinePlaying ? null : vid.id)
                        }
                        className="relative aspect-[16/10] w-full bg-[#040A06] cursor-pointer overflow-hidden"
                      >
                        {isInlinePlaying ? (
                          <video
                            src={vid.videoUrl}
                            poster={vid.posterUrl}
                            className="h-full w-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={vid.posterUrl}
                            alt={vid.titleEn}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08140C] via-transparent to-black/40" />

                        {/* Top Telemetry Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="rounded-md bg-[#050D08]/90 border border-[#1E3B29] px-2.5 py-1 font-mono text-[11px] font-bold text-white backdrop-blur-md">
                            {vid.matchLabel} · <span className="text-[#B8FF01]">{vid.minute}</span>
                          </span>
                          <span className="rounded-md bg-[#B8FF01] px-2 py-0.5 font-mono text-[10px] font-extrabold text-[#050D08]">
                            {vid.xgValue}
                          </span>
                        </div>

                        {/* Center Play/Pause Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                              isInlinePlaying
                                ? 'bg-[#050D08]/75 text-[#B8FF01] border border-[#B8FF01] opacity-0 group-hover:opacity-100'
                                : 'bg-[#B8FF01] text-[#050D08] shadow-lg group-hover:scale-110'
                            }`}
                          >
                            {isInlinePlaying ? (
                              <Pause className="w-5 h-5 fill-current" />
                            ) : (
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                          </div>
                        </div>

                        {/* Bottom Bar Inside Video */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="rounded bg-[#050D08]/85 border border-[#B8FF01]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#B8FF01]">
                            {isInlinePlaying
                              ? isFr
                                ? '● LECTURE AU SURVOL'
                                : '● HOVER PLAYING'
                              : isFr
                              ? vid.aiTagFr
                              : vid.aiTagEn}
                          </span>
                          <span className="rounded bg-[#050D08]/85 px-2 py-0.5 font-mono text-[11px] text-white">
                            {vid.duration}
                          </span>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="p-5">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-[#7A9985] mb-1">
                          {vid.competition}
                        </p>
                        <h3 className="text-base font-bold text-white leading-snug mb-2">
                          {isFr ? vid.titleFr : vid.titleEn}
                        </h3>
                        <p className="text-xs text-[#9EB5A5] leading-relaxed">
                          {isFr ? vid.descriptionFr : vid.descriptionEn}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-5 pb-4 pt-3 border-t border-[#162B1E] flex items-center justify-between">
                      <button
                        onClick={() =>
                          setPlayingGridVideoId(isInlinePlaying ? null : vid.id)
                        }
                        className="text-xs font-bold text-[#B8FF01] hover:underline flex items-center gap-1.5"
                      >
                        {isInlinePlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            {isFr ? 'En lecture (Pause)' : 'Playing Inline (Pause)'}
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {isFr ? 'Lire l’extrait' : 'Play Match Clip'}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveMatchVideo(vid)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#9EB5A5] hover:text-white transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        {isFr ? 'Plein écran IA' : 'Theater View'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Theater Modal for Fullscreen Match Video Inspection */}
      {activeMatchVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActiveMatchVideo(null)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-[#1E3B29] bg-[#08140C] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#162B1E] bg-[#050D08] px-6 py-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#B8FF01]">
                  {activeMatchVideo.competition} · {activeMatchVideo.matchLabel} (
                  {activeMatchVideo.minute})
                </span>
                <h3 className="text-lg font-bold text-white">
                  {isFr ? activeMatchVideo.titleFr : activeMatchVideo.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setActiveMatchVideo(null)}
                className="rounded-lg border border-[#1E3B29] bg-[#0B1910] p-2 text-[#9EB5A5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <video
                src={activeMatchVideo.videoUrl}
                poster={activeMatchVideo.posterUrl}
                className="h-full w-full object-cover"
                controls
                autoPlay
                loop
                playsInline
              />
            </div>

            <div className="p-6 bg-[#08140C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded bg-[#B8FF01] px-2 py-0.5 font-mono text-[11px] font-bold text-[#050D08]">
                    {activeMatchVideo.xgValue}
                  </span>
                  <span className="rounded border border-[#B8FF01]/40 bg-[#B8FF01]/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#B8FF01]">
                    {isFr ? activeMatchVideo.aiTagFr : activeMatchVideo.aiTagEn}
                  </span>
                </div>
                <p className="text-sm text-[#9EB5A5]">
                  {isFr ? activeMatchVideo.descriptionFr : activeMatchVideo.descriptionEn}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveMatchVideo(null);
                  setActiveTab('ai-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="shrink-0 rounded-xl bg-[#B8FF01] px-4 py-2.5 text-xs font-bold text-[#050D08] hover:bg-[#c9ff33]"
              >
                {isFr ? 'Analyser dans Studio IA →' : 'Analyze in AI Studio →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
