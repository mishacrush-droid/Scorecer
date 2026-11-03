import React, { useEffect, useState } from 'react';
import {
  Award,
  Bell,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import {
  AuthModalMode,
  CommentaryLanguage,
  CommentatorPersona,
  NotificationFilters,
} from '../../types/scorecer';
import { evaluatePasswordStrength } from '../../services/authService';
import { ScorecerLogo } from '../common/ScorecerLogo';

const CLUB_OPTIONS = [
  'Arsenal',
  'Real Madrid',
  'Paris Saint-Germain',
  'Manchester City',
  'Olympique de Marseille',
  'FC Barcelona',
  'Liverpool',
  'Inter Milan',
  'Bayern Munich',
  'Bayer Leverkusen',
  'AS Monaco',
  'AC Milan',
];

const LEAGUE_OPTIONS = [
  'UEFA Champions League',
  'Premier League',
  'Ligue 1 McDonald’s',
  'LaLiga',
  'Serie A',
  'Bundesliga',
];

export const RegistrationModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    openAuthModal,
    uiLanguage,
    user,
    sessionToken,
    registerUser,
    signInUser,
    signInWithOAuth,
    resetUserPassword,
    signOutUser,
    toggleNotificationFilter,
    toggleProStatus,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  const [mode, setMode] = useState<AuthModalMode>(authModalMode);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Sign-Up State
  const [username, setUsername] = useState<string>('Alex Mercer');
  const [handle, setHandle] = useState<string>('@tactical_alex');
  const [email, setEmail] = useState<string>('alex@scorecer.ai');
  const [password, setPassword] = useState<string>('Scorecer2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  const [selectedClubs, setSelectedClubs] = useState<string[]>(
    user.favoriteClubs.length ? user.favoriteClubs : ['Arsenal', 'Real Madrid']
  );
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(
    user.favoriteLeagues.length
      ? user.favoriteLeagues
      : ['UEFA Champions League', 'Premier League']
  );
  const [nationalSquad] = useState<string>(
    user.nationalSquad || (isFr ? 'France' : 'England')
  );
  const [persona, setPersona] = useState<CommentatorPersona>(user.defaultPersona);
  const [commLang] = useState<CommentaryLanguage>(
    isFr ? 'fr' : user.defaultLanguage
  );
  const [gdprZeroParty, setGdprZeroParty] = useState<boolean>(
    user.gdprZeroPartyOptIn
  );
  const [gdprGeo, setGdprGeo] = useState<boolean>(user.gdprGeoOptIn);

  // Sign-In & Password Reset State
  const [signInEmail, setSignInEmail] = useState<string>('alex@scorecer.ai');
  const [signInPassword, setSignInPassword] = useState<string>('Scorecer2026!');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showResetFlow, setShowResetFlow] = useState<boolean>(false);
  const [newResetPassword, setNewResetPassword] = useState<string>('');

  useEffect(() => {
    setMode(authModalMode);
    setStep(1);
    setAuthError(null);
    setAuthInfo(null);
    setShowResetFlow(false);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const strength = evaluatePasswordStrength(password);

  const toggleClub = (club: string) => {
    setSelectedClubs((prev) =>
      prev.includes(club) ? prev.filter((c) => c !== club) : [...prev, club]
    );
  };

  const toggleLeague = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((l) => l !== league)
        : [...prev, league]
    );
  };

  const handleStep1Continue = () => {
    setAuthError(null);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAuthError(
        isFr
          ? 'Veuillez saisir une adresse e-mail valide.'
          : 'Please enter a valid email address.'
      );
      return;
    }
    if (!password || password.length < 6) {
      setAuthError(
        isFr
          ? 'Le mot de passe doit contenir au moins 6 caractères.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }
    setStep(2);
  };

  const handleFinishSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await registerUser({
      username: username.trim() || 'Football Fan',
      handle: handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      email: email.trim(),
      password,
      favoriteClubs: selectedClubs.length ? selectedClubs : ['Arsenal'],
      favoriteLeagues: selectedLeagues.length
        ? selectedLeagues
        : ['UEFA Champions League'],
      nationalSquad,
      defaultPersona: persona,
      defaultLanguage: commLang,
      gdprZeroPartyOptIn: gdprZeroParty,
      gdprGeoOptIn: gdprGeo,
    });
    if (!res.ok && res.error) {
      setAuthError(res.error);
      setStep(1);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthInfo(null);
    const res = await signInUser(signInEmail, signInPassword, rememberMe);
    if (!res.ok && res.error) {
      setAuthError(res.error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await resetUserPassword(signInEmail, newResetPassword);
    if (!res.ok) {
      setAuthError(res.message);
    } else {
      setAuthInfo(res.message);
      setSignInPassword(newResetPassword);
      setShowResetFlow(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#050D08] border border-[#162B1E] shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Top Stadium Atmospheric Header */}
        <div className="relative h-32 overflow-hidden border-b border-[#162B1E]">
          <img
            src="/images/hero-goalnet.jpg"
            alt="Scorecer stadium background"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/60 to-transparent" />

          <div className="absolute inset-0 px-6 py-5 flex items-end justify-between">
            <div className="space-y-1">
              <ScorecerLogo size="sm" />
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#B8FF01]">
                {mode === 'signin'
                  ? isFr
                    ? 'CONNEXION SÉCURISÉE SHA-256'
                    : 'SHA-256 SECURE SIGN IN'
                  : mode === 'profile'
                  ? isFr
                    ? 'VOTRE PROFIL SUPPORTER'
                    : 'YOUR FAN PROFILE'
                  : isFr
                  ? 'CRÉER VOTRE COMPTE CHIFFRÉ'
                  : 'GET STARTED WITH SCORECER'}
              </p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-2 rounded-lg bg-[#08140C]/90 hover:bg-[#112619] border border-[#1F3B2A] text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 border-b border-[#162B1E] bg-[#08140C] text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => openAuthModal('signup')}
            className={`py-3.5 text-center transition-colors cursor-pointer relative ${
              mode === 'signup'
                ? 'text-[#B8FF01] font-semibold bg-[#0B1A11]/70'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isFr ? 'Commencer' : 'Get started'}
            {mode === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8FF01]" />
            )}
          </button>
          <button
            onClick={() => openAuthModal('signin')}
            className={`py-3.5 text-center transition-colors cursor-pointer relative ${
              mode === 'signin'
                ? 'text-[#B8FF01] font-semibold bg-[#0B1A11]/70'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isFr ? 'Connexion' : 'Sign in'}
            {mode === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8FF01]" />
            )}
          </button>
          <button
            onClick={() => openAuthModal('profile')}
            className={`py-3.5 text-center transition-colors cursor-pointer relative ${
              mode === 'profile'
                ? 'text-[#B8FF01] font-semibold bg-[#0B1A11]/70'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isFr ? 'Mon Profil' : 'My Profile'}
            {mode === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8FF01]" />
            )}
          </button>
        </div>

        {/* =================================================================
            MODE 1: SIGN IN ("Sign in" / "Connexion")
        ================================================================= */}
        {mode === 'signin' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h3 className="font-display text-2xl font-bold text-white">
                {isFr ? 'Bon retour sur le terrain.' : 'Welcome back to the pitch.'}
              </h3>
              <p className="text-sm text-slate-400">
                {isFr
                  ? 'Authentification chiffrée Web Crypto. Retrouvez vos clubs, vos Squads et votre solde FanScore.'
                  : 'Web Crypto authenticated session. Access your clubs, Squad threads, and FanScore wallet.'}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300">
                {authError}
              </div>
            )}

            {authInfo && (
              <div className="p-3 rounded-lg bg-[#B8FF01]/10 border border-[#B8FF01]/40 text-xs text-[#B8FF01]">
                {authInfo}
              </div>
            )}

            {/* OAuth Quick Sign-In Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signInWithOAuth('google')}
                className="py-2.5 px-4 rounded-lg bg-[#08140C] hover:bg-[#0F2417] border border-[#1A3324] hover:border-[#B8FF01]/50 text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span className="font-bold text-[#B8FF01]">G</span>
                <span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</span>
              </button>
              <button
                type="button"
                onClick={() => signInWithOAuth('apple')}
                className="py-2.5 px-4 rounded-lg bg-[#08140C] hover:bg-[#0F2417] border border-[#1A3324] hover:border-[#B8FF01]/50 text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span className="font-bold text-white"></span>
                <span>{isFr ? 'Continuer avec Apple' : 'Continue with Apple'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono uppercase text-slate-500">
              <div className="flex-1 h-[1px] bg-[#162B1E]" />
              <span>{isFr ? 'ou avec votre e-mail' : 'or sign in with email'}</span>
              <div className="flex-1 h-[1px] bg-[#162B1E]" />
            </div>

            {!showResetFlow ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    {isFr ? 'Adresse e-mail' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#08140C] border border-[#1A3324] focus:border-[#B8FF01] text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                      {isFr ? 'Mot de passe' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowResetFlow(true)}
                      className="text-xs font-mono text-[#B8FF01] hover:underline cursor-pointer"
                    >
                      {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#08140C] border border-[#1A3324] focus:border-[#B8FF01] text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[#B8FF01]"
                    />
                    <span>
                      {isFr ? 'Rester connecté (30 jours)' : 'Remember session (30 days)'}
                    </span>
                  </label>
                  <span className="font-mono text-[11px] text-slate-500">
                    Demo: alex@scorecer.ai
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-xs text-slate-400 hover:text-[#B8FF01] cursor-pointer"
                  >
                    {isFr
                      ? 'Pas encore de compte ? Créer un compte →'
                      : "Don't have an account yet? Get started →"}
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isFr ? 'Se connecter' : 'Sign in'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="p-3.5 rounded-lg bg-[#08140C] border border-[#162B1E] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF01]">
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {isFr
                        ? 'RÉINITIALISER LE MOT DE PASSE'
                        : 'RESET ACCOUNT PASSWORD'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {isFr ? 'Votre e-mail' : 'Account email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#050D08] border border-[#1A3324] text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {isFr ? 'Nouveau mot de passe (min 6 car.)' : 'New password (min 6 chars)'}
                    </label>
                    <input
                      type="password"
                      required
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded bg-[#050D08] border border-[#1A3324] text-sm text-white outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowResetFlow(false)}
                      className="px-3 py-1.5 rounded bg-[#050D08] border border-[#162B1E] text-xs text-slate-300 cursor-pointer"
                    >
                      {isFr ? 'Annuler' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-[#B8FF01] text-[#050D08] font-semibold text-xs cursor-pointer"
                    >
                      {isFr ? 'Mettre à jour' : 'Update password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* =================================================================
            MODE 2: GET STARTED ("Get started" / "Commencer" 3-Step Flow)
        ================================================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleFinishSignUp} className="p-6 sm:p-8 space-y-6">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between gap-2">
              {[
                { s: 1, label: isFr ? '01 · Compte' : '01 · Account' },
                { s: 2, label: isFr ? '02 · Vos Clubs' : '02 · Your Clubs' },
                { s: 3, label: isFr ? '03 · Voix IA' : '03 · AI Voice' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.s}
                  onClick={() =>
                    item.s === 1 ? setStep(1) : handleStep1Continue()
                  }
                  className={`flex-1 py-2 px-3 rounded-lg border text-left font-mono text-xs transition-all cursor-pointer ${
                    step === item.s
                      ? 'bg-[#0F2417] border-[#B8FF01] text-[#B8FF01] font-semibold'
                      : 'bg-[#08140C] border-[#162B1E] text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300">
                {authError}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {isFr
                      ? 'Créez votre compte supporter chiffré'
                      : 'Create your encrypted supporter account'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {isFr
                      ? 'Mot de passe haché via Web Crypto SHA-256 + 250 pts FanScore offerts.'
                      : 'Password hashed locally via Web Crypto SHA-256 + 250 FanScore bonus.'}
                  </p>
                </div>

                {/* Quick OAuth */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => signInWithOAuth('google')}
                    className="py-2 px-3 rounded-lg bg-[#08140C] hover:bg-[#0F2417] border border-[#1A3324] text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="font-bold text-[#B8FF01]">G</span>
                    <span>{isFr ? 'Inscription Google' : 'Sign up with Google'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => signInWithOAuth('apple')}
                    className="py-2 px-3 rounded-lg bg-[#08140C] hover:bg-[#0F2417] border border-[#1A3324] text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span></span>
                    <span>{isFr ? 'Inscription Apple' : 'Sign up with Apple'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                      {isFr ? 'Nom complet' : 'Full name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#08140C] border border-[#1A3324] focus:border-[#B8FF01] text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                      {isFr ? 'Pseudo Squad' : 'Squad handle'}
                    </label>
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#08140C] border border-[#1A3324] focus:border-[#B8FF01] text-sm text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    {isFr ? 'Adresse e-mail' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#08140C] border border-[#1A3324] focus:border-[#B8FF01] text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                      {isFr ? 'Mot de passe' : 'Create password'}
                    </label>
                    <span className="font-mono text-[11px] text-[#B8FF01]">
                      {isFr ? strength.labelFr : strength.labelEn}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#08140C] border border-[#1A3324] focus:border-[#B8FF01] text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength Bars */}
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 rounded-full ${
                          lvl <= strength.score ? 'bg-[#B8FF01]' : 'bg-[#162B1E]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleStep1Continue}
                    className="px-6 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm cursor-pointer"
                  >
                    {isFr ? 'Continuer vers vos clubs →' : 'Next: Pick your clubs →'}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {isFr
                      ? 'Sélectionnez vos clubs et compétitions'
                      : 'Select your clubs and competitions'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isFr
                      ? 'Votre accueil affichera uniquement vos équipes suivies, sans bruit.'
                      : 'Your Match Home stays distraction-free around the teams you follow.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#B8FF01]">
                    {isFr ? 'Clubs favoris' : 'Favorite clubs'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CLUB_OPTIONS.map((club) => {
                      const active = selectedClubs.includes(club);
                      return (
                        <button
                          type="button"
                          key={club}
                          onClick={() => toggleClub(club)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? 'bg-[#B8FF01] text-[#050D08] border-[#B8FF01] font-semibold'
                              : 'bg-[#08140C] text-slate-300 border-[#162B1E] hover:border-[#284D36]'
                          }`}
                        >
                          {club}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#B8FF01]">
                    {isFr ? 'Compétitions' : 'Competitions'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LEAGUE_OPTIONS.map((league) => {
                      const active = selectedLeagues.includes(league);
                      return (
                        <button
                          type="button"
                          key={league}
                          onClick={() => toggleLeague(league)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? 'bg-[#12291B] text-[#B8FF01] border-[#B8FF01]'
                              : 'bg-[#08140C] text-slate-300 border-[#162B1E]'
                          }`}
                        >
                          {league}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-lg bg-[#08140C] border border-[#162B1E] text-xs text-slate-300 cursor-pointer"
                  >
                    {isFr ? '← Retour' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm cursor-pointer"
                  >
                    {isFr ? 'Suivant : Voix IA →' : 'Next: AI Voice →'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {isFr
                      ? 'Choisissez votre voix de commentaire IA'
                      : 'Choose your AI commentary persona'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isFr
                      ? 'Changez de style à tout moment pendant un match en direct.'
                      : 'Switch personas any time during a live match.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        id: 'tactical-analyst',
                        title: isFr ? 'Tactique' : 'Tactical',
                        desc: isFr
                          ? 'xG, espaces & pressing expliqués simplement'
                          : 'Formations, half-spaces & momentum explained',
                      },
                      {
                        id: 'passionate-fan',
                        title: isFr ? 'Passionné' : 'Passionate',
                        desc: isFr
                          ? 'Énergie tribune & émotion pure'
                          : 'Pure supporter energy that rides every roar',
                      },
                      {
                        id: 'neutral-broadcaster',
                        title: isFr ? 'Neutre' : 'Neutral',
                        desc: isFr
                          ? 'Cadence télévisée classique'
                          : 'Balanced broadcast play-by-play cadence',
                      },
                    ] as const
                  ).map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                        persona === p.id
                          ? 'bg-[#0F2417] border-[#B8FF01] text-white'
                          : 'bg-[#08140C] border-[#162B1E] text-slate-400'
                      }`}
                    >
                      <div className="font-display font-bold text-sm text-white">
                        {p.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {p.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Transparent GDPR Opt-In */}
                <div className="space-y-2.5 bg-[#08140C] border border-[#162B1E] rounded-lg p-3.5 text-xs">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <span className="text-slate-300">
                      {isFr
                        ? 'Activer la découverte locale des soirées match (RGPD Opt-In)'
                        : 'Enable local pub watch-party discovery (GDPR Opt-In)'}
                    </span>
                    <input
                      type="checkbox"
                      checked={gdprGeo}
                      onChange={(e) => setGdprGeo(e.target.checked)}
                      className="accent-[#B8FF01] w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <span className="text-slate-300">
                      {isFr
                        ? 'Personnaliser mes pronostics & temps forts IA'
                        : 'Personalize my micro-predictions & AI highlight reels'}
                    </span>
                    <input
                      type="checkbox"
                      checked={gdprZeroParty}
                      onChange={(e) => setGdprZeroParty(e.target.checked)}
                      className="accent-[#B8FF01] w-4 h-4"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-lg bg-[#08140C] border border-[#162B1E] text-xs text-slate-300 cursor-pointer"
                  >
                    {isFr ? '← Retour' : '← Back'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm cursor-pointer inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isFr
                        ? 'Créer mon compte (+250 PTS)'
                        : 'Complete setup (+250 PTS)'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* =================================================================
            MODE 3: MY PROFILE ("My Profile" / "Mon Profil")
        ================================================================= */}
        {mode === 'profile' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#08140C] border border-[#162B1E] rounded-xl p-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#B8FF01] text-[#050D08] font-wide font-black text-lg flex items-center justify-center">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-lg text-white">
                      {user.username}
                    </h4>
                    <span className="text-xs font-mono text-[#B8FF01]">
                      {user.handle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {user.email} · {user.favoriteClubs.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-lg text-[#B8FF01] flex items-center gap-1.5 justify-end">
                  <Award className="w-4 h-4" />
                  <span>{user.fanScore} PTS</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {user.predictionAccuracy}%{' '}
                  {isFr ? 'Pronostics réussis' : 'Prediction Accuracy'}
                </span>
              </div>
            </div>

            {/* Active Session Security Certificate */}
            <div className="p-3.5 rounded-xl bg-[#08140C] border border-[#162B1E] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B8FF01] shrink-0" />
                <div>
                  <span className="font-semibold text-white">
                    {isFr
                      ? 'Session authentifiée Web Crypto (SHA-256)'
                      : 'Web Crypto Authenticated Session (SHA-256)'}
                  </span>
                  <p className="font-mono text-[11px] text-slate-400">
                    Token ID:{' '}
                    {sessionToken
                      ? `${sessionToken.signature.slice(0, 18)}...`
                      : 'active_local_session'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#B8FF01]/15 text-[#B8FF01] font-mono text-[10px]">
                {user.isRegistered ? 'VERIFIED' : 'GUEST'}
              </span>
            </div>

            {/* Granular Match Alert Toggles */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B8FF01]">
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {isFr
                    ? 'Alertes de match personnalisées'
                    : 'Granular match notification filters'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { key: 'goals', en: 'Goals', fr: 'Buts' },
                    { key: 'redCards', en: 'Red Cards', fr: 'Cartons rouges' },
                    {
                      key: 'tacticalShifts',
                      en: 'Tactical Shifts',
                      fr: 'Changements tactiques',
                    },
                    { key: 'xgSpikes', en: 'xG Surges', fr: 'Pics xG' },
                    { key: 'fullTime', en: 'Full-Time', fr: 'Score final' },
                  ] as { key: keyof NotificationFilters; en: string; fr: string }[]
                ).map((item) => {
                  const active = user.notificationFilters[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleNotificationFilter(item.key)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between cursor-pointer ${
                        active
                          ? 'bg-[#0F2417] border-[#B8FF01]/60 text-white'
                          : 'bg-[#08140C] border-[#162B1E] text-slate-400'
                      }`}
                    >
                      <span>{isFr ? item.fr : item.en}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#B8FF01]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scorecer Pro & Sign Out */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#162B1E]">
              <button
                onClick={toggleProStatus}
                className="px-4 py-2 rounded-lg bg-[#08140C] hover:bg-[#112619] border border-[#1F3B2A] text-xs font-mono text-[#B8FF01] cursor-pointer"
              >
                {user.isPro
                  ? isFr
                    ? '★ Scorecer Pro Actif'
                    : '★ Scorecer Pro Active'
                  : isFr
                  ? 'Activer l’essai Scorecer Pro'
                  : 'Activate Scorecer Pro Trial'}
              </button>

              <div className="flex items-center gap-2">
                {user.isRegistered && (
                  <button
                    onClick={signOutUser}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#08140C] border border-[#162B1E] hover:border-rose-500/40 text-xs text-slate-300 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Déconnexion' : 'Sign out'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-5 py-2 rounded-lg bg-[#B8FF01] text-[#050D08] font-semibold text-xs cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
