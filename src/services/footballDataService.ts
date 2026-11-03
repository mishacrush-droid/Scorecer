import { LiveMatch, MatchEvent } from '../types/scorecer';

export interface LeagueFeedOption {
  slug: string;
  nameEn: string;
  nameFr: string;
  country: string;
}

export const SUPPORTED_LEAGUE_FEEDS: LeagueFeedOption[] = [
  {
    slug: 'uefa.champions',
    nameEn: 'UEFA Champions League',
    nameFr: 'Ligue des Champions UEFA',
    country: 'Europe',
  },
  {
    slug: 'eng.1',
    nameEn: 'Premier League',
    nameFr: 'Premier League (Angleterre)',
    country: 'England',
  },
  {
    slug: 'fra.1',
    nameEn: 'Ligue 1',
    nameFr: 'Ligue 1 McDonald’s (France)',
    country: 'France',
  },
  {
    slug: 'esp.1',
    nameEn: 'LaLiga',
    nameFr: 'LaLiga (Espagne)',
    country: 'Spain',
  },
  {
    slug: 'ita.1',
    nameEn: 'Serie A',
    nameFr: 'Serie A (Italie)',
    country: 'Italy',
  },
  {
    slug: 'ger.1',
    nameEn: 'Bundesliga',
    nameFr: 'Bundesliga (Allemagne)',
    country: 'Germany',
  },
];

export interface HistoricalMatchRecord {
  id: string;
  date: string;
  season: string;
  competition: string;
  country: string;
  stadium: string;
  attendance: string;
  homeTeam: string;
  homeShort: string;
  homeColor: string;
  awayTeam: string;
  awayShort: string;
  awayColor: string;
  homeScore: number;
  awayScore: number;
  homeXG: number;
  awayXG: number;
  homePossession: number;
  awayPossession: number;
  homeFormation: string;
  awayFormation: string;
  scorersSummaryEn: string;
  scorersSummaryFr: string;
  tacticalSummaryEn: string;
  tacticalSummaryFr: string;
  posterUrl: string;
  hoverVideoUrl: string;
  events: MatchEvent[];
}

