import React, { useState, useEffect } from 'react';
import {
  Users,
  HelpCircle,
  ChevronDown,
  Search,
  Edit3,
  Check,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Cpu,
  Globe2,
  Mail,
  MapPin,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';

export interface ExecutiveLeaderProfile {
  id: 'ceo' | 'cto';
  roleCode: 'CEO' | 'CTO';
  name: string;
  roleTitleEn: string;
  roleTitleFr: string;
  headlineBadgeEn: string;
  headlineBadgeFr: string;
  locationEn: string;
  locationFr: string;
  email: string;
  experienceSummaryEn: string;
  experienceSummaryFr: string;
  skillsEn: string[];
  skillsFr: string[];
  portraitUrl: string;
  bannerImageUrl: string;
}

export const DEFAULT_LEADERSHIP_PROFILES: ExecutiveLeaderProfile[] = [
  {
    id: 'ceo',
    roleCode: 'CEO',
    name: 'Aleksandra Kurbanova',
    roleTitleEn: 'Chief Executive Officer & Co-Founder',
    roleTitleFr: 'Directrice Générale (CEO) & Co-Fondatrice',
    headlineBadgeEn: 'CEO · PRODUCT STRATEGY & SUPPORTER COMMUNITY',
    headlineBadgeFr: 'CEO · STRATÉGIE PRODUIT & COMMUNAUTÉ SUPPORTERS',
    locationEn: 'Moscow · International',
    locationFr: 'Moscou · International',
    email: 'a.kurbanova@scorecer.com',
    experienceSummaryEn:
      'Sports-tech executive leading Scorecer’s product vision, community growth, and commercial partnerships. Previously Head of Football Community & Supporter Engagement at the Russian Football Union (Union russe de football, 2022–2025) and Commercial Director at Tari Travel (2018–2022), specializing in matchday fan activations and international sports hospitality.',
    experienceSummaryFr:
      'Dirigeante sports-tech pilotant la vision produit, la croissance communautaire et les partenariats de Scorecer. Auparavant Responsable Communauté Football & Engagement des Supporters à l’Union russe de football (2022–2025) et Directrice Commerciale chez Tari Travel (2018–2022), spécialisée dans les expériences matchday et le tourisme sportif.',
    skillsEn: [
      'Startup & AI Product Strategy',
      'Supporter Community Engagement',
      'Matchday Experience Design',
      'Commercial Partnerships & GTM',
      'Sports Hospitality & Events',
    ],
    skillsFr: [
      'Stratégie Produit IA & Startup',
      'Engagement des Supporters',
      'Expériences Matchday',
      'Partenariats & Go-To-Market',
      'Événements & Tourisme Sportif',
    ],
    portraitUrl: '/images/ceo-aleksandra.jpg',
    bannerImageUrl: '/images/hero-goalnet.jpg',
  },
  {
    id: 'cto',
    roleCode: 'CTO',
    name: 'Max Barablin',
    roleTitleEn: 'Chief Technology Officer & Co-Founder',
    roleTitleFr: 'Directeur Technique (CTO) & Co-Fondateur',
    headlineBadgeEn: 'CTO · AI ARCHITECTURE & DATA SYSTEMS',
    headlineBadgeFr: 'CTO · ARCHITECTURE IA & SYSTÈMES DE DONNÉES',
    locationEn: 'Dubai, UAE · International',
    locationFr: 'Dubaï, EAU · International',
    email: 'm.barablin@scorecer.com',
    experienceSummaryEn:
      'Technical product leader architecting Scorecer’s AI-native platform, live match telemetry, and scouting analytics from Dubai. Brings 15+ years of experience driving digital transformation and enterprise data platforms as IT Product Manager at Finera FZCO in Dubai (2022–2026) and Digital Operations Product Manager at LUKOIL (2016–2022).',
    experienceSummaryFr:
      'Leader produit et technologie dirigeant l’architecture IA native, la télémétrie en direct et l’analytique de Scorecer depuis Dubaï. Plus de 15 ans d’expérience dans la transformation digitale et les plateformes de données chez Finera FZCO à Dubaï (2022–2026) et LUKOIL (2016–2022).',
    skillsEn: [
      'AI-Native Platform Architecture',
      'Live Telemetry & Scouting Analytics',
      'Data-Driven Product Workflows',
      'System Reliability & Security',
      'Enterprise Digital Transformation',
    ],
    skillsFr: [
      'Architecture Plateforme IA Native',
      'Télémétrie Live & Analytique',
      'Workflows Produit & Données',
      'Fiabilité & Sécurité Système',
      'Transformation Digitale',
    ],
    portraitUrl: '/images/cto-max.jpg',
    bannerImageUrl: '/images/tactical-pitch.jpg',
  },
];

interface FaqItem {
  id: string;
  category: 'ai' | 'data' | 'social' | 'auth';
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'ai',
    questionEn: 'How is Scorecer different from traditional apps like OneFootball, FotMob, or SofaScore?',
    questionFr: 'En quoi Scorecer diffère-t-il des applications classiques comme OneFootball, FotMob ou SofaScore ?',
    answerEn:
      'Legacy apps force you to choose between cluttered media feeds full of pop-up ads or passive spreadsheets of raw numbers. Scorecer combines sub-second live match telemetry (~0.8s latency) with a native AI Match Assistant, emotion-aware multilingual audio commentary, automated 9:16 highlight Stories, and live Squad watch parties—all in one clean, ad-respectful interface.',
    answerFr:
      'Les applications historiques vous obligent à choisir entre des flux saturés de publicités intrusives ou des tableaux de chiffres passifs. Scorecer réunit une télémétrie en direct ultra-rapide (~0,8s), un Assistant IA de match, des commentaires audio multilingues, des Stories vidéo automatisées et des Squads interactifs dans une interface épurée.',
  },
  {
    id: 'faq-2',
    category: 'data',
    questionEn: 'Where does Scorecer get its real-time and historical football match data?',
    questionFr: 'D’où proviennent les données de matchs en temps réel et historiques de Scorecer ?',
    answerEn:
      'Scorecer connects directly to live football scoreboard feeds (including the public ESPN Soccer API across the UEFA Champions League, Premier League, Ligue 1, LaLiga, Serie A, and Bundesliga) alongside our verified Historical Match Archive. You can sync today’s live fixtures, pick any calendar date, or import classic matches like PSG 4–2 Man City and Real Madrid 0–4 Barcelona with one click.',
    answerFr:
      'Scorecer se connecte directement aux flux de scores en direct (notamment l’API publique ESPN Soccer couvrant la Ligue des Champions, Premier League, Ligue 1, LaLiga, Serie A et Bundesliga) ainsi qu’à notre Archive de Matchs Historiques. Vous pouvez synchroniser les matchs du jour, choisir une date ou importer des classiques comme PSG 4–2 Man City.',
  },
  {
    id: 'faq-3',
    category: 'ai',
    questionEn: 'How does the AI Match Assistant avoid hallucinations during a live game?',
    questionFr: 'Comment l’Assistant IA évite-t-il les erreurs pendant un match en direct ?',
    answerEn:
      'Unlike generic chatbots that guess from outdated training data, Scorecer’s Match Assistant uses a Live Match Retrieval-Augmented Generation (RAG) pipeline strictly grounded in the structured event stream—real-time xG jumps, pass networks, defensive line heights, and official match events. Every tactical answer also queues the exact timestamped highlight clip.',
    answerFr:
      'Contrairement aux chatbots génériques, l’Assistant Match de Scorecer utilise un moteur RAG strictement ancré dans le flux d’événements structurés en direct : bonds d’xG, réseaux de passes, hauteur du bloc et événements officiels. Chaque réponse tactique prépare également l’extrait vidéo horodaté correspondant.',
  },
  {
    id: 'faq-4',
    category: 'ai',
    questionEn: 'Can I change the voice and personality of the AI commentator?',
    questionFr: 'Puis-je changer la voix et le style du commentateur IA ?',
    answerEn:
      'Yes! You can switch anytime between three distinct AI commentary personas: Tactical Analyst (deep xG, pressing traps, and rest-defense breakdowns), Passionate Fan (high-energy supporter emotion), and Neutral Broadcaster—available with real-time Web Speech synthesis in English, French, Spanish, German, Italian, and Portuguese.',
    answerFr:
      'Oui ! Vous pouvez basculer à tout moment entre trois personas : Analyste Tactique (xG, pièges de pressing et couverture défensive), Supporter Passionné (haute intensité émotionnelle) et Commentateur Neutre — avec synthèse vocale en anglais, français, espagnol, allemand, italien et portugais.',
  },
  {
    id: 'faq-5',
    category: 'social',
    questionEn: 'What are Squads and how do live shared widgets work?',
    questionFr: 'Que sont les Squads et comment fonctionnent les widgets partagés en direct ?',
    answerEn:
      'Squads are persistent private rooms for your friend group alongside moderated public match megathreads. Instead of pasting dead screenshots into external chat apps, you can drop live xG charts, player rating cards, and momentum waves directly into your Squad thread—and those cards continue updating automatically across tabs and devices.',
    answerFr:
      'Les Squads sont des salons privés permanents pour vos amis ainsi que des mégathreads publics modérés. Au lieu d’envoyer des captures d’écran figées, vous partagez des cartes xG, notes de joueurs et courbes de momentum qui continuent de se mettre à jour en direct dans la conversation.',
  },
  {
    id: 'faq-6',
    category: 'social',
    questionEn: 'How do Stoppage-Time Micro-Predictions and FanScore XP work?',
    questionFr: 'Comment fonctionnent les micro-pronostics pendant les arrêts de jeu et les XP FanScore ?',
    answerEn:
      'Whenever a live match pauses for a VAR check, penalty, dangerous free-kick, or injury stoppage, Scorecer opens a 45-second micro-prediction window inside your Squad. Locking in accurate predictions earns you FanScore XP, which unlocks official club merchandise discounts, free Pay-Per-View match streams, and partner pub perks.',
    answerFr:
      'Lorsqu’un match s’arrête pour une vérification VAR, un penalty ou un coup franc dangereux, Scorecer ouvre une fenêtre de pronostic de 45 secondes dans votre Squad. Vos bons pronostics rapportent des XP FanScore échangeables contre des réductions boutique, des matchs PPV gratuits et des avantages dans les pubs.',
  },
  {
    id: 'faq-7',
    category: 'social',
    questionEn: 'How do Watch Parties (O2O Partner Pubs) and Spoiler Shield work?',
    questionFr: 'Comment fonctionnent les Soirées Match (Pubs Partenaires) et le Bouclier Anti-Spoiler ?',
    answerEn:
      'In the Watch Parties tab, you can discover verified local supporter bars in cities like London, Paris, Madrid, and New York, RSVP with your Squad, and claim QR check-in rewards. If you are streaming from home on a delayed broadcast, our PWA Spoiler Shield lets you buffer push notifications by +15s, +30s, or +60s so a goal alert never spoils your stream.',
    answerFr:
      'Dans l’onglet Soirées Match, trouvez des bars de supporters vérifiés à Londres, Paris, Madrid ou New York, réservez avec votre Squad et débloquez des récompenses QR. Si vous regardez un stream avec décalage, le Bouclier Anti-Spoiler retarde les alertes de +15s, +30s ou +60s pour ne jamais divulgâcher un but.',
  },
  {
    id: 'faq-8',
    category: 'auth',
    questionEn: 'How is my account secured and how does cloud synchronization work?',
    questionFr: 'Comment mon compte est-il sécurisé et comment fonctionne la synchronisation cloud ?',
    answerEn:
      'Scorecer uses browser-native Web Crypto API SHA-256 password hashing with unique per-user cryptographic salts, signed session tokens, and Google/Apple OAuth. Account state, Squad messages, and FanScore XP sync across tabs and devices via our Realtime Cloud Replica & Supabase-ready sync engine, with strict GDPR zero-party controls.',
    answerFr:
      'Scorecer utilise le hachage cryptographique SHA-256 via l’API Web Crypto avec un sel unique par utilisateur, des jetons de session signés et la connexion Google/Apple. Vos données, messages Squad et XP FanScore sont synchronisés en temps réel tout en respectement strictement le RGPD.',
  },
  {
    id: 'faq-9',
    category: 'data',
    questionEn: 'How does the Discover tab keep transfer rumors and clickbait out of my main feed?',
    questionFr: 'Comment l’onglet Découvrir évite-t-il les rumeurs mercato et le clickbait sur mon accueil ?',
    answerEn:
      'Matchday utility and media browsing are intentionally separated. Your Home & Live Matches views stay 100% focused on scores, tactics, and clips. Meanwhile, our AI Story Deduplicator in the Discover tab clusters 40+ repetitive transfer articles from across the web into a single verified timeline with a clear Reliability Tier rating.',
    answerFr:
      'L’utilitaire de jour de match et l’exploration média sont volontairement séparés. Votre accueil reste 100 % dédié aux scores et à la tactique. Dans Découvrir, notre déduplicateur IA regroupe des dizaines d’articles mercato répétitifs en une seule chronologie vérifiée avec un indice de fiabilité.',
  },
  {
    id: 'faq-10',
    category: 'auth',
    questionEn: 'Can I install Scorecer as a Progressive Web App (PWA) and share direct deep-links?',
    questionFr: 'Puis-je installer Scorecer en application (PWA) et partager des liens directs ?',
    answerEn:
      'Yes! Scorecer includes a full PWA manifest and offline-ready Service Worker so you can install it directly to your iOS, Android, or desktop home screen. Every match, historical archive fixture, and Squad room also generates a shareable URL deep-link so you can invite friends directly into the exact match state.',
    answerFr:
      'Oui ! Scorecer intègre un manifeste PWA complet et un Service Worker permettant de l’installer sur votre écran d’accueil iOS, Android ou ordinateur. Chaque match et salon Squad génère également un lien direct partageable en un clic.',
  },
];

