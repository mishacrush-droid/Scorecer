import React, { useState } from 'react';
import {
  Smartphone,
  Cpu,
  ShieldCheck,
  Zap,
  Maximize2,
  Code2,
  CheckCircle2,
  Layers,
  BellRing,
  Sparkles,
  Copy,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { MatchTelemetryStateSchema } from '../../stores/scorecerStores';

type IslandMode = 'compact' | 'minimal' | 'expanded' | 'lockscreen-standby';
type ApnsEventType = 'push-to-start' | 'push-to-update-goal' | 'push-to-update-bg' | 'end-dismissal';

export const NativeLockScreenSimulatorHUD: React.FC = () => {
  const {
    activeMatch,
    matchTelemetryState,
    simulateLiveGoalOrShift,
    triggerToast,
    setActiveTab,
  } = useScorecer();

  const [activeOsTab, setActiveOsTab] = useState<'ios18' | 'android16' | 'apns-inspector'>('ios18');
  const [islandMode, setIslandMode] = useState<IslandMode>('expanded');
  const [standbyScale2x, setStandbyScale2x] = useState(false);
  const [relevanceScore, setRelevanceScore] = useState<100 | 75>(100);
  const [apnsEventType, setApnsEventType] = useState<ApnsEventType>('push-to-update-goal');

  const schemaCheck = MatchTelemetryStateSchema.safeParse(matchTelemetryState);

  const apnsPriority =
    apnsEventType === 'push-to-update-bg' ? '5 (Throttled Background xG/Clock Sync)' : '10 (Immediate Wake — Goal/Red Card)';

  const apnsEventString =
    apnsEventType === 'push-to-start'
      ? 'start'
      : apnsEventType === 'end-dismissal'
      ? 'end'
      : 'update';

  const apnsPayloadJson = JSON.stringify(
    {
      headers: {
        'apns-push-type': 'liveactivity',
        'apns-topic': 'com.scorecer.app.push-type.liveactivity',
        'apns-priority': apnsEventType === 'push-to-update-bg' ? '5' : '10',
        authorization: 'bearer <ES256_P8_JWT_ROTATED_EVERY_45_MIN>',
      },
      payload: {
        aps: {
          timestamp: Math.floor(Date.now() / 1000),
          event: apnsEventString,
          'relevance-score': relevanceScore,
          'stale-date': Math.floor(Date.now() / 1000) + 900,
          ...(apnsEventType === 'end-dismissal'
            ? { 'dismissal-date': Math.floor(Date.now() / 1000) + 14400 }
            : {}),
          'content-state': {
            matchId: matchTelemetryState.matchId,
            matchMinute: matchTelemetryState.matchMinute,
            homeScore: matchTelemetryState.homeTeam.score,
            awayScore: matchTelemetryState.awayTeam.score,
            homeXg: matchTelemetryState.homeTeam.xg,
            awayXg: matchTelemetryState.awayTeam.xg,
            momentumDelta: Number((matchTelemetryState.homeTeam.winProbability - matchTelemetryState.awayTeam.winProbability).toFixed(2)),
            latestHeadline: matchTelemetryState.latestEvent.headline,
          },
          ...(apnsEventType === 'push-to-start' || apnsEventType === 'push-to-update-goal'
            ? {
                alert: {
                  title: `GOAL! ${activeMatch.homeTeam} ${activeMatch.homeScore} - ${activeMatch.awayScore} ${activeMatch.awayTeam}`,
                  body: `${matchTelemetryState.latestEvent.headline} (${matchTelemetryState.homeTeam.xg.toFixed(2)} xG vs ${matchTelemetryState.awayTeam.xg.toFixed(2)} xG)`,
                  sound: 'stadium_roar_short.caf',
                },
              }
            : {}),
        },
      },
    },
    null,
    2
  );

  const copyApnsPayload = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apnsPayloadJson);
    }
    triggerToast('Copied APNs HTTP/2 Live Activity camelCase JSON payload to clipboard!');
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#00D4FF]/25 bg-gradient-to-br from-[#0B0E14] via-[#121722] to-[#0B0E14]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 flex items-center gap-1.5">
              <Smartphone className="w-3 h-3" /> Native OS Lock-Screen & Dynamic Island HUD
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {schemaCheck.success
                ? 'ActivityKit camelCase JSONDecoder Verified'
                : 'Schema Mismatch'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
              NSSupportsLiveActivitiesFrequentUpdates: YES
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            Zero-Open Lock Screen Glances: iOS 18 ActivityKit & Android 16 Ongoing ProgressStyle
          </h3>
          <p className="text-xs text-slate-400">
            Sub-second scoreline, xG momentum bar, and instant deep-links rendered natively on #000000 OLED Dynamic Island & Android 16 Status Bar Chips.
          </p>
        </div>

        {/* OS / Inspector Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0E14] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveOsTab('ios18')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeOsTab === 'ios18'
                ? 'bg-[#00F59B] text-[#0B0E14] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iOS 18 Dynamic Island
          </button>
          <button
            onClick={() => setActiveOsTab('android16')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeOsTab === 'android16'
                ? 'bg-[#00D4FF] text-[#0B0E14] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Android 16 ProgressStyle
          </button>
          <button
            onClick={() => setActiveOsTab('apns-inspector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeOsTab === 'apns-inspector'
                ? 'bg-[#FFB800] text-[#0B0E14] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            APNs HTTP/2 Payload
          </button>
        </div>
      </div>

      {/* TAB 1: iOS 18 ActivityKit & Dynamic Island Simulator */}
      {activeOsTab === 'ios18' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-3.5 rounded-xl bg-[#0B0E14]/90 border border-white/10 space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                1. Select ActivityKit Presentation State
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'compact', label: 'Compact Pill', sub: 'Leading/Trailing Score' },
                    { id: 'minimal', label: 'Minimal Badge', sub: 'Multi-Match Arbitration' },
                    { id: 'expanded', label: 'Expanded (4-Region)', sub: 'Long-Press Tactical HUD' },
                    { id: 'lockscreen-standby', label: 'Lock Screen / StandBy', sub: 'Full Banner + 2x Night' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setIslandMode(m.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      islandMode === m.id
                        ? 'bg-[#00F59B]/15 border-[#00F59B]/50 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Relevance Score & StandBy 2x Controls */}
            <div className="p-3.5 rounded-xl bg-[#0B0E14]/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Multi-Match <code className="text-[#00D4FF] font-mono">relevance-score</code>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Controls which match wins primary Dynamic Island slot
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#121722] p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setRelevanceScore(100)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                      relevanceScore === 100
                        ? 'bg-[#00F59B] text-[#0B0E14]'
                        : 'text-slate-400'
                    }`}
                  >
                    100 (Primary Club)
                  </button>
                  <button
                    onClick={() => setRelevanceScore(75)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                      relevanceScore === 75
                        ? 'bg-[#FFB800] text-[#0B0E14]'
                        : 'text-slate-400'
                    }`}
                  >
                    75 (Pinned Neutral)
                  </button>
                </div>
              </div>

              {islandMode === 'lockscreen-standby' && (
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      iOS StandBy Night Mode (<code className="text-[#00F59B] font-mono">2x Scale</code>)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      MagSafe landscape dock high-contrast tabular display
                    </div>
                  </div>
                  <button
                    onClick={() => setStandbyScale2x(!standbyScale2x)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      standbyScale2x
                        ? 'bg-[#00F59B]/20 text-[#00F59B] border-[#00F59B]/40'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    {standbyScale2x ? '2x StandBy ON' : '1x Standard'}
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Test Instant APNs Priority 10 Push:
                </span>
                <button
                  onClick={() => simulateLiveGoalOrShift('goal')}
                  className="px-3 py-1.5 rounded-lg bg-[#00F59B]/15 hover:bg-[#00F59B]/25 text-[#00F59B] border border-[#00F59B]/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trigger Live Goal Push
                </button>
              </div>
            </div>
          </div>

          {/* Interactive iOS 18 Hardware Cutout Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#161F30] to-[#0B0E14] border border-white/10 relative overflow-hidden min-h-[290px]">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              iOS 18 True Black (#000000) OLED Hardware Cutout Render • 60fps Tabular-Nums
            </div>

            {/* COMPACT MODE */}
            {islandMode === 'compact' && (
              <div
                onClick={() => setIslandMode('expanded')}
                className="cursor-pointer bg-[#000000] border border-white/15 rounded-full px-5 py-2.5 flex items-center justify-between gap-8 shadow-[0_0_40px_rgba(0,0,0,0.9)] hover:border-[#00F59B]/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeMatch.homeColor }}
                  />
                  <span className="font-mono font-bold text-sm text-white tabular-nums">
                    {activeMatch.homeShort} {activeMatch.homeScore}
                  </span>
                </div>
                <div className="w-16 h-4 rounded-full bg-[#0B0E14] border border-white/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#1a1f2e]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white tabular-nums">
                    {activeMatch.awayScore} {activeMatch.awayShort}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#00F59B]/20 text-[#00F59B] font-mono font-bold text-[11px] tabular-nums">
                    {activeMatch.minute}&apos;
                  </span>
                </div>
              </div>
            )}

            {/* MINIMAL MODE */}
            {islandMode === 'minimal' && (
              <div className="flex items-center gap-4">
                <div
                  onClick={() => setIslandMode('expanded')}
                  className="cursor-pointer bg-[#000000] border border-[#00F59B]/40 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-2xl"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeMatch.homeColor }}
                  />
                  <span className="font-mono font-bold text-xs text-white tabular-nums">
                    {activeMatch.homeScore}–{activeMatch.awayScore}
                  </span>
                  <span className="text-[10px] font-mono text-[#00F59B] tabular-nums">
                    {activeMatch.minute}&apos;
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 bg-[#0B0E14]/90 px-3 py-1.5 rounded-xl border border-white/10">
                  relevance-score:{' '}
                  <span className="text-[#00F59B] font-bold">{relevanceScore}</span>{' '}
                  {relevanceScore === 100
                    ? '(Wins Primary Island Slot)'
                    : '(Detached Minimal Circular Badge)'}
                </div>
              </div>
            )}

            {/* EXPANDED 4-REGION MODE */}
            {islandMode === 'expanded' && (
              <div className="w-full max-w-md bg-[#000000] border border-white/15 rounded-[34px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-3.5">
                {/* Top Row: Leading, Center Camera Cutout, Trailing */}
                <div className="flex items-center justify-between">
                  {/* Leading Region */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-2xl flex items-center justify-center font-display font-extrabold text-xs text-white border border-white/20"
                      style={{ backgroundColor: activeMatch.homeColor }}
                    >
                      {activeMatch.homeShort}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{activeMatch.homeTeam}</div>
                      <div className="text-[10px] font-mono text-[#00F59B] tabular-nums">
                        xG {activeMatch.homeXG.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Center Score & Clock */}
                  <div className="text-center px-3">
                    <div className="font-mono font-extrabold text-2xl text-white tracking-tight tabular-nums">
                      {activeMatch.homeScore} : {activeMatch.awayScore}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00F59B]/15 text-[#00F59B] text-[10px] font-mono font-bold tabular-nums">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-ping" />
                      {activeMatch.minute}:{String(activeMatch.second).padStart(2, '0')}&apos;
                    </div>
                  </div>

                  {/* Trailing Region */}
                  <div className="flex items-center gap-2.5 text-right">
                    <div>
                      <div className="text-xs font-bold text-white">{activeMatch.awayTeam}</div>
                      <div className="text-[10px] font-mono text-[#00D4FF] tabular-nums">
                        xG {activeMatch.awayXG.toFixed(2)}
                      </div>
                    </div>
                    <div
                      className="w-9 h-9 rounded-2xl flex items-center justify-center font-display font-extrabold text-xs text-white border border-white/20"
                      style={{ backgroundColor: activeMatch.awayColor }}
                    >
                      {activeMatch.awayShort}
                    </div>
                  </div>
                </div>

                {/* Center Region: Momentum & Win Probability Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                    <span>Momentum: {activeMatch.homeShort} {activeMatch.fieldTiltHome ?? 64}%</span>
                    <span>relevance-score: {relevanceScore}</span>
                    <span>{activeMatch.awayShort} {100 - (activeMatch.fieldTiltHome ?? 64)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
                    <div
                      className="bg-[#00F59B] transition-all duration-500"
                      style={{ width: `${activeMatch.fieldTiltHome ?? 64}%` }}
                    />
                    <div
                      className="bg-[#00D4FF] transition-all duration-500"
                      style={{ width: `${100 - (activeMatch.fieldTiltHome ?? 64)}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Region: Latest Event & Deep-Link Actions */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-300 truncate font-medium">
                    ⚡ {matchTelemetryState.lastEventBanner}
                  </div>
                  <button
                    onClick={() => setActiveTab('ai-hub')}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    Watch 9:16 Clip
                  </button>
                </div>
              </div>
            )}

            {/* LOCK SCREEN & STANDBY (2X) MODE */}
            {islandMode === 'lockscreen-standby' && (
              <div
                className={`w-full max-w-lg bg-[#000000]/95 border border-white/20 rounded-3xl p-5 shadow-2xl transition-transform duration-300 ${
                  standbyScale2x ? 'scale-105 border-[#00F59B]/50' : ''
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-[#00F59B] font-bold">
                    <Maximize2 className="w-3 h-3" />
                    {standbyScale2x
                      ? 'iOS 18 StandBy Night Mode (2x High-Contrast WidgetFamily)'
                      : 'iOS 18 Lock Screen Live Activity Banner'}
                  </span>
                  <span className="tabular-nums">
                    APNs Latency: {(activeMatch.latencyMs / 1000).toFixed(2)}s
                  </span>
                </div>

                <div className="flex items-center justify-between my-3">
                  <div>
                    <div className="text-sm font-bold text-white">{activeMatch.homeTeam}</div>
                    <div className="text-xs font-mono text-[#00F59B] tabular-nums">
                      {activeMatch.homeXG.toFixed(2)} xG • PPDA {activeMatch.homePPDA}
                    </div>
                  </div>
                  <div
                    className={`font-mono font-extrabold text-white tabular-nums ${
                      standbyScale2x ? 'text-4xl text-[#00F59B]' : 'text-3xl'
                    }`}
                  >
                    {activeMatch.homeScore} – {activeMatch.awayScore}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{activeMatch.awayTeam}</div>
                    <div className="text-xs font-mono text-[#00D4FF] tabular-nums">
                      {activeMatch.awayXG.toFixed(2)} xG • PPDA {activeMatch.awayPPDA}
                    </div>
                  </div>
                </div>

                {matchTelemetryState.isProvisional && (
                  <div className="mt-2 px-2.5 py-1 rounded-lg bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] text-[10px] font-mono flex items-center justify-between">
                    <span>⚠️ PROVISIONAL ATTRIBUTION — PENDING OPTA VERIFICATION</span>
                    <span>Lane 1 (&lt;200ms)</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 text-[11px] text-slate-400 text-center">
              Tip: Click the Compact or Minimal pill to simulate an iOS 18 long-press expansion.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Android 16 ProgressStyle Ongoing Notification */}
      {activeOsTab === 'android16' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-[#0B0E14]/90 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#00D4FF] font-mono text-xs font-bold">
                <BellRing className="w-4 h-4" />
                Android 16 Notification.ProgressStyle Spec
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Android 16 introduces rich ongoing progress notifications with promoted status-bar chips (`setShortCriticalText`) and segmented match timeline milestones (`Notification.ProgressStyle.Segment`).
              </p>
              <ul className="text-[11px] text-slate-400 space-y-1.5 font-mono pt-2">
                <li>• Builder.setOngoing(true) — Sticky lock-screen & shade surface</li>
                <li>• setShortCriticalText(&quot;{activeMatch.homeShort} {activeMatch.homeScore}-{activeMatch.awayScore} • {activeMatch.minute}&apos;&quot;)</li>
                <li>• Segmented 90-min bar: 1st Half, HT, 2nd Half + Goal/Card Points</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0B0E14] border border-white/10 space-y-4">
            {/* Android 16 Status Bar Promoted Chip */}
            <div className="w-full max-w-md flex items-center justify-between px-4 py-1.5 rounded-full bg-[#121722] border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00F59B] text-[#0B0E14] font-bold tabular-nums">
                  {activeMatch.homeShort} {activeMatch.homeScore}–{activeMatch.awayScore}{' '}
                  {activeMatch.awayShort} • {activeMatch.minute}&apos;
                </span>
                <span className="text-[10px] text-slate-400">Status Bar Chip</span>
              </div>
              <span className="text-[10px] text-slate-400 tabular-nums">5G • 100%</span>
            </div>

            {/* Android 16 Expanded Ongoing Notification Card */}
            <div className="w-full max-w-md rounded-3xl bg-[#181E2C] border border-white/15 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center text-[10px] font-bold">
                    S
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Scorecer Live • {activeMatch.competition}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D4FF]/15 text-[#00D4FF]">
                  setOngoing(true)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-white">
                    {activeMatch.homeTeam} vs {activeMatch.awayTeam}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {matchTelemetryState.lastEventBanner}
                  </div>
                </div>
                <div className="font-mono font-extrabold text-2xl text-[#00F59B] tabular-nums">
                  {activeMatch.homeScore} - {activeMatch.awayScore}
                </div>
              </div>

              {/* Segmented ProgressStyle Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                  <span>0&apos; KO</span>
                  <span>45&apos; HT</span>
                  <span className="text-[#00F59B] font-bold">{activeMatch.minute}&apos; LIVE</span>
                  <span>90&apos; FT</span>
                </div>
                <div className="relative h-3 rounded-full bg-black/50 p-0.5 flex items-center gap-1">
                  {/* 1st Half Segment */}
                  <div className="h-full w-1/2 rounded-l-full bg-[#00F59B]/70 relative">
                    <span
                      title="14' Goal"
                      className="absolute left-[31%] -top-1 w-2.5 h-4 rounded-sm bg-[#00F59B] border border-black"
                    />
                    <span
                      title="38' Goal"
                      className="absolute left-[84%] -top-1 w-2.5 h-4 rounded-sm bg-[#00D4FF] border border-black"
                    />
                  </div>
                  {/* 2nd Half Segment */}
                  <div className="h-full w-1/2 rounded-r-full bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full bg-[#00F59B]"
                      style={{
                        width: `${Math.min(100, Math.max(5, ((activeMatch.minute - 45) / 45) * 100))}%`,
                      }}
                    />
                    <span
                      title="74' Goal"
                      className="absolute left-[64%] -top-1 w-2.5 h-4 rounded-sm bg-[#00F59B] border border-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APNs HTTP/2 Push-to-Start & Push-to-Update Payload Inspector */}
      {activeOsTab === 'apns-inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-[#0B0E14]/90 border border-white/10 space-y-3">
              <div className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                APNs HTTP/2 Push Lifecycle & Priority Budget
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(
                  [
                    {
                      id: 'push-to-start',
                      title: '1. pushToStartTokenUpdates (Remote Start 15m Before KO)',
                      desc: 'Spawns ActivityKit remote start token via APNs 15 minutes before kickoff without requiring user to open the app',
                    },
                    {
                      id: 'push-to-update-goal',
                      title: '2. pushTokenUpdates (Priority 10 — Goals & Red Cards)',
                      desc: 'Immediate wake delivery (<700ms) utilizing NSSupportsLiveActivitiesFrequentUpdates bypass budget',
                    },
                    {
                      id: 'push-to-update-bg',
                      title: '3. pushTokenUpdates (Priority 5 — Background xG Sync)',
                      desc: 'Routine spatial xG and clock updates with zero Apple system throttling or rate-limit penalties',
                    },
                    {
                      id: 'end-dismissal',
                      title: '4. End Activity & Dismissal Date Policy (+4h FT)',
                      desc: 'Persists final Opta full-time scoreline on Lock Screen for 4 hours post-match then gracefully auto-dismisses',
                    },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setApnsEventType(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      apnsEventType === item.id
                        ? 'bg-[#FFB800]/15 border-[#FFB800]/50 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-[#121722] border border-white/10 text-[11px] font-mono space-y-1 text-slate-300">
                <div className="text-[#00D4FF] font-bold">HTTP/2 Request Headers:</div>
                <div>apns-push-type: liveactivity</div>
                <div>apns-priority: {apnsEventType === 'push-to-update-bg' ? '5' : '10'}</div>
                <div>apns-topic: com.scorecer.app.push-type.liveactivity</div>
                <div>authorization: bearer &lt;ES256_P8_JWT_ROTATED_EVERY_45_MIN&gt;</div>
                <div className="text-[10px] text-[#00F59B] pt-1 border-t border-white/10">
                  ES256 .p8 JWT rotated every 45 min (Apple 60m token expiration guard)
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl bg-[#07090E] border border-white/15 p-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                  <span className="text-xs font-mono font-bold text-white">
                    Strict camelCase ActivityKit ContentState Payload
                  </span>
                </div>
                <button
                  onClick={copyApnsPayload}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-white/10"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy JSON
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[#00F59B] overflow-x-auto leading-relaxed max-h-[260px]">
                {apnsPayloadJson}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