export const HISTORICAL_MATCH_ARCHIVE: HistoricalMatchRecord[] = [
  {
    id: 'hist-psg-mci-2025',
    date: '2025-01-22',
    season: '2024/25',
    competition: 'UEFA Champions League · League Phase',
    country: 'France',
    stadium: 'Parc des Princes, Paris',
    attendance: '47,818',
    homeTeam: 'Paris Saint-Germain',
    homeShort: 'PSG',
    homeColor: '#004170',
    awayTeam: 'Manchester City',
    awayShort: 'MCI',
    awayColor: '#6CABDD',
    homeScore: 4,
    awayScore: 2,
    homeXG: 2.94,
    awayXG: 1.72,
    homePossession: 63,
    awayPossession: 37,
    homeFormation: '4-3-3 (False 9 Fluid)',
    awayFormation: '4-2-3-1',
    scorersSummaryEn:
      "Dembélé (56'), Barcola (60'), João Neves (78'), Gonçalo Ramos (90+3') — Grealish (50'), Haaland (53')",
    scorersSummaryFr:
      "Dembélé (56'), Barcola (60'), João Neves (78'), Gonçalo Ramos (90+3') — Grealish (50'), Haaland (53')",
    tacticalSummaryEn:
      'Down 0–2 at minute 53, Luis Enrique’s PSG unleashed a relentless counter-pressing wave (PPDA 5.8) and half-space rotations with Barcola and Dembélé to score 4 unanswered goals.',
    tacticalSummaryFr:
      'Mené 0–2 à la 53e minute, le PSG de Luis Enrique a renversé Manchester City grâce à un contre-pressing étouffant et aux appels croisés de Barcola, Dembélé et João Neves.',
    posterUrl: '/images/wet-turf.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4',
    events: [
      {
        id: 'h1-e1',
        minute: 90,
        second: 18,
        type: 'goal',
        team: 'home',
        title: "GOAL! Gonçalo Ramos (90+3' · 4-2 PSG)",
        detail: 'Clinical breakaway finish confirmed after VAR check • 0.54 xG.',
        xgAdded: 0.54,
      },
      {
        id: 'h1-e2',
        minute: 78,
        second: 11,
        type: 'goal',
        team: 'home',
        title: "GOAL! João Neves (78' · 3-2 PSG)",
        detail: 'Vitinha whipped free-kick headed home at the back post • 0.41 xG.',
        xgAdded: 0.41,
      },
      {
        id: 'h1-e3',
        minute: 60,
        second: 34,
        type: 'goal',
        team: 'home',
        title: "GOAL! Bradley Barcola (60' · 2-2 PSG)",
        detail: 'Rebound slotted low into the corner after Doué hit the crossbar • 0.62 xG.',
        xgAdded: 0.62,
      },
      {
        id: 'h1-e4',
        minute: 56,
        second: 9,
        type: 'goal',
        team: 'home',
        title: "GOAL! Ousmane Dembélé (56' · 1-2 PSG)",
        detail: 'Barcola burst down the left wing and pulled back for Dembélé • 0.58 xG.',
        xgAdded: 0.58,
      },
    ],
  },
  {
    id: 'hist-rma-bar-2024',
    date: '2024-10-26',
    season: '2024/25',
    competition: 'LaLiga · El Clásico',
    country: 'Spain',
    stadium: 'Santiago Bernabéu, Madrid',
    attendance: '78,192',
    homeTeam: 'Real Madrid',
    homeShort: 'RMA',
    homeColor: '#FEBE10',
    awayTeam: 'FC Barcelona',
    awayShort: 'BAR',
    awayColor: '#A50044',
    homeScore: 0,
    awayScore: 4,
    homeXG: 1.41,
    awayXG: 3.12,
    homePossession: 42,
    awayPossession: 58,
    homeFormation: '4-4-2 Diamond',
    awayFormation: '4-2-3-1 (Ultra-High Offside Line)',
    scorersSummaryEn:
      "Lewandowski (54', 56'), Lamine Yamal (77'), Raphinha (84')",
    scorersSummaryFr:
      "Lewandowski (54', 56'), Lamine Yamal (77'), Raphinha (84')",
    tacticalSummaryEn:
      'Hansi Flick’s ultra-high defensive line caught Real Madrid offside 12 times while Casadó, Pedri, and Raphinha exploited the space behind Madrid’s full-backs in the second half.',
    tacticalSummaryFr:
      'La ligne défensive très haute de Hansi Flick a piégé le Real Madrid 12 fois hors-jeu, tandis que Lewandowski, Yamal et Raphinha ont puni chaque transition en seconde période.',
    posterUrl: '/images/tactical-pitch.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-illuminated-soccer-stadium-at-night-41585-large.mp4',
    events: [
      {
        id: 'h2-e1',
        minute: 84,
        second: 22,
        type: 'goal',
        team: 'away',
        title: "GOAL! Raphinha (84' · 0-4 Barcelona)",
        detail: 'Iñigo Martínez long pass over the top; lob finish over Lunin • 0.52 xG.',
        xgAdded: 0.52,
      },
      {
        id: 'h2-e2',
        minute: 77,
        second: 40,
        type: 'goal',
        team: 'away',
        title: "GOAL! Lamine Yamal (77' · 0-3 Barcelona)",
        detail: 'Near-post right-footed rocket after Raphinha transition pass • 0.34 xG.',
        xgAdded: 0.34,
      },
      {
        id: 'h2-e3',
        minute: 56,
        second: 14,
        type: 'goal',
        team: 'away',
        title: "GOAL! Robert Lewandowski (56' · 0-2 Barcelona)",
        detail: 'Bullet header from Balde pinpoint left-wing cross • 0.46 xG.',
        xgAdded: 0.46,
      },
      {
        id: 'h2-e4',
        minute: 54,
        second: 5,
        type: 'goal',
        team: 'away',
        title: "GOAL! Robert Lewandowski (54' · 0-1 Barcelona)",
        detail: 'Casadó vertical line-breaking through-ball split the backline • 0.59 xG.',
        xgAdded: 0.59,
      },
    ],
  },
  {
    id: 'hist-ars-mci-2025',
    date: '2025-02-02',
    season: '2024/25',
    competition: 'Premier League · Matchday 24',
    country: 'England',
    stadium: 'Emirates Stadium, London',
    attendance: '60,355',
    homeTeam: 'Arsenal',
    homeShort: 'ARS',
    homeColor: '#EF0107',
    awayTeam: 'Manchester City',
    awayShort: 'MCI',
    awayColor: '#6CABDD',
    homeScore: 5,
    awayScore: 1,
    homeXG: 2.58,
    awayXG: 0.89,
    homePossession: 46,
    awayPossession: 54,
    homeFormation: '4-3-3 (High Press Traps)',
    awayFormation: '4-2-3-1',
    scorersSummaryEn:
      "Ødegaard (2'), Partey (56'), Lewis-Skelly (62'), Havertz (76'), Nwaneri (90+3') — Haaland (55')",
    scorersSummaryFr:
      "Ødegaard (2'), Partey (56'), Lewis-Skelly (62'), Havertz (76'), Nwaneri (90+3') — Haaland (55')",
    tacticalSummaryEn:
      'Arsenal’s aggressive Zone 14 pressing traps forced early build-up turnovers and punished Manchester City on rapid vertical transitions.',
    tacticalSummaryFr:
      'Le pressing haut d’Arsenal a provoqué des pertes de balle dès la relance et permis cinq buts spectaculaires devant l’Emirates Stadium.',
    posterUrl: '/images/highlight-goal.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-on-the-field-43479-large.mp4',
    events: [
      {
        id: 'h3-e1',
        minute: 90,
        second: 45,
        type: 'goal',
        team: 'home',
        title: "GOAL! Ethan Nwaneri (90+3' · 5-1 Arsenal)",
        detail: 'Curled left-footed strike from the right edge of the box • 0.14 xG.',
        xgAdded: 0.14,
      },
      {
        id: 'h3-e2',
        minute: 76,
        second: 19,
        type: 'goal',
        team: 'home',
        title: "GOAL! Kai Havertz (76' · 4-1 Arsenal)",
        detail: 'Fast breakaway assisted by Martinelli into the far corner • 0.49 xG.',
        xgAdded: 0.49,
      },
      {
        id: 'h3-e3',
        minute: 62,
        second: 8,
        type: 'goal',
        team: 'home',
        title: "GOAL! Myles Lewis-Skelly (62' · 3-1 Arsenal)",
        detail: 'Inverted left-back drove inside and finished high past Ortega • 0.28 xG.',
        xgAdded: 0.28,
      },
    ],
  },
  {
    id: 'hist-int-juv-2024',
    date: '2024-10-27',
    season: '2024/25',
    competition: 'Serie A · Derby d’Italia',
    country: 'Italy',
    stadium: 'San Siro, Milan',
    attendance: '75,056',
    homeTeam: 'Inter Milan',
    homeShort: 'INT',
    homeColor: '#0068A8',
    awayTeam: 'Juventus',
    awayShort: 'JUV',
    awayColor: '#FFFFFF',
    homeScore: 4,
    awayScore: 4,
    homeXG: 3.38,
    awayXG: 2.41,
    homePossession: 53,
    awayPossession: 47,
    homeFormation: '3-5-2',
    awayFormation: '4-2-3-1',
    scorersSummaryEn:
      "Zieliński (15', 37'), Mkhitaryan (35'), Dumfries (53') — Vlahović (20'), Weah (26'), Yıldız (71', 82')",
    scorersSummaryFr:
      "Zieliński (15', 37'), Mkhitaryan (35'), Dumfries (53') — Vlahović (20'), Weah (26'), Yıldız (71', 82')",
    tacticalSummaryEn:
      'An eight-goal San Siro thriller where Inter’s wing-back overloads met Kenan Yıldız’s late left-channel brace off the bench.',
    tacticalSummaryFr:
      'Un Derby d’Italie d’anthologie à huit buts où le doublé de Kenan Yıldız en fin de match a répondu aux assauts des pistons de l’Inter.',
    posterUrl: '/images/hero-goalnet.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-the-ball-in-the-stadium-43480-large.mp4',
    events: [
      {
        id: 'h4-e1',
        minute: 82,
        second: 12,
        type: 'goal',
        team: 'away',
        title: "GOAL! Kenan Yıldız (82' · 4-4 Juventus)",
        detail: 'Back-post control and low drive to level the Derby d’Italia • 0.36 xG.',
        xgAdded: 0.36,
      },
      {
        id: 'h4-e2',
        minute: 71,
        second: 5,
        type: 'goal',
        team: 'away',
        title: "GOAL! Kenan Yıldız (71' · 4-3 Juventus)",
        detail: 'Solo run down the left channel and angled low finish • 0.22 xG.',
        xgAdded: 0.22,
      },
    ],
  },
  {
    id: 'hist-liv-rma-2024',
    date: '2024-11-27',
    season: '2024/25',
    competition: 'UEFA Champions League · League Phase',
    country: 'England',
    stadium: 'Anfield, Liverpool',
    attendance: '59,546',
    homeTeam: 'Liverpool',
    homeShort: 'LIV',
    homeColor: '#C8102E',
    awayTeam: 'Real Madrid',
    awayShort: 'RMA',
    awayColor: '#00D4FF',
    homeScore: 2,
    awayScore: 0,
    homeXG: 2.71,
    awayXG: 1.18,
    homePossession: 63,
    awayPossession: 37,
    homeFormation: '4-3-3 (Slot Controlled Press)',
    awayFormation: '4-3-3',
    scorersSummaryEn: "Mac Allister (52'), Gakpo (76')",
    scorersSummaryFr: "Mac Allister (52'), Gakpo (76')",
    tacticalSummaryEn:
      'Arne Slot’s midfield triangle of Gravenberch, Jones, and Mac Allister dominated central progression while Kelleher saved Mbappé’s penalty.',
    tacticalSummaryFr:
      'Le milieu à trois d’Arne Slot (Gravenberch, Jones, Mac Allister) a étouffé le Real Madrid à Anfield.',
    posterUrl: '/images/highlight-save.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-catching-the-ball-in-the-goal-43481-large.mp4',
    events: [
      {
        id: 'h5-e1',
        minute: 76,
        second: 30,
        type: 'goal',
        team: 'home',
        title: "GOAL! Cody Gakpo (76' · 2-0 Liverpool)",
        detail: 'Towering header from Robertson corner delivery • 0.44 xG.',
        xgAdded: 0.44,
      },
      {
        id: 'h5-e2',
        minute: 52,
        second: 14,
        type: 'goal',
        team: 'home',
        title: "GOAL! Alexis Mac Allister (52' · 1-0 Liverpool)",
        detail: 'One-two wall pass with Conor Bradley at the edge of the box • 0.38 xG.',
        xgAdded: 0.38,
      },
    ],
  },
];

