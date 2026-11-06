import React, { useState } from 'react';
import {
  Award,
  Beer,
  Calendar,
  Check,
  CheckCircle2,
  Crosshair,
  Lock,
  MapPin,
  Navigation,
  PlusCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trophy,
  Tv,
  Unlock,
  Users,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { O2OEvent } from '../../types/scorecer';

type CategoryFilter = 'all' | 'watch-party' | 'pickup-game' | 'supporters-pub';

const O2O_TRANSLATIONS_FR: Record<
  string,
  {
    title: string;
    city: string;
    dateTime: string;
    clubFocus: string;
    perks: string[];
  }
> = {
  'o2o-1': {
    title: 'Grande Soirée Match Quart de Finale LDC & Derby du Nord de Londres',
    city: 'Londres · Islington',
    dateTime: 'Ce soir · En direct (Ouverture 19h00)',
    clubFocus: 'Arsenal',
    perks: [
      'Écran géant synchronisé avec les xG Scorecer en direct',
      'Entrée gratuite pour les membres du Squad',
      'Quiz Pronostics FanScore à la mi-temps',
    ],
  },
  'o2o-2': {
    title: 'Match Foot à 7 Nocturne Sous Projecteurs (Tous Niveaux)',
    city: 'Londres · Shoreditch',
    dateTime: 'Demain · 20h00 - 21h30',
    clubFocus: 'Communauté Ouverte',
    perks: [
      'Chasubles et ballon officiel fournis',
      'Notes des joueurs publiées dans le Squad après le match',
      '2 places restantes',
    ],
  },
  'o2o-3': {
    title: 'QG Officiel Peña Madridista · Double Diffusion Audio',
    city: 'Londres · Soho',
    dateTime: 'Ce soir · En direct',
    clubFocus: 'Real Madrid',
    perks: [
      'Zones audio IA Espagnol & Français / Anglais',
      'Accueil par Hôte Certifié (+100 FanScore au check-in)',
    ],
  },
};

export const O2OLocalNetworkView: React.FC = () => {
  const {
    uiLanguage,
    user,
    updateUserPreferences,
    o2oEvents,
    toggleO2ORSVP,
    applyAsCertifiedHost,
    addFanScore,
    setActiveTab,
    pureTacticalMode,
    togglePureTacticalMode,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('all');
  const [searchRadiusMiles, setSearchRadiusMiles] = useState<number>(10);
  const [showPostgisInspector, setShowPostgisInspector] =
    useState<boolean>(true);
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);

  // Certified Host Inline Form State
  const [venueName, setVenueName] = useState<string>(
    'The Highbury Library Sports Taproom'
  );
  const [cityName, setCityName] = useState<string>('London · Highbury');
  const [clubFocus, setClubFocus] = useState<string>(
    user.favoriteClubs[0] || 'Arsenal'
  );
  const [justPublished, setJustPublished] = useState<boolean>(false);

  const radiusMeters = Math.round(searchRadiusMiles * 1609.34);

  const filteredEvents = o2oEvents.filter((ev) => {
    if (selectedCategory !== 'all' && ev.type !== selectedCategory) return false;
    const evMiles =
      ev.distanceMiles ?? Number((ev.distanceKm * 0.621371).toFixed(1));
    if (evMiles > searchRadiusMiles) return false;
    return true;
  });

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueName.trim() || !cityName.trim() || !clubFocus.trim()) return;
    applyAsCertifiedHost(venueName.trim(), cityName.trim(), clubFocus.trim());
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 4000);
  };

  const handleVenueCheckIn = (ev: O2OEvent) => {
    if (checkedInIds.includes(ev.id)) return;
    setCheckedInIds((prev) => [...prev, ev.id]);
    addFanScore(
      100,
      isFr
        ? `Check-in QR validé à ${ev.venueName} !`
        : `Verified O2O QR Check-In at ${ev.venueName}!`
    );
  };

  const getCategoryMeta = (type: O2OEvent['type']) => {
    switch (type) {
      case 'watch-party':
        return {
          label: isFr ? 'Soirée Match Certifiée' : 'Certified Watch Party',
          icon: Tv,
          image: '/images/squads-pub.jpg',
        };
      case 'pickup-game':
        return {
          label: isFr ? 'Foot à 5 & 7 Local' : 'Local 5v5 / 7v7 Pickup',
          icon: Trophy,
          image: '/images/wet-turf.jpg',
        };
      case 'supporters-pub':
        return {
          label: isFr ? 'Pub Supporters Partenaire' : 'Supporters Pub',
          icon: Beer,
          image: '/images/squads-pub.jpg',
        };
    }
  };

  return (
    <div className="bg-[#050D08] text-slate-100">
      {/* Step 1: Pure Tactical Mode Collapse Notice */}
      {pureTacticalMode && (
        <div className="bg-[#00F59B]/10 border-b border-[#00F59B]/30 px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#00F59B]">
            <span className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 shrink-0" />
              <strong>PURE TACTICAL MODE ACTIVE</strong> — Hyper-Local O2O venue discovery and watch parties are collapsed to maintain a distraction-free match analytics experience.
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
          HERO HEADER — Backed by /images/squads-pub.jpg & /images/wet-turf.jpg
      ===================================================================== */}
      <section className="relative min-h-[460px] lg:min-h-[520px] flex items-end border-b border-[#162B1E] overflow-hidden">
        <img
          src="/images/squads-pub.jpg"
          alt={
            isFr
              ? 'Supporters réunis dans un pub pour le match'
              : 'Supporters gathered at a pub table watching the match'
          }
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D08]/95 via-[#050D08]/75 to-[#050D08]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/35 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16 lg:py-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          {/* Left Editorial Copy */}
          <div className="max-w-2xl space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr
                ? 'RÉSEAU LOCAL · SOIRÉES PUB & FOOT À 5/7'
                : 'LOCAL NETWORK · WATCH PARTIES & PICKUP FOOTBALL'}
            </p>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              {isFr
                ? 'Du groupe de discussion à la table du pub.'
                : 'From the group chat to the pub table.'}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl">
              {isFr
                ? 'Trouvez des pubs de supporters à proximité, rejoignez des soirées match certifiées avec grands écrans synchronisés, ou réservez votre place pour un foot à 5 ou à 7 sous les projecteurs.'
                : 'Find nearby supporter pubs, join certified fan watch parties with synced big screens, or lock in your spot for a floodlit 5v5 or 7v7 pickup football game.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#section-nearby-events"
                className="px-5 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer"
              >
                {isFr ? 'Explorer les événements' : 'Explore Nearby Events'}
              </a>
              <a
                href="#section-certified-host"
                className="px-5 py-2.5 rounded-lg bg-[#08140C]/90 hover:bg-[#0B1A11] text-white font-medium text-sm border border-[#1F3B2A] transition-all cursor-pointer backdrop-blur-md"
              >
                {isFr ? 'Devenir Hôte Certifié' : 'Become a Certified Host'}
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('social-squads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-lg bg-[#08140C]/80 hover:bg-[#0B1A11] text-slate-200 border border-[#162B1E] text-sm transition-all cursor-pointer"
              >
                {isFr ? 'Retour aux Squads' : 'Back to Squads'}
              </button>
            </div>
          </div>

          {/* Right Secondary Editorial Photo Card (/images/wet-turf.jpg) */}
          <div className="w-full sm:w-80 rounded-xl overflow-hidden border border-[#1F3B2A] bg-[#08140C]/90 backdrop-blur-md self-start lg:self-end">
            <div className="relative h-32 overflow-hidden">
              <img
                src="/images/wet-turf.jpg"
                alt={
                  isFr
                    ? 'Pelouse éclairée pour foot à 5 et 7'
                    : 'Floodlit turf pitch for local 5v5 and 7v7 pickup football'
                }
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08140C] via-transparent to-transparent" />
              <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#050D08]/85 text-[#B8FF01] border border-[#1F3B2A]">
                {isFr ? 'FOOT À 5 & 7 · SOIRÉES PUB' : '5V5 / 7V7 · PUB HUBS'}
              </span>
            </div>
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  {isFr ? 'Événements actifs' : 'Active local hubs'}
                </span>
                <span className="text-[#B8FF01] font-semibold">
                  {o2oEvents.length} {isFr ? 'près de vous' : 'nearby'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isFr
                  ? '+50 FanScore par réservation RSVP et +100 PTS au check-in sur place.'
                  : 'Earn +50 FanScore per RSVP and +100 PTS when checking in at the venue.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          01 · NEARBY WATCH PARTIES & PICKUP GAMES (POSTGRESQL POSTGIS)
      ===================================================================== */}
      <section
        id="section-nearby-events"
        className="border-b border-[#162B1E] py-16 lg:py-20 px-6"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          {pureTacticalMode ? (
            <div className="rounded-2xl bg-[#08140C] border border-[#00F59B]/30 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/15 border border-[#00F59B]/40 text-[#00F59B] mx-auto flex items-center justify-center">
                <Crosshair className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {isFr
                  ? 'Réseau O2O & Soirées Match Masqués en Mode Pur Tactique'
                  : 'Hyper-Local O2O Discovery & Watch Parties Collapsed in Pure Tactical Mode'}
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {isFr
                  ? 'La découverte de lieux, les matchs de foot à 5/7 et les pubs partenaires sont masqués pour offrir une expérience 100% dédiée aux statistiques tactiques de match.'
                  : 'Nearby pub gatherings, certified watch parties, and pickup football discovery are collapsed so purist supporters experience a distraction-free statistical Match Center.'}
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
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr
                  ? '01 · SOIRÉES MATCH & FOOT À 5/7 À PROXIMITÉ (POSTGIS)'
                  : '01 · NEARBY WATCH PARTIES & PICKUP GAMES (POSTGIS)'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Vivez le match en vrai ou chaussez les crampons.'
                  : 'Watch the match together or step onto the turf.'}
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                {isFr
                  ? 'Filtrez par rayon spatial (1 mi, 5 mi, 10 mi, 25 mi) propulsé par PostgreSQL PostGIS et réservez votre place en 1 clic.'
                  : 'Filter by spatial radius (1 mi, 5 mi, 10 mi, 25 mi) powered by PostgreSQL PostGIS GiST indexing and lock your spot with 1-click RSVP.'}
              </p>
            </div>

            {/* Distance Radius Selector in Miles (1 mi, 5 mi, 10 mi, 25 mi) */}
            <div className="flex flex-wrap items-center gap-2 bg-[#08140C] border border-[#162B1E] rounded-lg p-2 self-start lg:self-end">
              <Navigation className="w-3.5 h-3.5 text-[#B8FF01] ml-1.5" />
              <span className="font-mono text-xs text-slate-400 mr-1">
                {isFr ? 'Rayon PostGIS :' : 'PostGIS Radius:'}
              </span>
              {[1, 5, 10, 25].map((mi) => (
                <button
                  key={mi}
                  type="button"
                  onClick={() => setSearchRadiusMiles(mi)}
                  className={`px-3 py-1 rounded-md font-mono text-xs transition-colors cursor-pointer tabular-nums ${
                    searchRadiusMiles === mi
                      ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {mi} mi
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowPostgisInspector(!showPostgisInspector)}
                className="px-2.5 py-1 rounded-md bg-[#050D08] border border-[#1F3B2A] font-mono text-[11px] text-cyan-400 hover:border-cyan-400/50 cursor-pointer"
              >
                {showPostgisInspector ? 'Hide SQL' : 'Inspect PostGIS SQL'}
              </button>
            </div>
          </div>

          {/* Interactive PostGIS Spatial Query Inspector */}
          {showPostgisInspector && (
            <div className="rounded-xl bg-[#08140C] border border-cyan-500/30 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                    {isFr
                      ? 'INSPECTEUR DE REQUÊTE SPATIALE POSTGRESQL POSTGIS (INDEX GIST)'
                      : 'POSTGIS SPATIAL QUERY INSPECTOR · GIST-INDEXED GEOGRAPHY'}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#B8FF01] tabular-nums">
                  $radius_meters = {radiusMeters}m ({searchRadiusMiles} mi) ·{' '}
                  {filteredEvents.length} {isFr ? 'résultats' : 'rows matched'}
                </span>
              </div>

              <pre className="p-3.5 rounded-lg bg-[#050D08] border border-[#162B1E] font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
{`-- PostGIS Spatial Index & Meter-Accurate Proximity Query (Scalable to 1,000,000+ Locations)
CREATE INDEX IF NOT EXISTS idx_o2o_venues_geom ON o2o_watch_parties USING GIST (geom);

WITH user_origin AS (
  SELECT ST_SetSRID(ST_MakePoint(-0.1062, 51.5642), 4326)::geography AS geog
)
SELECT 
  v.venue_id,
  v.venue_name,
  v.event_type, -- 'CERTIFIED_WATCH_PARTY' | 'PICKUP_5V5' | 'PICKUP_7V7'
  v.is_certified_host,
  ROUND((ST_Distance(v.geom::geography, u.geog) / 1609.34)::numeric, 2) AS distance_miles
FROM o2o_watch_parties v
CROSS JOIN user_origin u
WHERE ST_DWithin(v.geom::geography, u.geog, ${radiusMeters}) -- e.g. ${radiusMeters}m for ${searchRadiusMiles} miles
ORDER BY distance_miles ASC
LIMIT 25;`}
              </pre>
            </div>
          )}

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {(
              [
                {
                  id: 'all',
                  label: isFr ? 'Tous' : 'All',
                  count: o2oEvents.length,
                },
                {
                  id: 'watch-party',
                  label: isFr ? 'Soirées Match' : 'Watch Parties',
                  count: o2oEvents.filter((e) => e.type === 'watch-party')
                    .length,
                },
                {
                  id: 'pickup-game',
                  label: isFr ? 'Foot à 5 & 7' : 'Pickup Football',
                  count: o2oEvents.filter((e) => e.type === 'pickup-game')
                    .length,
                },
                {
                  id: 'supporters-pub',
                  label: isFr ? 'Pubs Supporters' : 'Supporters Pubs',
                  count: o2oEvents.filter((e) => e.type === 'supporters-pub')
                    .length,
                },
              ] as const
            ).map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                    active
                      ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01]'
                      : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#244430]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.2 rounded ${
                      active
                        ? 'bg-[#050D08]/15 text-[#050D08]'
                        : 'bg-[#0B1A11] text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clean Visual Event Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const meta = getCategoryMeta(ev.type);
              const IconComponent = meta.icon;
              const trFr = O2O_TRANSLATIONS_FR[ev.id];
              const displayTitle = isFr && trFr ? trFr.title : ev.title;
              const displayCity = isFr && trFr ? trFr.city : ev.city;
              const displayDateTime =
                isFr && trFr ? trFr.dateTime : ev.dateTime;
              const displayClub = isFr && trFr ? trFr.clubFocus : ev.clubFocus;
              const displayPerks = isFr && trFr ? trFr.perks : ev.perks;
              const capacityPct = Math.min(
                100,
                Math.round((ev.attendeesCount / ev.maxCapacity) * 100)
              );
              const isCheckedIn = checkedInIds.includes(ev.id);
              const evMiles =
                ev.distanceMiles ??
                Number((ev.distanceKm * 0.621371).toFixed(1));

              return (
                <div
                  key={ev.id}
                  className={`rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                    ev.isRSVPed
                      ? 'bg-[#0B1A11] border-[#B8FF01]/70'
                      : 'bg-[#08140C] border-[#162B1E] hover:border-[#244430]'
                  }`}
                >
                  <div>
                    {/* Visual Card Header Image */}
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={meta.image}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08140C] via-[#050D08]/30 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#050D08]/85 backdrop-blur-md border border-[#1F3B2A] font-mono text-[11px] text-[#B8FF01]">
                          <IconComponent className="w-3.5 h-3.5" />
                          <span>{meta.label}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-md bg-[#050D08]/85 backdrop-blur-md border border-[#162B1E] font-mono text-[11px] text-white tabular-nums">
                          {evMiles} mi ({ev.distanceKm} km)
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-200">{displayCity}</span>
                        <span className="px-2 py-0.5 rounded bg-[#B8FF01]/15 text-[#B8FF01] border border-[#B8FF01]/30">
                          {displayClub}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <h3 className="font-display text-lg font-bold text-white leading-snug">
                        {displayTitle}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#B8FF01] shrink-0" />
                          <span>{ev.venueName}</span>
                        </div>
                        <p className="text-slate-400 pl-5">{ev.address}</p>
                        <div className="flex items-center gap-2 text-slate-300 pt-1">
                          <Calendar className="w-3.5 h-3.5 text-[#B8FF01] shrink-0" />
                          <span>{displayDateTime}</span>
                        </div>
                      </div>

                      {/* Certified Host Badge */}
                      <div className="p-3 rounded-lg bg-[#050D08] border border-[#162B1E] flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#B8FF01] shrink-0" />
                          <div>
                            <span className="text-slate-400">
                              {isFr ? 'Hôte Certifié : ' : 'Certified Host: '}
                            </span>
                            <span className="font-semibold text-white">
                              {ev.hostName}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-[#B8FF01]">
                          {ev.hostFanScore.toLocaleString()} PTS
                        </span>
                      </div>

                      {/* Perks */}
                      <div className="space-y-1.5">
                        {displayPerks.map((perk, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-slate-300"
                          >
                            <Check className="w-3.5 h-3.5 text-[#B8FF01] shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Attendee Count + 1-Click RSVP */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#B8FF01]" />
                          <span>
                            {isFr ? 'Participants inscrits' : 'Attendees'}
                          </span>
                        </span>
                        <span className="font-mono font-semibold text-white">
                          {ev.attendeesCount}/{ev.maxCapacity} ({capacityPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#050D08] overflow-hidden border border-[#162B1E]">
                        <div
                          className="h-full bg-[#B8FF01] transition-all duration-500"
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => toggleO2ORSVP(ev.id)}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          ev.isRSVPed
                            ? 'bg-[#050D08] hover:bg-rose-950/40 text-[#B8FF01] hover:text-rose-300 border border-[#B8FF01]/50 hover:border-rose-500/40'
                            : 'bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08]'
                        }`}
                      >
                        {ev.isRSVPed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {isFr
                                ? 'Place réservée (Annuler)'
                                : 'RSVPed · Cancel'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>
                              {isFr
                                ? 'Réserver en 1 clic (RSVP +50 PTS)'
                                : '1-Click RSVP (+50 FanScore)'}
                            </span>
                          </>
                        )}
                      </button>

                      {ev.isRSVPed && (
                        <button
                          type="button"
                          disabled={isCheckedIn}
                          onClick={() => handleVenueCheckIn(ev)}
                          className={`w-full py-2 px-3 rounded-lg font-mono text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border ${
                            isCheckedIn
                              ? 'bg-[#050D08] border-[#1F3B2A] text-[#B8FF01] cursor-default'
                              : 'bg-[#08140C] hover:bg-[#050D08] border-[#1F3B2A] text-slate-200'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#B8FF01]" />
                          <span>
                            {isCheckedIn
                              ? isFr
                                ? '✓ Check-in validé (+100 PTS)'
                                : '✓ Checked In (+100 PTS)'
                              : isFr
                              ? 'Simuler le Check-in QR sur place (+100 PTS)'
                              : 'Simulate Venue QR Check-In (+100 PTS)'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
            </>
          )}
        </div>
      </section>

      {/* =====================================================================
          02 · BECOME A CERTIFIED HOST & TRANSPARENT GDPR GEOLOCATION OPT-IN
      ===================================================================== */}
      {!pureTacticalMode && (
        <section id="section-certified-host" className="py-16 lg:py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols): Editorial Context + GDPR Geolocation Opt-In Switch */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr
                ? '02 · DEVENIR UN HÔTE CERTIFIÉ'
                : '02 · BECOME A CERTIFIED HOST'}
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Organisez la prochaine soirée match ou session foot à 5.'
                : 'Host the next local watch party or pickup game.'}
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Les capitaines de Squad et gérants de pubs partenaires peuvent publier une soirée match ou un foot à 5/7 local. Vous recevez immédiatement le badge Hôte Certifié et +200 FanScore.'
                : 'Squad captains and partner pub hosts can list an official watch party or 5v5/7v7 pickup match. Publishing immediately awards the Certified Host badge and +200 FanScore.'}
            </p>

            {/* Transparent GDPR Geolocation Opt-In Switch Card */}
            <div className="rounded-xl bg-[#08140C] border border-[#162B1E] p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#0B1A11] border border-[#1F3B2A] text-[#B8FF01]">
                    {user.gdprGeoOptIn ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">
                      {isFr
                        ? 'Géolocalisation RGPD Transparente (Opt-In)'
                        : 'Transparent GDPR Geolocation Opt-In'}
                    </h3>
                    <span className="font-mono text-[11px] text-[#B8FF01]">
                      {user.gdprGeoOptIn
                        ? isFr
                          ? 'RADAR VILLE 5KM ACTIVÉ'
                          : 'COARSE 5KM CITY GRID ACTIVE'
                        : isFr
                        ? 'MODE PRIVÉ (VILLE UNIQUEMENT)'
                        : 'PRIVACY MODE (CITY ONLY)'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {isFr
                  ? 'Scorecer ne suit jamais vos déplacements en arrière-plan et ne revend aucune donnée GPS. L’activation utilise uniquement une grille locale de 5 km pour afficher les pubs et terrains proches.'
                  : 'Scorecer never tracks background GPS movement or sells location telemetry. Opting in uses an ephemeral 5km city grid strictly to surface nearby supporter pubs and pickup pitches.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  updateUserPreferences({ gdprGeoOptIn: !user.gdprGeoOptIn })
                }
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  user.gdprGeoOptIn
                    ? 'bg-[#0B1A11] hover:bg-[#12281B] text-white border-[#244430]'
                    : 'bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] border-[#B8FF01]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {user.gdprGeoOptIn
                    ? isFr
                      ? 'Désactiver la géolocalisation locale'
                      : 'Disable GDPR Coarse Location'
                    : isFr
                    ? 'Activer la géolocalisation RGPD (5 km)'
                    : 'Enable GDPR Coarse Location (5km)'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column (7 cols): Clean Inline Host Form */}
          <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#162B1E] pb-4">
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-5 h-5 text-[#B8FF01]" />
                <h3 className="font-display text-xl font-bold text-white">
                  {isFr
                    ? 'Créer une Soirée Match ou Session Foot à 5/7'
                    : 'Host a Local Watch Party or Pickup Game'}
                </h3>
              </div>

              <span className="font-mono text-xs px-3 py-1 rounded bg-[#B8FF01]/15 text-[#B8FF01] border border-[#B8FF01]/30">
                +200 FanScore
              </span>
            </div>

            <form onSubmit={handleHostSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-slate-300 mb-2">
                    {isFr
                      ? 'Nom du Pub ou du Terrain'
                      : 'Venue or Turf Pitch Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder={
                      isFr
                        ? 'ex. The Highbury Library Taproom'
                        : 'e.g. The Highbury Library Sports Taproom'
                    }
                    className="w-full bg-[#050D08] border border-[#1F3B2A] focus:border-[#B8FF01] rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-slate-300 mb-2">
                    {isFr ? 'Ville & Quartier' : 'City & Neighborhood'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder={
                      isFr ? 'ex. Paris · Bastille' : 'e.g. London · Highbury'
                    }
                    className="w-full bg-[#050D08] border border-[#1F3B2A] focus:border-[#B8FF01] rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-slate-300 mb-2">
                  {isFr
                    ? 'Club Mis à l’Honneur ou Format du Match'
                    : 'Club Focus or Pickup Format'}
                </label>
                <input
                  type="text"
                  required
                  value={clubFocus}
                  onChange={(e) => setClubFocus(e.target.value)}
                  placeholder={
                    isFr
                      ? 'ex. Arsenal / Ligue des Champions / Foot à 7'
                      : 'e.g. Arsenal / Champions League / 7v7 Floodlit Pickup'
                  }
                  className="w-full bg-[#050D08] border border-[#1F3B2A] focus:border-[#B8FF01] rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
                />
              </div>

              {justPublished && (
                <div className="p-3.5 rounded-lg bg-[#0B1A11] border border-[#B8FF01]/50 text-xs text-[#B8FF01] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isFr
                      ? 'Votre événement a été ajouté à la liste ci-dessus et +200 FanScore ont été crédités !'
                      : 'Your event is now live in the nearby list above and +200 FanScore has been credited!'}
                  </span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  {user.isCertifiedHost ? (
                    <span className="inline-flex items-center gap-1.5 text-[#B8FF01] font-medium">
                      <Award className="w-4 h-4" />
                      {isFr
                        ? 'Statut Hôte Certifié Actif'
                        : 'Certified Host Status Active'}
                    </span>
                  ) : (
                    <span>
                      {isFr
                        ? 'Publication instantanée · Badge Hôte Certifié inclus'
                        : 'Instant listing · Unlocks Certified Host badge'}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-[#B8FF01]/10"
                >
                  {isFr
                    ? 'Publier l’événement (+200 FanScore)'
                    : 'Publish Event & Claim +200 FanScore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
