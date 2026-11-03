import React from 'react';
import { Shield, Share2, Download, Cloud } from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { ActiveTab } from '../../types/scorecer';
import { ScorecerLogo } from '../common/ScorecerLogo';
import { SpoilerDelayOption } from '../../services/pwaSpoilerShieldService';

export const TopNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    uiLanguage,
    setUiLanguage,
    user,
    openAuthModal,
    cloudTelemetry,
    spoilerDelaySeconds,
    setSpoilerDelaySeconds,
    bufferedAlerts,
    installPwaApp,
    shareCurrentDeepLink,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'vision', label: isFr ? 'Produit' : 'Product' },
    { id: 'ai-hub', label: isFr ? 'Studio IA' : 'AI Studio' },
    { id: 'match-center', label: isFr ? 'Matchs en direct' : 'Live Matches' },
    { id: 'social-squads', label: 'Squads' },
    { id: 'o2o-local', label: isFr ? 'Soirées Match' : 'Watch Parties' },
    { id: 'discover', label: isFr ? 'Découvrir' : 'Discover' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050D08]/95 backdrop-blur-md border-b border-[#162B1E]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Sc⚽recer Brand Logo */}
        <button
          onClick={() => {
            setActiveTab('vision');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <ScorecerLogo size="md" />
        </button>

        {/* Center: Clean Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm font-medium transition-colors cursor-pointer relative py-1 ${
                  isActive ? 'text-white' : 'text-slate-300/80 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8FF01] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Spoiler Shield, Share Link, EN / FR Language Switcher, Sign In & Get Started */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Spoiler-Shield Stream Delay Selector */}
          <div
            className="hidden xl:inline-flex items-center gap-1.5 rounded-md bg-[#0B1A11] border border-[#1A3324] px-2 py-1 text-[11px] font-mono"
            title={
              isFr
                ? 'Bouclier Anti-Spoiler : retardez les notifications de but selon le décalage de votre stream'
                : 'Spoiler Shield: buffer goal notifications to match your broadcast stream delay'
            }
          >
            <Shield className="w-3.5 h-3.5 text-[#B8FF01]" />
            <span className="text-slate-400">
              {isFr ? 'Anti-Spoiler:' : 'Shield:'}
            </span>
            {([0, 15, 30, 60] as SpoilerDelayOption[]).map((sec) => (
              <button
                key={sec}
                onClick={() => setSpoilerDelaySeconds(sec)}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  spoilerDelaySeconds === sec
                    ? 'bg-[#B8FF01] text-[#050D08] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec === 0 ? '0s' : `+${sec}s`}
              </button>
            ))}
            {bufferedAlerts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded bg-[#B8FF01]/20 text-[#B8FF01] font-bold animate-pulse">
                {bufferedAlerts.length} ({bufferedAlerts[0].remainingSeconds}s)
              </span>
            )}
          </div>

          {/* Cloud Realtime Sync Pill */}
          <div
            className="hidden lg:inline-flex items-center gap-1.5 rounded-md bg-[#0B1A11] border border-[#1A3324] px-2.5 py-1 text-[11px] font-mono text-slate-300"
            title={`${cloudTelemetry.providerLabel} · Last synced ${cloudTelemetry.lastSyncedAt}`}
          >
            <Cloud className="w-3.5 h-3.5 text-[#B8FF01]" />
            <span className="text-[#B8FF01] font-semibold">
              {cloudTelemetry.latencyMs}ms
            </span>
          </div>

          {/* Share Deep-Link Button */}
          <button
            onClick={() => shareCurrentDeepLink()}
            className="p-2 rounded-md bg-[#0B1A11] hover:bg-[#132A1C] border border-[#1A3324] text-slate-300 hover:text-[#B8FF01] transition-colors cursor-pointer"
            title={
              isFr
                ? 'Copier le lien direct vers cette vue / ce match'
                : 'Copy shareable deep-link to current view & match'
            }
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Install PWA App Button */}
          <button
            onClick={() => installPwaApp()}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0B1A11] hover:bg-[#132A1C] border border-[#1A3324] text-xs font-mono text-slate-300 hover:text-[#B8FF01] transition-colors cursor-pointer"
            title={
              isFr
                ? 'Installer l’application PWA Scorecer'
                : 'Install Scorecer PWA App'
            }
          >
            <Download className="w-3.5 h-3.5 text-[#B8FF01]" />
            <span>PWA</span>
          </button>

          {/* EN / FR Switcher */}
          <div className="inline-flex items-center rounded-md bg-[#0B1A11] border border-[#1A3324] p-0.5 text-xs font-mono">
            <button
              onClick={() => setUiLanguage('en')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                uiLanguage === 'en'
                  ? 'bg-[#162B1E] text-[#B8FF01] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setUiLanguage('fr')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                uiLanguage === 'fr'
                  ? 'bg-[#162B1E] text-[#B8FF01] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
          </div>

          {user.isRegistered ? (
            <button
              onClick={() => openAuthModal('profile')}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#0B1A11] border border-[#234430] hover:border-[#B8FF01]/50 text-xs font-medium text-white transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#B8FF01]" />
              <span>{user.username}</span>
              <span className="font-mono text-[#B8FF01] font-semibold">
                {user.fanScore} PTS
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer px-2 py-1.5"
              >
                {isFr ? 'Connexion' : 'Sign in'}
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 rounded-lg bg-[#B8FF01] hover:bg-[#c7ff33] text-[#050D08] font-semibold text-sm transition-all cursor-pointer shadow-sm"
              >
                {isFr ? 'Commencer' : 'Get started'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="flex md:hidden items-center gap-2 px-4 py-2 overflow-x-auto border-t border-[#162B1E] bg-[#07110B]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                  : 'text-slate-300 bg-[#0B1A11]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
