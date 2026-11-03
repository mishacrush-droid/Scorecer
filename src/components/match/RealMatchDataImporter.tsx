import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Database,
  Globe,
  History,
  RefreshCw,
  Play,
  Film,
  X,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import {
  SUPPORTED_LEAGUE_FEEDS,
  fetchScoreBatFreeHighlights,
  ScoreBatVideoClip,
} from '../../services/footballDataService';
import { HoverPlayVideo } from '../common/HoverPlayVideo';

export const RealMatchDataImporter: React.FC<{
  compact?: boolean;
}> = ({ compact = false }) => {
  const {
    uiLanguage,
    matches,
    selectedMatchId,
    setSelectedMatchId,
    setActiveTab,
    isSyncingMatches,
    lastSyncedSource,
    historicalArchive,
    syncRealMatchesFromAPI,
    importHistoricalMatch,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  const [mode, setMode] = useState<'historical' | 'live-api' | 'scorebat-video'>(
    'historical'
  );
  const [selectedLeague, setSelectedLeague] = useState<string>('uefa.champions');
  const [selectedDate, setSelectedDate] = useState<string>('2025-01-22');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ScoreBat Free Video Highlights state
  const [scoreBatClips, setScoreBatClips] = useState<ScoreBatVideoClip[]>([]);
  const [scoreBatSource, setScoreBatSource] = useState<string>('ScoreBat Free Video API');
  const [isLoadingClips, setIsLoadingClips] = useState<boolean>(false);
  const [activeStreamClip, setActiveStreamClip] = useState<{
    title: string;
    subtitle: string;
    videoUrl: string;
    posterUrl: string;
    embedHtml?: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoadingClips(true);
    fetchScoreBatFreeHighlights().then((res) => {
      if (!mounted) return;
      setScoreBatClips(res.clips);
      setScoreBatSource(
        res.source === 'scorebat-live-api'
          ? 'ScoreBat Live Video API v3 (Connected)'
          : 'ScoreBat Free Video Feed + Curated Match Clips'
      );
      setIsLoadingClips(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRefreshScoreBat = async () => {
    setIsLoadingClips(true);
    const res = await fetchScoreBatFreeHighlights();
    setScoreBatClips(res.clips);
    setScoreBatSource(
      res.source === 'scorebat-live-api'
        ? 'ScoreBat Live Video API v3 (Connected)'
        : 'ScoreBat Free Video Feed + Curated Match Clips'
    );
    setIsLoadingClips(false);
  };

  const filteredArchive = historicalArchive.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.homeTeam.toLowerCase().includes(q) ||
      rec.awayTeam.toLowerCase().includes(q) ||
      rec.competition.toLowerCase().includes(q) ||
      rec.stadium.toLowerCase().includes(q)
    );
  });

  const handleSyncLiveOrDate = async (useDate: boolean) => {
    const cleanDate = useDate ? selectedDate.replace(/-/g, '') : undefined;
    await syncRealMatchesFromAPI(selectedLeague, cleanDate);
  };

  return (
    <div className="rounded-2xl bg-[#08140C] border border-[#162B1E] p-6 sm:p-8 space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#162B1E] pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#B8FF01]">
            <Database className="w-3.5 h-3.5" />
            <span>
              {isFr
                ? 'MOTEUR DE DONNÉES & VIDÉOS RÉELLES · API ESPN & SCOREBAT'
                : 'REAL MATCH DATA & VIDEO STREAM ENGINE · ESPN + SCOREBAT API'}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isFr
              ? 'Importez des matchs réels et survolez pour lancer la vidéo.'
              : 'Import real football matches & hover any card to play video.'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {isFr
              ? 'Survolez n’importe quelle carte avec votre curseur pour démarrer automatiquement l’extrait vidéo du match, synchronisez les scores ESPN en direct ou regardez les résumés gratuits via ScoreBat.'
              : 'Move your cursor over any match card below to auto-play its video preview, sync real scoreboards via the public ESPN API, or stream free match clips via ScoreBat.'}
          </p>
        </div>

        {/* 3-Tab Mode Selector */}
        <div className="inline-flex flex-wrap rounded-xl bg-[#050D08] border border-[#1A3324] p-1 text-xs font-mono shrink-0 gap-1">
          <button
            onClick={() => setMode('historical')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'historical'
                ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>
              {isFr ? 'Classiques Réels (Vidéo)' : 'Historical Classics (Hover Video)'}
            </span>
          </button>
          <button
            onClick={() => setMode('scorebat-video')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'scorebat-video'
                ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>
              {isFr ? 'Clips Gratuits ScoreBat' : 'Free Video Clips (ScoreBat)'}
            </span>
          </button>
          <button
            onClick={() => setMode('live-api')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'live-api'
                ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>
              {isFr ? 'API ESPN en Direct' : 'Live & Date API Sync'}
            </span>
          </button>
        </div>
      </div>

      {/* Active Data Source Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-[#050D08] border border-[#162B1E] text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-[#B8FF01]" />
          <span>
            {isFr ? 'Flux actif :' : 'Active feed:'}{' '}
            <strong className="text-white">
              {mode === 'scorebat-video' ? scoreBatSource : lastSyncedSource}
            </strong>
          </span>
        </div>
        <span className="text-[#B8FF01]">
          {isFr
            ? '✨ Survolez une image pour lancer la vidéo automatiquement'
            : '✨ Hover cursor over any card image to auto-play video'}
        </span>
      </div>

      {/* =====================================================================
          MODE 1: CURATED REAL HISTORICAL ARCHIVE WITH HOVER-TO-PLAY VIDEOS
      ===================================================================== */}
      {mode === 'historical' && (
        <div className="space-y-4">
          {!compact && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? 'Filtrer par club, compétition ou stade (ex: PSG, Barcelona, Arsenal, San Siro)...'
                    : 'Filter by club, competition, or stadium (e.g., PSG, Barcelona, Arsenal, San Siro)...'
                }
                className="flex-1 bg-[#050D08] border border-[#1A3324] focus:border-[#B8FF01] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArchive.map((rec) => {
              const isLoaded = selectedMatchId === rec.id;
              return (
                <div
                  key={rec.id}
                  className={`rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                    isLoaded
                      ? 'bg-[#0B1C12] border-[#B8FF01] shadow-[0_0_25px_rgba(184,255,1,0.08)]'
                      : 'bg-[#050D08] border-[#162B1E] hover:border-[#254732]'
                  }`}
                >
                  <div>
                    {/* Visual Stadium Header with Automatic Hover-to-Play Video */}
                    <HoverPlayVideo
                      videoUrl={rec.hoverVideoUrl}
                      posterUrl={rec.posterUrl}
                      alt={`${rec.homeTeam} vs ${rec.awayTeam}`}
                      className="aspect-[16/9] w-full border-b border-[#162B1E]"
                      badgeText={rec.date}
                      scorelineText={`${rec.homeShort} ${rec.homeScore}–${rec.awayScore} ${rec.awayShort}`}
                      durationText={isFr ? 'SURVOLER = VIDÉO' : 'HOVER TO PLAY'}
                      onClick={() =>
                        setActiveStreamClip({
                          title: `${rec.homeTeam} ${rec.homeScore} – ${rec.awayScore} ${rec.awayTeam}`,
                          subtitle: `${rec.competition} · ${rec.stadium} (${rec.date})`,
                          videoUrl: rec.hoverVideoUrl,
                          posterUrl: rec.posterUrl,
                        })
                      }
                    >
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200 pointer-events-none">
                        <span className="truncate bg-[#050D08]/85 px-2 py-0.5 rounded border border-[#1E3B29]">
                          {rec.stadium}
                        </span>
                        <span className="bg-[#050D08]/85 px-2 py-0.5 rounded border border-[#B8FF01]/40 text-[#B8FF01] font-semibold">
                          {rec.homeXG.toFixed(2)} – {rec.awayXG.toFixed(2)} xG
                        </span>
                      </div>
                    </HoverPlayVideo>

                    {/* Match Details Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#B8FF01]">
                        <span className="truncate">{rec.competition}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-display font-bold text-base text-white">
                            {rec.homeTeam}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {rec.homeXG.toFixed(2)} xG · {rec.homePossession}%
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded-lg bg-[#08140C] border border-[#1E3B29] font-wide font-extrabold text-lg text-[#B8FF01]">
                          {rec.homeScore} — {rec.awayScore}
                        </div>

                        <div className="text-right">
                          <div className="font-display font-bold text-base text-white">
                            {rec.awayTeam}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {rec.awayXG.toFixed(2)} xG · {rec.awayPossession}%
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-2">
                        ⚽ {isFr ? rec.scorersSummaryFr : rec.scorersSummaryEn}
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {isFr ? rec.tacticalSummaryFr : rec.tacticalSummaryEn}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions: Watch Video Stream OR Load Into Match Center */}
                  <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActiveStreamClip({
                          title: `${rec.homeTeam} ${rec.homeScore} – ${rec.awayScore} ${rec.awayTeam}`,
                          subtitle: `${rec.competition} · ${rec.stadium} (${rec.date})`,
                          videoUrl: rec.hoverVideoUrl,
                          posterUrl: rec.posterUrl,
                        })
                      }
                      className="py-2 px-3 rounded-lg text-xs font-semibold bg-[#08140C] hover:bg-[#102618] text-[#B8FF01] border border-[#1F3B2A] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                      title={isFr ? 'Regarder le résumé vidéo' : 'Watch video clip'}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isFr ? 'Vidéo' : 'Watch Clip'}</span>
                    </button>

                    <button
                      onClick={() => {
                        importHistoricalMatch(rec.id);
                        if (!compact) {
                          setActiveTab('match-center');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isLoaded
                          ? 'bg-[#B8FF01] text-[#050D08]'
                          : 'bg-[#0B1B11] hover:bg-[#132A1C] text-white border border-[#1F3B2A]'
                      }`}
                    >
                      <span>
                        {isLoaded
                          ? isFr
                            ? 'Actif dans Match Center'
                            : 'Loaded in Match Center'
                          : isFr
                          ? 'Charger données & tactique'
                          : 'Load Match & Tactics'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 2: FREE VIDEO HIGHLIGHTS SERVICE (SCOREBAT API V3 + EMBEDS)
      ===================================================================== */}
      {mode === 'scorebat-video' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#050D08] border border-[#162B1E] rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#B8FF01] uppercase">
                {isFr
                  ? 'SERVICE VIDÉO GRATUIT · SCOREBAT VIDEO API V3'
                  : 'FREE REAL MATCH VIDEO SERVICE · SCOREBAT VIDEO API V3'}
              </div>
              <p className="text-xs text-slate-300">
                {isFr
                  ? 'Intégration directe et gratuite des résumés vidéo officiels via ScoreBat (sans droits TV coûteux). Survolez une carte pour prévisualiser ou cliquez pour ouvrir le lecteur.'
                  : 'Zero-cost integration with the public ScoreBat Football Video API for official match highlights and clips. Hover any card to auto-play or click to watch fullscreen.'}
              </p>
            </div>

            <button
              onClick={handleRefreshScoreBat}
              disabled={isLoadingClips}
              className="px-4 py-2 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoadingClips ? 'animate-spin' : ''}`}
              />
              <span>
                {isFr ? 'Actualiser le flux ScoreBat' : 'Refresh ScoreBat Feed'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scoreBatClips.map((clip) => (
              <div
                key={clip.id}
                className="rounded-xl overflow-hidden bg-[#050D08] border border-[#162B1E] hover:border-[#B8FF01]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <HoverPlayVideo
                    videoUrl={clip.hoverVideoUrl}
                    posterUrl={clip.thumbnailUrl}
                    alt={clip.title}
                    className="aspect-video w-full border-b border-[#162B1E]"
                    badgeText={clip.date}
                    durationText={isFr ? 'SURVOLER = VIDÉO' : 'HOVER TO PLAY'}
                    onClick={() =>
                      setActiveStreamClip({
                        title: clip.title,
                        subtitle: `${clip.competition} · ${clip.date}`,
                        videoUrl: clip.hoverVideoUrl,
                        posterUrl: clip.thumbnailUrl,
                        embedHtml: clip.embedHtml,
                      })
                    }
                  />
                  <div className="p-4 space-y-1.5">
                    <div className="text-[11px] font-mono text-[#B8FF01] uppercase truncate">
                      {clip.competition}
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      {clip.title}
                    </h4>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2">
                  <button
                    onClick={() =>
                      setActiveStreamClip({
                        title: clip.title,
                        subtitle: `${clip.competition} · ${clip.date}`,
                        videoUrl: clip.hoverVideoUrl,
                        posterUrl: clip.thumbnailUrl,
                        embedHtml: clip.embedHtml,
                      })
                    }
                    className="w-full py-2.5 px-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isFr
                        ? 'Regarder le résumé du match'
                        : 'Stream Match Highlights'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 3: LIVE & DATE-BASED PUBLIC ESPN SOCCER API SYNC
      ===================================================================== */}
      {mode === 'live-api' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* League Selector */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="block font-mono text-xs uppercase text-slate-400">
                {isFr ? 'Championnat / Compétition' : 'Select Competition Feed'}
              </label>
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full bg-[#050D08] border border-[#1A3324] focus:border-[#B8FF01] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none"
              >
                {SUPPORTED_LEAGUE_FEEDS.map((lg) => (
                  <option key={lg.slug} value={lg.slug}>
                    {isFr ? lg.nameFr : lg.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block font-mono text-xs uppercase text-slate-400">
                {isFr
                  ? 'Date spécifique (Historique / Calendrier)'
                  : 'Match Date (Historical / Schedule)'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#050D08] border border-[#1A3324] focus:border-[#B8FF01] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white outline-none font-mono"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={() => handleSyncLiveOrDate(false)}
                disabled={isSyncingMatches}
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] disabled:opacity-50 text-[#050D08] font-semibold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isSyncingMatches ? 'animate-spin' : ''}`}
                />
                <span>{isFr ? 'Direct / Aujourd’hui' : 'Sync Today'}</span>
              </button>
              <button
                onClick={() => handleSyncLiveOrDate(true)}
                disabled={isSyncingMatches}
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#050D08] hover:bg-[#0E2215] text-white border border-[#244430] text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isFr ? 'Par Date' : 'By Date'}</span>
              </button>
            </div>
          </div>

          {/* Currently Synced Matches Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {matches.slice(0, 4).map((m) => {
              const isSelected = m.id === selectedMatchId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMatchId(m.id);
                    if (!compact) {
                      setActiveTab('match-center');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1C12] border-[#B8FF01]'
                      : 'bg-[#050D08] border-[#162B1E] hover:border-[#254732]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                    <span className="truncate">{m.competition}</span>
                    <span className="text-[#B8FF01] font-semibold shrink-0 ml-1">
                      {m.status === 'FT' ? 'FT' : `${m.minute}'`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-display font-bold text-sm text-white">
                    <span className="truncate">{m.homeTeam}</span>
                    <span className="text-[#B8FF01] font-mono mx-2 shrink-0">
                      {m.homeScore} – {m.awayScore}
                    </span>
                    <span className="truncate text-right">{m.awayTeam}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EMBEDDED MATCH VIDEO STREAM / SCOREBAT HIGHLIGHT PLAYER
      ===================================================================== */}
      {activeStreamClip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActiveStreamClip(null)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-[#244430] bg-[#08140C] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#162B1E] bg-[#050D08] px-6 py-4">
              <div>
                <span className="text-xs font-mono text-[#B8FF01]">
                  {activeStreamClip.subtitle}
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  {activeStreamClip.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveStreamClip(null)}
                className="rounded-lg border border-[#1E3B29] bg-[#0B1910] p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {activeStreamClip.embedHtml ? (
                <div
                  className="w-full h-full [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full"
                  dangerouslySetInnerHTML={{ __html: activeStreamClip.embedHtml }}
                />
              ) : (
                <video
                  src={activeStreamClip.videoUrl}
                  poster={activeStreamClip.posterUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
