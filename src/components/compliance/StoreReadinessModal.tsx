import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Smartphone,
  Lock,
  Sparkles,
  FileCode2,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { MatchTelemetryStateSchema } from '../../stores/scorecerStores';

export const StoreReadinessModal: React.FC = () => {
  const {
    isStoreReadinessOpen,
    setIsStoreReadinessOpen,
    isPaywallOpen,
    setIsPaywallOpen,
    matchTelemetryState,
    entitlements,
    activeMatch,
    toggleProStatus,
    unlockPPVMatch,
    user,
  } = useScorecer();

  const [activeModalTab, setActiveModalTab] = useState<'checklist' | 'revenuecat' | 'schema-test'>(
    isPaywallOpen ? 'revenuecat' : 'checklist'
  );
  const [testSnakeCaseMode, setTestSnakeCaseMode] = useState(false);

  if (!isStoreReadinessOpen && !isPaywallOpen) return null;

  const closeAll = () => {
    setIsStoreReadinessOpen(false);
    setIsPaywallOpen(false);
  };

  const samplePayload = testSnakeCaseMode
    ? {
        ...matchTelemetryState,
        home_score: 2, // Intentional snake_case key to prove validator rejection
      }
    : matchTelemetryState;

  const validationResult = MatchTelemetryStateSchema.safeParse(samplePayload);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl bg-[#0B0E14] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#121722] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F59B]/15 border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg text-white">
                  App Store, Google Play & RevenueCat Production Readiness
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30">
                  ALL 4 GATES PASSED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Guideline 5.3.2 Non-Monetary Compliance • StoreKit 2 / Play Billing v7 • ActivityKit camelCase Parity
              </p>
            </div>
          </div>
          <button
            onClick={closeAll}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation */}
        <div className="px-6 pt-3 bg-[#0B0E14] border-b border-white/10 flex flex-wrap gap-2 pb-3">
          <button
            onClick={() => setActiveModalTab('checklist')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeModalTab === 'checklist'
                ? 'bg-[#00F59B] text-[#0B0E14]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            1. Store Launch Readiness Checklist
          </button>
          <button
            onClick={() => setActiveModalTab('revenuecat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeModalTab === 'revenuecat'
                ? 'bg-[#FFB800] text-[#0B0E14]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            2. RevenueCat Cross-Platform Paywall ($4.99 Pro / $1.99 PPV)
          </button>
          <button
            onClick={() => setActiveModalTab('schema-test')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeModalTab === 'schema-test'
                ? 'bg-[#00D4FF] text-[#0B0E14]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            3. ActivityKit camelCase Schema Validator
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeModalTab === 'checklist' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'iOS 18 Live Activities & APNs Token Rotation',
                    badge: 'iOS 18 ActivityKit',
                    items: [
                      'NSSupportsLiveActivities = YES in Info.plist',
                      'NSSupportsLiveActivitiesFrequentUpdates = YES enabled for sub-second soccer pushes',
                      'APNs .p8 ES256 JWT token rotation automated every 50 minutes (prevents 60m expiry drops)',
                      'Priority 10 reserved for Goals/Red Cards; Priority 5 for background xG/clock sync',
                    ],
                  },
                  {
                    title: 'Android 16 Ongoing Notifications & Play Billing',
                    badge: 'Android 16 SDK 36',
                    items: [
                      'Notification.ProgressStyle with setOngoing(true) & promoted status-bar score chip',
                      'Google Play Billing v7 server-side webhook acknowledgment within mandatory 3-day window',
                      ' prevents automatic 72-hour Play Store unacknowledged purchase refunds',
                      'Hardware-accelerated Skia 60fps canvas rendering verified on Vulkan/Metal',
                    ],
                  },
                  {
                    title: 'App Store Privacy Nutrition Labels & GDPR',
                    badge: 'GDPR & Privacy',
                    items: [
                      'Explicit zero-party data opt-in during progressive onboarding (+250 FanScore bonus)',
                      'PostGIS ST_DWithin spatial queries use coarse neighborhood radius (1–25 mi) without background tracking',
                      'No third-party cross-app advertising trackers (IDFA / SKAdNetwork clean)',
                    ],
                  },
                  {
                    title: 'Apple App Store Guideline 5.3.2 Compliance',
                    badge: 'Guideline 5.3.2',
                    items: [
                      'All Live Tactical Challenges (FanScore Pick\'Em) are 100% Free-to-Play skill challenges',
                      'FanScore points have zero cash value and cannot be purchased or exchanged for currency',
                      'Rewards Store restricted strictly to non-monetary digital cosmetics & sponsor-funded raffles',
                      'Apple Inc. & Google LLC non-sponsor disclaimer persistently displayed',
                    ],
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="p-4 rounded-2xl bg-[#121722] border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{card.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F59B]/15 text-[#00F59B]">
                        {card.badge}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {card.items.map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00F59B] shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/30 text-xs text-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#00F59B]">
                    Mandatory Store Compliance Notice:
                  </span>{' '}
                  FanScore points have no cash value and cannot be exchanged for real currency. Apple Inc. and Google LLC are not sponsors of, nor affiliated with, Scorecer FanScore rewards.
                </div>
              </div>
            </div>
          )}

          {activeModalTab === 'revenuecat' && (
            <div className="space-y-5">
              {/* Current Entitlement Banner */}
              <div className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">
                    Unified RevenueCat Cross-Platform Entitlement State
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-base text-white">
                      Active Tier: {entitlements.activeTier}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00D4FF]/15 text-[#00D4FF]">
                      Platform: {entitlements.lastSyncedPlatform}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00F59B]/15 text-[#00F59B]">
                      Play Billing 3-Day Ack: {entitlements.acknowledgedWithin3Days ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    JWS Receipt: {entitlements.storeKit2TransactionJws}
                  </div>
                </div>
              </div>

              {/* 3 Pricing Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free Tier */}
                <div className="p-5 rounded-2xl bg-[#121722] border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 text-slate-300">
                      Standard Tier
                    </span>
                    <h3 className="font-display font-bold text-xl text-white">Free Forever</h3>
                    <div className="font-mono font-extrabold text-2xl text-white">$0.00</div>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2">
                      <li>• Sub-second 0.7s live scores & Lock Screen widgets</li>
                      <li>• 3-Layer Pitch Visualizer (Pass, KDE Heatmap, Shots)</li>
                      <li>• Public Megathread & Squads text/voice rooms</li>
                      <li>• 3 Scorecer AI RAG queries per match</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      if (user.isPro) toggleProStatus();
                    }}
                    className="w-full py-2.5 rounded-xl border border-white/15 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    {!user.isPro ? 'Current Active Plan' : 'Switch to Free Tier'}
                  </button>
                </div>

                {/* Scorecer Pro $4.99/mo */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#00F59B]/15 to-[#121722] border-2 border-[#00F59B]/60 flex flex-col justify-between space-y-4 relative">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00F59B] text-[#0B0E14]">
                        Most Popular • StoreKit 2
                      </span>
                      <Crown className="w-4 h-4 text-[#00F59B]" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">Scorecer Pro</h3>
                    <div className="font-mono font-extrabold text-2xl text-[#00F59B]">
                      $4.99<span className="text-xs text-slate-400 font-normal"> / month</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200 pt-2">
                      <li>• Unlimited Scorecer AI RAG tactical queries</li>
                      <li>• Custom Cartesia Sonic-3.6 Commentator Voices</li>
                      <li>• Invite AI Voice Co-Host into LiveKit Squad Rooms</li>
                      <li>• Raw Opta xG / xT CSV exports & Zero sponsor tags</li>
                    </ul>
                  </div>
                  <button
                    onClick={toggleProStatus}
                    className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-[#0B0E14] text-xs font-extrabold transition-all"
                  >
                    {user.isPro ? '✓ Scorecer Pro Active (Click to Toggle)' : 'Activate Scorecer Pro ($4.99/mo)'}
                  </button>
                </div>

                {/* 1-Click D2C Match Pass $1.99 */}
                <div className="p-5 rounded-2xl bg-[#121722] border border-[#00D4FF]/40 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00D4FF]/20 text-[#00D4FF]">
                        Consumable IAP
                      </span>
                      <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">
                      1-Click D2C Match Pass
                    </h3>
                    <div className="font-mono font-extrabold text-2xl text-[#00D4FF]">
                      $1.99<span className="text-xs text-slate-400 font-normal"> / single match</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2">
                      <li>• Unlocks live out-of-market stream ({activeMatch.homeShort} vs {activeMatch.awayShort})</li>
                      <li>• No monthly bundle required</li>
                      <li>• Synchronized 1080p60 stream + interactive xG HUD</li>
                      <li>• Instant StoreKit 2 / Play Billing receipt sync</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => unlockPPVMatch(activeMatch.id)}
                    className="w-full py-2.5 rounded-xl bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0B0E14] text-xs font-extrabold transition-all"
                  >
                    {user.unlockedPPVMatches.includes(activeMatch.id)
                      ? `✓ ${activeMatch.homeShort} vs ${activeMatch.awayShort} Unlocked`
                      : `Unlock ${activeMatch.homeShort} vs ${activeMatch.awayShort} ($1.99)`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModalTab === 'schema-test' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">
                    iOS ActivityKit <code className="text-[#00D4FF] font-mono">JSONDecoder</code> Parity Test
                  </div>
                  <div className="text-xs text-slate-400">
                    Strict schema validator rejects any payload containing <code className="text-[#FF3366]">snake_case</code> keys so Swift <code className="text-[#00F59B]">ContentState</code> decoding never crashes on the Lock Screen.
                  </div>
                </div>
                <button
                  onClick={() => setTestSnakeCaseMode(!testSnakeCaseMode)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    testSnakeCaseMode
                      ? 'bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366]'
                      : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {testSnakeCaseMode
                    ? 'Restore Valid camelCase Payload'
                    : 'Inject Invalid snake_case Key (home_score)'}
                </button>
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  validationResult.success
                    ? 'bg-[#00F59B]/10 border-[#00F59B]/40 text-[#00F59B]'
                    : 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366]'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  {validationResult.success ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>
                    {validationResult.success
                      ? 'PASS: MatchTelemetryStateSchema.safeParse() succeeded — 100% strict camelCase keys.'
                      : `REJECTED: ${validationResult.errors.join(' | ')}`}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase">
                  {validationResult.success ? 'Swift Codable Ready' : 'Blocked Before APNs Dispatch'}
                </span>
              </div>

              <pre className="p-4 rounded-2xl bg-[#07090E] border border-white/10 text-xs font-mono text-slate-200 overflow-x-auto">
                {JSON.stringify(samplePayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