export function convertHistoricalToLiveMatch(
  record: HistoricalMatchRecord
): LiveMatch {
  const totalGoals = Math.max(1, record.homeScore + record.awayScore);
  const homeWinPct =
    record.homeScore > record.awayScore
      ? 88
      : record.homeScore === record.awayScore
      ? 25
      : 10;
  const drawPct = record.homeScore === record.awayScore ? 50 : 8;
  const awayWinPct = Math.max(4, 100 - homeWinPct - drawPct);

  return {
    id: record.id,
    competition: `${record.competition} (${record.date})`,
    country: record.country,
    stadium: record.stadium,
    homeTeam: record.homeTeam,
    homeShort: record.homeShort,
    homeColor: record.homeColor,
    awayTeam: record.awayTeam,
    awayShort: record.awayShort,
    awayColor: record.awayColor,
    homeScore: record.homeScore,
    awayScore: record.awayScore,
    minute: 90,
    second: 0,
    status: 'FT',
    latencyMs: 620,
    homeXG: record.homeXG,
    awayXG: record.awayXG,
    homeXA: Number((record.homeXG * 0.78).toFixed(2)),
    awayXA: Number((record.awayXG * 0.76).toFixed(2)),
    homePossession: record.homePossession,
    awayPossession: record.awayPossession,
    homePPDA: 7.8,
    awayPPDA: 10.4,
    homeFormation: record.homeFormation,
    awayFormation: record.awayFormation,
    winProbability: {
      home: homeWinPct,
      draw: drawPct,
      away: awayWinPct,
      aiReason: `${record.scorersSummaryEn} — ${record.tacticalSummaryEn} (${totalGoals} goals logged)`,
    },
    ppvPrice: '$1.49',
    ppvPointsCost: 400,
  };
}

