import React, { Suspense, lazy } from 'react';
import { ScorecerProvider, useScorecer } from './context/ScorecerContext';
import { TopNavbar } from './components/layout/TopNavbar';
import { LandingVisionView } from './components/promo/LandingVisionView';
import { RegistrationModal } from './components/auth/RegistrationModal';
import { StoreReadinessModal } from './components/compliance/StoreReadinessModal';
import { ScorecerLogo } from './components/common/ScorecerLogo';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

// Code-split secondary application routes via React.lazy() for rapid 4G/5G stadium loading
const DiscoverHubView = lazy(() =>
  import('./components/discover/DiscoverHubView').then((m) => ({
    default: m.DiscoverHubView,
  }))
);
const MatchCenterView = lazy(() =>
  import('./components/match/MatchCenterView').then((m) => ({
    default: m.MatchCenterView,
  }))
);
const ScorecerAIHubView = lazy(() =>
  import('./components/ai/ScorecerAIHubView').then((m) => ({
    default: m.ScorecerAIHubView,
  }))
);
const SquadsAndSocialView = lazy(() =>
  import('./components/social/SquadsAndSocialView').then((m) => ({
    default: m.SquadsAndSocialView,
  }))
);
const O2OLocalNetworkView = lazy(() =>
  import('./components/social/O2OLocalNetworkView').then((m) => ({
    default: m.O2OLocalNetworkView,
  }))
);

const RouteLoadingFallback: React.FC<{ isFr: boolean }> = ({ isFr }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#050D08] px-6">
    <div className="h-10 w-10 rounded-full border-2 border-[#1E3B29] border-t-[#B8FF01] animate-spin" />
    <p className="font-mono text-xs uppercase tracking-widest text-[#B8FF01]">
      {isFr
        ? 'Synchronisation du terrain Scorecer...'
        : 'Loading Scorecer Stadium Module...'}
    </p>
  </div>
);

const ScorecerMainShell: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    uiLanguage,
    toastMessage,
    openAuthModal,
    user,
    setIsStoreReadinessOpen,
  } = useScorecer();
  const isFr = uiLanguage === 'fr';

  return (
    <div className="min-h-screen flex flex-col bg-[#050D08] text-slate-100">
      <TopNavbar />

      {/* Live Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#09150E]/95 backdrop-blur-xl border border-[#B8FF01]/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#B8FF01] shrink-0" />
          <span className="text-xs font-medium leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area with Suspense Route Code-Splitting */}
      <main className="flex-1">
        <Suspense fallback={<RouteLoadingFallback isFr={isFr} />}>
          {activeTab === 'vision' && <LandingVisionView />}
          {activeTab === 'match-center' && <MatchCenterView />}
          {activeTab === 'ai-hub' && <ScorecerAIHubView />}
          {activeTab === 'social-squads' && <SquadsAndSocialView />}
          {activeTab === 'o2o-local' && <O2OLocalNetworkView />}
          {activeTab === 'discover' && <DiscoverHubView />}
        </Suspense>
      </main>

      {/* Registration & Sign In Modal */}
      <RegistrationModal />

      {/* App Store & Google Play Launch Readiness + RevenueCat Paywall Modal */}
      <StoreReadinessModal />

      {/* Clean Editorial Stadium Footer */}
      <footer className="bg-[#040A06] border-t border-[#162B1E] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <ScorecerLogo size="md" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isFr
                ? 'Le football qui pense avec vous. Scores instantanés, IA de match conversationnelle, Stories vidéo verticales et Squads pour vivre le match entre passionnés.'
                : 'Football that thinks with you. Sub-second scores, conversational match AI, vertical highlight Stories, and Squads that keep the banter on the pitch.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-[#B8FF01]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isFr ? 'Confidentialité RGPD Opt-In' : 'GDPR Opt-In Privacy'}
              </span>
              <span>·</span>
              <span>{isFr ? 'Sans publicités intrusives' : 'Ad-Free Match Utility'}</span>
              <span>·</span>
              <span>{isFr ? '200+ Championnats Mondiaux' : '200+ Global Leagues'}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Guideline 5.3.2 Compliance: FanScore points are 100% free-to-play loyalty points with zero cash value and cannot be exchanged for real currency. Apple Inc. and Google LLC are not sponsors of, nor affiliated with, Scorecer rewards.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                setActiveTab('vision');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              {isFr ? 'Produit' : 'Product'}
            </button>
            <button
              onClick={() => {
                setActiveTab('ai-hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              {isFr ? 'Studio IA' : 'AI Studio'}
            </button>
            <button
              onClick={() => {
                setActiveTab('match-center');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              {isFr ? 'Matchs en direct' : 'Live Matches'}
            </button>
            <button
              onClick={() => {
                setActiveTab('social-squads');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              Squads
            </button>
            <button
              onClick={() => {
                setActiveTab('o2o-local');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              {isFr ? 'Soirées Match' : 'Watch Parties'}
            </button>
            <button
              onClick={() => setIsStoreReadinessOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#0B1A11] hover:bg-[#132A1C] text-xs text-[#00D4FF] border border-[#00D4FF]/40 font-mono font-bold cursor-pointer"
            >
              Store Launch Readiness & Paywall
            </button>
            <button
              onClick={() => {
                setActiveTab('vision');
                window.setTimeout(() => {
                  document
                    .getElementById('tutorials-and-videos')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              {isFr ? 'Tutoriels & Vidéos' : 'Tutorials & Videos'}
            </button>
            <button
              onClick={() => {
                setActiveTab('vision');
                window.setTimeout(() => {
                  document
                    .getElementById('leadership-team')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              {isFr ? 'Équipe (CEO & CTO)' : 'Team (CEO & CTO)'}
            </button>
            <button
              onClick={() => {
                setActiveTab('vision');
                window.setTimeout(() => {
                  document
                    .getElementById('faq-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="px-3.5 py-2 rounded-lg bg-[#08140C] hover:bg-[#0E2215] text-xs text-slate-300 border border-[#162B1E] cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => openAuthModal(user.isRegistered ? 'profile' : 'signup')}
              className="px-4 py-2 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-xs text-[#050D08] font-semibold cursor-pointer"
            >
              {user.isRegistered
                ? isFr
                  ? 'Mon Profil'
                  : 'My Profile'
                : isFr
                ? 'Commencer'
                : 'Get started'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ScorecerProvider>
      <ScorecerMainShell />
    </ScorecerProvider>
  );
}

export default App;
