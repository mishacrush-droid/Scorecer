import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';

const STORY_IMAGES = [
  '/images/highlight-goal.jpg',
  '/images/tactical-pitch.jpg',
  '/images/wet-turf.jpg',
];

const FRENCH_TRANSLATIONS: Record<
  string,
  {
    category: string;
    headline: string;
    aiSummary: string;
  }
> = {
  'clust-1': {
    category: 'Mercato Vérifié',
    headline:
      'Cadre de départ estival de Florian Wirtz & analyse de son profil tactique',
    aiSummary:
      'Scorecer a condensé 7 articles de presse distincts en 1 seul fil vérifié : le Bayer Leverkusen et les clubs intéressés ont entamé des discussions autour de 130 M€, sans clause active avant fin mai. Les rumeurs répétitives ont été filtrées.',
  },
  'clust-2': {
    category: 'Décryptage Tactique',
    headline:
      'Pourquoi les latéraux inversés laissent place aux défenseurs centraux hybrides',
    aiSummary:
      'Dans les 5 grands championnats européens, on observe une hausse de 31 % des relances en 3-2-5 formées par une sentinelle qui décroche entre les centraux plutôt que par un latéral rentrant.',
  },
  'clust-3': {
    category: 'Diffusion Directe',
    headline:
      'La Serie A et les ligues partenaires développent les matchs à la carte sans abonnement lourd',
    aiSummary:
      'Les détenteurs de droits permettent désormais aux supporters de débloquer un match à l’unité en un clic, avec commentaires IA multilingues directement intégrés.',
  },
};