// Fetch live or historical matches from ESPN public soccer API
export async function fetchRealFootballMatches(params: {
  leagueSlug: string;
  dateYMD?: string; // e.g. "2025-01-22" or undefined for today/latest
}): Promise<{
  source: 'espn-live-api' | 'historical-archive-fallback';
  matches: LiveMatch[];
  eventsByMatchId: Record<string, MatchEvent[]>;
}> {
  const leagueMeta =
    SUPPORTED_LEAGUE_FEEDS.find((l) => l.slug === params.leagueSlug) ||
    SUPPORTED_LEAGUE_FEEDS[0];

  try {
    const dateParam = params.dateYMD
      ? `?dates=${params.dateYMD.replace(/-/g, '')}`
      : '';
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${params.leagueSlug}/scoreboard${dateParam}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawEvents: any[] = data?.events || [];

      if (rawEvents.length > 0) {
        const parsedMatches: LiveMatch[] = [];
        const eventsMap: Record<string, MatchEvent[]> = {};

        rawEvents.slice(0, 8).forEach((ev, idx) => {
          const comp = ev?.competitions?.[0];
          const competitors: any[] = comp?.competitors || [];
          const home =
            competitors.find((c) => c.homeAway === 'home') || competitors[0];
          const away =
            competitors.find((c) => c.homeAway === 'away') || competitors[1];

          if (!home || !away) return;

          const homeScore = parseInt(home.score || '0', 10) || 0;
          const awayScore = parseInt(away.score || '0', 10) || 0;

          const stateStr = ev?.status?.type?.state || 'post';
          const status: 'LIVE' | 'HT' | 'FT' | 'UPCOMING' =
            stateStr === 'in'
              ? 'LIVE'
              : stateStr === 'pre'
              ? 'UPCOMING'
              : 'FT';

          const displayClock = ev?.status?.displayClock || "90'";
          const minuteMatch = parseInt(displayClock.replace(/[^0-9]/g, ''), 10);
          const minute = !isNaN(minuteMatch) && minuteMatch > 0 ? minuteMatch : status === 'UPCOMING' ? 0 : 90;

          // Parse possession or shots if available in statistics
          const getStat = (compObj: any, statName: string, fallback: number) => {
            const st = (compObj?.statistics || []).find(
              (s: any) => s.name === statName
            );
            const val = parseFloat(st?.displayValue);
            return !isNaN(val) ? val : fallback;
          };

          const homePoss = Math.round(getStat(home, 'possessionPct', 54));
          const awayPoss = Math.max(10, 100 - homePoss);
          const homeShots = getStat(home, 'shotsOnTarget', homeScore + 3);
          const awayShots = getStat(away, 'shotsOnTarget', awayScore + 2);

          const homeXG = Number(
            Math.max(0.25, homeScore * 0.68 + homeShots * 0.19).toFixed(2)
          );
          const awayXG = Number(
            Math.max(0.2, awayScore * 0.68 + awayShots * 0.19).toFixed(2)
          );

          const details: any[] = comp?.details || [];
          const matchId = `espn-${ev.id || idx}`;
          const parsedEvents: MatchEvent[] = details
            .slice(0, 6)
            .map((d: any, dIdx: number) => {
              const clk = parseInt(
                String(d?.clock?.displayValue || '45').replace(/[^0-9]/g, ''),
                10
              );
              const athlete =
                d?.athletesInvolved?.[0]?.displayName || 'Match Action';
              const isGoal = Boolean(d?.scoringPlay);
              const isRed = Boolean(d?.redCard);
              const isHomeEvent = d?.team?.id === home?.team?.id;
              return {
                id: `${matchId}-ev-${dIdx}`,
                minute: !isNaN(clk) ? clk : 45,
                second: 0,
                type: isGoal ? 'goal' : isRed ? 'card-red' : 'card-yellow',
                team: isHomeEvent ? 'home' : 'away',
                title: isGoal
                  ? `GOAL! ${athlete}`
                  : `${d?.type?.text || 'Match Event'} — ${athlete}`,
                detail: `${ev?.name || ''} • Live API Telemetry`,
                xgAdded: isGoal ? 0.45 : undefined,
              };
            });

          eventsMap[matchId] = parsedEvents;

          const homeName = home?.team?.shortDisplayName || home?.team?.displayName || 'Home';
          const awayName = away?.team?.shortDisplayName || away?.team?.displayName || 'Away';
          const homeAbbr = (home?.team?.abbreviation || homeName.slice(0, 3)).toUpperCase();
          const awayAbbr = (away?.team?.abbreviation || awayName.slice(0, 3)).toUpperCase();

          const homeWinProb =
            homeScore > awayScore ? 74 : homeScore < awayScore ? 16 : 38;
          const drawProb = homeScore === awayScore ? 34 : 14;
          const awayWinProb = Math.max(5, 100 - homeWinProb - drawProb);

          parsedMatches.push({
            id: matchId,
            competition: `${leagueMeta.nameEn} • ${
              ev?.date ? new Date(ev.date).toLocaleDateString() : 'Live Feed'
            }`,
            country: leagueMeta.country,
            stadium: comp?.venue?.fullName || `${homeName} Arena`,
            homeTeam: homeName,
            homeShort: homeAbbr,
            homeColor: `#${home?.team?.color || 'B8FF01'}`,
            awayTeam: awayName,
            awayShort: awayAbbr,
            awayColor: `#${away?.team?.color || '38BDF8'}`,
            homeScore,
            awayScore,
            minute,
            second: 0,
            status,
            latencyMs: 650,
            homeXG,
            awayXG,
            homeXA: Number((homeXG * 0.78).toFixed(2)),
            awayXA: Number((awayXG * 0.75).toFixed(2)),
            homePossession: homePoss,
            awayPossession: awayPoss,
            homePPDA: 8.1,
            awayPPDA: 9.7,
            homeFormation: home?.formation || '4-3-3',
            awayFormation: away?.formation || '4-2-3-1',
            winProbability: {
              home: homeWinProb,
              draw: drawProb,
              away: awayWinProb,
              aiReason: `Synced from ${leagueMeta.nameEn} real match data (${homeName} ${homeScore}–${awayScore} ${awayName}, Possession ${homePoss}%–${awayPoss}%).`,
            },
            ppvPrice: '$1.99',
            ppvPointsCost: 500,
          });
        });

        if (parsedMatches.length > 0) {
          return {
            source: 'espn-live-api',
            matches: parsedMatches,
            eventsByMatchId: eventsMap,
          };
        }
      }
    }
  } catch {
    // Fallback to curated historical archive below if offline or blocked by CORS/sandbox
  }

  const fallbackMatches = HISTORICAL_MATCH_ARCHIVE.map(convertHistoricalToLiveMatch);
  const fallbackEvents: Record<string, MatchEvent[]> = {};
  HISTORICAL_MATCH_ARCHIVE.forEach((rec) => {
    fallbackEvents[rec.id] = rec.events;
  });

  return {
    source: 'historical-archive-fallback',
    matches: fallbackMatches,
    eventsByMatchId: fallbackEvents,
  };
}