// Bumped to v3 for concise co-founder cards (experience + skills only, no education)
const LEADERSHIP_STORAGE_KEY = 'scorecer_leadership_team_v3';

export const TeamAndFaqSection: React.FC = () => {
  const { uiLanguage, openAuthModal } = useScorecer();
  const isFr = uiLanguage === 'fr';

  const [leaders, setLeaders] = useState<ExecutiveLeaderProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LEADERSHIP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === 2 &&
          parsed[0]?.experienceSummaryEn &&
          parsed[1]?.experienceSummaryEn
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_LEADERSHIP_PROFILES;
  });

  // Inline Editor state
  const [editingRole, setEditingRole] = useState<'ceo' | 'cto' | null>(null);
  const [editDraft, setEditDraft] = useState<ExecutiveLeaderProfile | null>(null);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  // FAQ state
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'ai' | 'data' | 'social' | 'auth'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-2']);

  useEffect(() => {
    try {
      localStorage.setItem(LEADERSHIP_STORAGE_KEY, JSON.stringify(leaders));
    } catch {
      // ignore storage errors
    }
  }, [leaders]);

  const startEditingLeader = (leader: ExecutiveLeaderProfile) => {
    setEditingRole(leader.id);
    setEditDraft({ ...leader });
    setSavedBanner(false);
  };

  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDraft) return;
    setLeaders((prev) =>
      prev.map((item) => (item.id === editDraft.id ? editDraft : item))
    );
    setEditingRole(null);
    setEditDraft(null);
    setSavedBanner(true);
    window.setTimeout(() => setSavedBanner(false), 3500);
  };

  const handleResetLeaders = () => {
    setLeaders(DEFAULT_LEADERSHIP_PROFILES);
    localStorage.removeItem(LEADERSHIP_STORAGE_KEY);
    setEditingRole(null);
    setEditDraft(null);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const targetQ = (isFr ? item.questionFr : item.questionEn).toLowerCase();
    const targetA = (isFr ? item.answerFr : item.answerEn).toLowerCase();
    return targetQ.includes(q) || targetA.includes(q);
  });

  return (
    <>
      {/* =====================================================================
          PART 1: CONCISE LEADERSHIP SECTION (ALEKSANDRA KURBANOVA & MAX BARABLIN)
      ===================================================================== */}
      <section
        id="leadership-team"
        className="border-b border-[#162B1E] bg-[#050D08] py-20 lg:py-24 px-6"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01] flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                {isFr ? 'ÉQUIPE DIRIGEANTE' : 'FOUNDING LEADERSHIP'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Les co-fondateurs de Scorecer.'
                  : 'Meet the Scorecer co-founders.'}
              </h2>
              <p className="text-sm sm:text-base text-[#9EB5A5] leading-relaxed">
                {isFr
                  ? 'L’alliance de l’engagement des communautés football et de l’architecture produit IA en temps réel.'
                  : 'Uniting football community leadership with real-time AI product engineering.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {savedBanner && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#B8FF01]/15 border border-[#B8FF01]/40 px-3 py-2 text-xs font-mono text-[#B8FF01]">
                  <Check className="w-3.5 h-3.5" />
                  {isFr ? 'Profils enregistrés' : 'Profiles saved'}
                </span>
              )}
              <button
                onClick={() => startEditingLeader(leaders[0])}
                className="inline-flex items-center gap-2 rounded-xl border border-[#244430] bg-[#08140C] hover:border-[#B8FF01]/60 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#B8FF01]" />
                {isFr ? 'Éditer' : 'Edit Bios'}
              </button>
            </div>
          </div>

          {/* Optional Compact Inline Editor */}
          {editingRole && editDraft && (
            <form
              onSubmit={handleSaveLeader}
              className="rounded-2xl border border-[#B8FF01]/60 bg-[#08140C] p-6 space-y-5 shadow-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#162B1E] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-[#B8FF01] px-2 py-0.5 font-mono text-xs font-extrabold text-[#050D08]">
                    {editDraft.roleCode}
                  </span>
                  <h3 className="font-display text-base font-bold text-white">
                    {editDraft.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startEditingLeader(
                        editDraft.id === 'ceo' ? leaders[1] : leaders[0]
                      )
                    }
                    className="rounded-lg border border-[#1E3B29] bg-[#050D08] px-3 py-1 text-xs text-[#9EB5A5] hover:text-white cursor-pointer"
                  >
                    {editDraft.id === 'ceo' ? 'Switch to CTO →' : '← Switch to CEO'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetLeaders}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1E3B29] bg-[#050D08] px-3 py-1 text-xs text-[#9EB5A5] hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {isFr ? 'Réinitialiser' : 'Reset'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EB5A5] mb-1">
                    {isFr ? 'Nom' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={editDraft.name}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#1E3B29] bg-[#050D08] px-3 py-2 text-sm text-white focus:border-[#B8FF01] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EB5A5] mb-1">
                    {isFr ? 'Rôle' : 'Role Title'}
                  </label>
                  <input
                    type="text"
                    value={isFr ? editDraft.roleTitleFr : editDraft.roleTitleEn}
                    onChange={(e) =>
                      setEditDraft(
                        isFr
                          ? { ...editDraft, roleTitleFr: e.target.value }
                          : { ...editDraft, roleTitleEn: e.target.value }
                      )
                    }
                    className="w-full rounded-lg border border-[#1E3B29] bg-[#050D08] px-3 py-2 text-sm text-white focus:border-[#B8FF01] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-[#9EB5A5] mb-1">
                    {isFr ? 'Résumé de l’expérience' : 'Brief Experience Summary'}
                  </label>
                  <textarea
                    rows={2}
                    value={
                      isFr
                        ? editDraft.experienceSummaryFr
                        : editDraft.experienceSummaryEn
                    }
                    onChange={(e) =>
                      setEditDraft(
                        isFr
                          ? { ...editDraft, experienceSummaryFr: e.target.value }
                          : { ...editDraft, experienceSummaryEn: e.target.value }
                      )
                    }
                    className="w-full rounded-lg border border-[#1E3B29] bg-[#050D08] px-3 py-2 text-sm text-white focus:border-[#B8FF01] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRole(null);
                    setEditDraft(null);
                  }}
                  className="rounded-lg border border-[#1E3B29] px-4 py-1.5 text-xs text-[#9EB5A5] hover:text-white cursor-pointer"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#B8FF01] px-4 py-1.5 text-xs font-bold text-[#050D08] hover:bg-[#c8ff38] cursor-pointer"
                >
                  {isFr ? 'Enregistrer' : 'Save'}
                </button>
              </div>
            </form>
          )}

          {/* Clean, Concise 2-Card Co-Founder Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {leaders.map((leader) => {
              const isCeo = leader.id === 'ceo';
              const skills = isFr ? leader.skillsFr : leader.skillsEn;

              return (
                <div
                  key={leader.id}
                  className="group rounded-2xl border border-[#162B1E] bg-[#08140C] overflow-hidden flex flex-col justify-between hover:border-[#B8FF01]/50 transition-all shadow-xl"
                >
                  <div>
                    {/* Compact Header with Portrait + Name */}
                    <div className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-[#162B1E] bg-gradient-to-br from-[#0B1D12] via-[#08140C] to-[#050D08]">
                      <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-[#B8FF01] bg-[#050D08] shrink-0 shadow-lg">
                        <img
                          src={leader.portraitUrl}
                          alt={leader.name}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B8FF01]/35 bg-[#050D08] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#B8FF01]">
                          {isCeo ? (
                            <Globe2 className="w-3 h-3" />
                          ) : (
                            <Cpu className="w-3 h-3" />
                          )}
                          {isFr ? leader.headlineBadgeFr : leader.headlineBadgeEn}
                        </span>

                        <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                          {leader.name}
                        </h3>

                        <p className="text-xs font-mono text-[#B8FF01]">
                          {isFr ? leader.roleTitleFr : leader.roleTitleEn}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs font-mono text-[#8FA897]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#B8FF01]" />
                            {isFr ? leader.locationFr : leader.locationEn}
                          </span>
                          <a
                            href={`mailto:${leader.email}`}
                            className="inline-flex items-center gap-1 hover:text-[#B8FF01] transition-colors"
                          >
                            <Mail className="w-3 h-3 text-[#B8FF01]" />
                            {leader.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Concise Professional Experience + Core Skills */}
                    <div className="p-6 sm:p-7 space-y-5">
                      <p className="text-sm text-[#C4D6C9] leading-relaxed">
                        {isFr
                          ? leader.experienceSummaryFr
                          : leader.experienceSummaryEn}
                      </p>

                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A9985] mb-2.5 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#B8FF01]" />
                          {isFr ? 'COMPÉTENCES CLÉS' : 'CORE SKILLS & EXPERTISE'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-[#1E3B29] bg-[#050D08] px-3 py-1 text-xs font-medium text-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Card Footer */}
                  <div className="px-6 sm:px-7 py-3.5 border-t border-[#162B1E] bg-[#050D08]/60 flex items-center justify-between text-xs font-mono">
                    <a
                      href={`mailto:${leader.email}`}
                      className="text-[#9EB5A5] hover:text-[#B8FF01] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#B8FF01]" />
                      <span>{isFr ? 'Contacter directement' : 'Direct Contact'}</span>
                    </a>

                    <span className="inline-flex items-center gap-1 text-[#B8FF01]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {isFr ? 'Co-Fondateur Scorecer' : 'Scorecer Co-Founder'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PART 2: FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
      ===================================================================== */}
      <section
        id="faq-section"
        className="border-b border-[#162B1E] bg-[#050D08] py-20 lg:py-28 px-6"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01] inline-flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              {isFr ? 'QUESTIONS FRÉQUENTES · FAQ' : 'FREQUENTLY ASKED QUESTIONS'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {isFr
                ? 'Tout savoir sur Scorecer.'
                : 'Everything you need to know.'}
            </h2>
            <p className="text-sm sm:text-base text-[#9EB5A5] leading-relaxed">
              {isFr
                ? 'Réponses claires sur notre moteur de données en direct, l’Assistant IA RAG, les Squads, la sécurité SHA-256 et l’application PWA.'
                : 'Clear answers about our sub-second live data engine, grounded Match AI RAG, Squad watch parties, SHA-256 account security, and PWA installation.'}
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#08140C] border border-[#162B1E] rounded-2xl p-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', en: 'All Questions (10)', fr: 'Toutes (10)' },
                  { id: 'ai', en: 'Product & AI', fr: 'Produit & IA' },
                  { id: 'data', en: 'Live & Historical Data', fr: 'Données & API' },
                  { id: 'social', en: 'Squads & Pubs', fr: 'Squads & Pubs' },
                  { id: 'auth', en: 'Account & PWA', fr: 'Compte & PWA' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#B8FF01] text-[#050D08]'
                      : 'bg-[#050D08] text-[#9EB5A5] hover:text-white border border-[#162B1E]'
                  }`}
                >
                  {isFr ? cat.fr : cat.en}
                </button>
              ))}
            </div>

            {/* Instant Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-[#7A9985] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? 'Rechercher (ex: ESPN, xG, Squads, PWA)...'
                    : 'Search FAQ (e.g. ESPN, xG, Squads, PWA)...'
                }
                className="w-full rounded-xl border border-[#1E3B29] bg-[#050D08] pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-[#6E8B77] focus:border-[#B8FF01] outline-none"
              />
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openFaqIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'border-[#B8FF01]/60 bg-[#08140C]'
                      : 'border-[#162B1E] bg-[#08140C]/60 hover:border-[#244430]'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-xs font-bold text-[#B8FF01] shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-base sm:text-lg font-bold text-white">
                        {isFr ? item.questionFr : item.questionEn}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[#B8FF01] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-[#162B1E]/80 text-sm text-[#9EB5A5] leading-relaxed">
                      {isFr ? item.answerFr : item.answerEn}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="rounded-2xl border border-[#162B1E] bg-[#08140C] p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-white">
                  {isFr
                    ? 'Aucune question ne correspond à votre recherche.'
                    : 'No FAQ items matched your search.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-mono text-[#B8FF01] hover:underline"
                >
                  {isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Support / Onboarding Prompt */}
          <div className="rounded-2xl border border-[#1E3B29] bg-[#08140C] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B8FF01]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isFr
                    ? 'ENCORE UNE QUESTION ?'
                    : 'STILL HAVE A QUESTION ABOUT SCORECER?'}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {isFr
                  ? 'Créez votre compte gratuit ou interrogez directement notre Assistant IA.'
                  : 'Create your free account or ask our live AI Match Assistant directly.'}
              </h3>
            </div>

            <button
              onClick={() => openAuthModal('signup')}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#B8FF01] hover:bg-[#c8ff38] px-5 py-3 text-xs font-bold text-[#050D08] transition-all cursor-pointer"
            >
              <span>{isFr ? 'Commencer maintenant' : 'Get started free'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