export const DiscoverHubView: React.FC = () => {
  const {
    uiLanguage,
    discoverClusters,
    user,
    sendSquadMessage,
    setActiveTab,
    openAuthModal,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyMyClubs, setOnlyMyClubs] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>('clust-1');

  const categories = [
    { id: 'ALL', en: 'All Stories', fr: 'Toutes les actualités' },
    { id: 'Transfer Intelligence', en: 'Transfers', fr: 'Mercato' },
    { id: 'Tactical Breakdown', en: 'Tactics', fr: 'Tactique' },
    { id: 'Club D2C', en: 'Broadcasting', fr: 'Diffusion' },
  ];

  const filteredClusters = discoverClusters.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) {
      return false;
    }
    if (onlyMyClubs) {
      return c.clubsInvolved.some((club) =>
        user.favoriteClubs.some((fav) =>
          club.toLowerCase().includes(fav.toLowerCase())
        )
      );
    }
    return true;
  });

  return (
    <div className="bg-[#050D08] text-slate-100">
      {/* =====================================================================
          HERO BANNER — "Home stays clean. Discover holds the noise."
      ===================================================================== */}
      <section className="relative border-b border-[#162B1E] overflow-hidden py-16 lg:py-24 px-6">
        <img
          src="/images/tactical-pitch.jpg"
          alt="Tactical pitch view"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D08] via-[#050D08]/85 to-[#050D08]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? 'EXPLORER · ZÉRO SPAM' : 'DISCOVER · ZERO FEED SPAM'}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'L’accueil reste pur. Découvrir filtre le bruit.'
                : 'Home stays clean. Discover holds the noise.'}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {isFr
                ? 'Au lieu de cinq articles identiques sur la même rumeur mercato, notre IA regroupe les sources fiables en un seul récit clair.'
                : 'Instead of five repetitive articles repeating the same transfer rumor, Scorecer groups global reports into one clean, verified storyline.'}
            </p>
          </div>

          {/* Filter by My Clubs Toggle */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            <button
              onClick={() => setOnlyMyClubs(!onlyMyClubs)}
              className={`px-4 py-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                onlyMyClubs
                  ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                  : 'bg-[#08140C]/90 text-slate-200 border-[#1F3B2A] hover:border-[#B8FF01]/50'
              }`}
            >
              {isFr ? '★ Mes clubs favoris uniquement' : '★ My Followed Clubs Only'}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CATEGORY FILTER & DEDUPLICATED STORY CARDS
      ===================================================================== */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#162B1E] pb-5">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                        : 'bg-[#08140C] text-slate-300 border border-[#162B1E] hover:text-white'
                    }`}
                  >
                    {isFr ? cat.fr : cat.en}
                  </button>
                );
              })}
            </div>

            <span className="font-mono text-xs text-slate-400">
              {isFr
                ? '16 articles redondants condensés en 3 récits vérifiés'
                : '16 redundant reports condensed into 3 verified timelines'}
            </span>
          </div>

          {/* Story List */}
          <div className="space-y-8">
            {filteredClusters.map((cluster, idx) => {
              const frData = FRENCH_TRANSLATIONS[cluster.id];
              const headline = isFr && frData ? frData.headline : cluster.headline;
              const summary = isFr && frData ? frData.aiSummary : cluster.aiSummary;
              const catLabel = isFr && frData ? frData.category : cluster.category;
              const imgUrl = STORY_IMAGES[idx % STORY_IMAGES.length];
              const isExpanded = expandedId === cluster.id;

              return (
                <article
                  key={cluster.id}
                  className="rounded-2xl bg-[#08140C] border border-[#162B1E] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
                >
                  {/* Left Visual Column (5 cols) */}
                  <div className="lg:col-span-5 relative min-h-[240px] bg-black overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={headline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/50" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#050D08]/85 backdrop-blur-md border border-[#1F3B2A] font-mono text-[11px] text-[#B8FF01]">
                        {catLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <span className="inline-flex items-center gap-1.5 text-slate-200 bg-[#050D08]/80 px-2.5 py-1 rounded border border-[#1F3B2A]">
                        <Layers className="w-3.5 h-3.5 text-[#B8FF01]" />
                        {cluster.mergedArticlesCount}{' '}
                        {isFr ? 'articles fusionnés' : 'articles merged'}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#B8FF01] text-[#050D08] font-bold">
                        {cluster.reliabilityScore}%{' '}
                        {isFr ? 'Fiabilité' : 'Verified'}
                      </span>
                    </div>
                  </div>

                  {/* Right Editorial Content Column (7 cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {cluster.clubsInvolved.map((club) => (
                          <span
                            key={club}
                            className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#0B1A11] border border-[#1E3B28] text-slate-300"
                          >
                            {club}
                          </span>
                        ))}
                        <span className="text-xs font-mono text-slate-500 ml-auto">
                          {cluster.updatedAgo}
                        </span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                        {headline}
                      </h2>

                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {summary}
                      </p>
                    </div>

                    {/* Expandable Source Breakdown & Share to Squad */}
                    <div className="space-y-4 pt-2 border-t border-[#162B1E]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : cluster.id)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B8FF01] hover:underline cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {isFr
                              ? `Voir les ${cluster.sources.length} sources regroupées`
                              : `View ${cluster.sources.length} grouped sources`}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            sendSquadMessage(
                              isFr
                                ? `Que pensez-vous de cette info vérifiée ? « ${headline} »`
                                : `Thoughts on this verified story? "${headline}"`
                            );
                            setActiveTab('social-squads');
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B1A11] hover:bg-[#132A1C] border border-[#1F3B2A] text-xs font-medium text-white cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#B8FF01]" />
                          <span>
                            {isFr ? 'En discuter dans Squads' : 'Discuss in Squad'}
                          </span>
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          {cluster.sources.map((src, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-[#050D08] border border-[#162B1E] space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-white font-semibold">
                                  {src.publisher}
                                </span>
                                <span className="text-[#B8FF01]">{src.tier}</span>
                              </div>
                              <p className="text-xs text-slate-400 leading-snug">
                                {src.angle}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Personalization CTA */}
          <div className="rounded-2xl bg-[#08140C] border border-[#162B1E] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B8FF01]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isFr ? 'FIL PERSONNALISÉ' : 'PERSONALIZED FEED'}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {isFr
                  ? 'Personnalisez Découvrir selon vos clubs favoris'
                  : 'Tailor Discover around your favorite clubs'}
              </h3>
              <p className="text-sm text-slate-400">
                {isFr
                  ? 'Choisissez vos équipes et compétitions pour filtrer automatiquement votre fil.'
                  : 'Select your teams and leagues to filter transfer timelines automatically.'}
              </p>
            </div>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm cursor-pointer shrink-0"
            >
              {isFr ? 'Choisir mes clubs' : 'Select my clubs'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