export interface ScoreBatVideoClip {
  id: string;
  title: string;
  competition: string;
  date: string;
  thumbnailUrl: string;
  hoverVideoUrl: string;
  embedHtml?: string;
  matchviewUrl?: string;
}

const FALLBACK_SCOREBAT_VIDEOS: ScoreBatVideoClip[] = [
  {
    id: 'sb-psg-mci',
    title: 'Paris Saint-Germain 4 - 2 Manchester City',
    competition: 'EUROPE: Champions League - League Stage',
    date: '2025-01-22',
    thumbnailUrl: '/images/wet-turf.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4',
  },
  {
    id: 'sb-rma-bar',
    title: 'Real Madrid 0 - 4 FC Barcelona (El Clásico)',
    competition: 'SPAIN: LaLiga - Round 11',
    date: '2024-10-26',
    thumbnailUrl: '/images/tactical-pitch.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-illuminated-soccer-stadium-at-night-41585-large.mp4',
  },
  {
    id: 'sb-ars-mci',
    title: 'Arsenal 5 - 1 Manchester City',
    competition: 'ENGLAND: Premier League - Round 24',
    date: '2025-02-02',
    thumbnailUrl: '/images/highlight-goal.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-on-the-field-43479-large.mp4',
  },
  {
    id: 'sb-int-juv',
    title: 'Inter Milan 4 - 4 Juventus (Derby d’Italia)',
    competition: 'ITALY: Serie A - Round 9',
    date: '2024-10-27',
    thumbnailUrl: '/images/hero-goalnet.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-the-ball-in-the-stadium-43480-large.mp4',
  },
  {
    id: 'sb-liv-rma',
    title: 'Liverpool 2 - 0 Real Madrid',
    competition: 'EUROPE: Champions League - League Stage',
    date: '2024-11-27',
    thumbnailUrl: '/images/highlight-save.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-catching-the-ball-in-the-goal-43481-large.mp4',
  },
  {
    id: 'sb-bay-b04',
    title: 'Bayer Leverkusen 3 - 2 Bayern Munich',
    competition: 'GERMANY: Bundesliga - Topspiel',
    date: '2025-02-15',
    thumbnailUrl: '/images/squads-pub.jpg',
    hoverVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-friends-watching-a-football-match-in-a-bar-42619-large.mp4',
  },
];

/**
 * Fetches free real-world football video highlights from the public ScoreBat Video API v3
 * (https://www.scorebat.com/video-api/v3/) with automatic fallback to curated match clips.
 */
export async function fetchScoreBatFreeHighlights(): Promise<{
  source: 'scorebat-live-api' | 'curated-video-archive';
  clips: ScoreBatVideoClip[];
}> {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://www.scorebat.com/video-api/v3/', {
      signal: controller.signal,
    });
    window.clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const rawList: any[] = data?.response || [];
      if (Array.isArray(rawList) && rawList.length > 0) {
        const hoverVideos = [
          'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-on-the-field-43479-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-football-players-running-on-the-field-43478-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-catching-the-ball-in-the-goal-43481-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-illuminated-soccer-stadium-at-night-41585-large.mp4',
        ];
        const clips: ScoreBatVideoClip[] = rawList.slice(0, 6).map((item, idx) => ({
          id: `sb-live-${idx}-${Date.now()}`,
          title: item?.title || 'Live Match Highlight',
          competition: item?.competition || 'European Football',
          date: item?.date
            ? new Date(item.date).toISOString().slice(0, 10)
            : 'Live',
          thumbnailUrl: item?.thumbnail || '/images/highlight-goal.jpg',
          hoverVideoUrl: hoverVideos[idx % hoverVideos.length],
          embedHtml: item?.videos?.[0]?.embed || item?.embed,
          matchviewUrl: item?.matchviewUrl,
        }));
        return {
          source: 'scorebat-live-api',
          clips,
        };
      }
    }
  } catch {
    // Fallback gracefully when offline or inside sandboxed preview
  }

  return {
    source: 'curated-video-archive',
    clips: FALLBACK_SCOREBAT_VIDEOS,
  };
}

