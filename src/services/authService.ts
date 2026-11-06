import {
  CommentaryLanguage,
  CommentatorPersona,
  UserProfile,
} from '../types/scorecer';
import { DEFAULT_USER_PROFILE } from '../data/mockScorecerData';

export interface StoredAccountRecord {
  id: string;
  username: string;
  handle: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  lastLoginAt: string;
  authProvider: 'email' | 'google' | 'apple';
  profile: UserProfile;
}

export interface SessionTokenPayload {
  userId: string;
  email: string;
  issuedAt: number;
  expiresAt: number;
  signature: string;
  jwt?: string;
}

const ACCOUNTS_DB_KEY = 'scorecer_accounts_db_v2';
const SESSION_TOKEN_KEY = 'scorecer_auth_session_token_v2';

// Helper: Generate random hex salt
function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Web Crypto API SHA-256 hashing with salt
export async function hashPasswordWithSalt(
  password: string,
  salt: string
): Promise<string> {
  const combined = `${salt}:scorecer_pepper_v2:${password}`;
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback deterministic hash if subtle crypto unavailable in non-secure context
  let h1 = 0xdeadbeef ^ combined.length;
  let h2 = 0x41c6ce57 ^ combined.length;
  for (let i = 0, ch; i < combined.length; i++) {
    ch = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (
    (h2 >>> 0).toString(16).padStart(8, '0') +
    (h1 >>> 0).toString(16).padStart(8, '0')
  );
}

// Evaluate password strength (0 to 4)
export function evaluatePasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  labelEn: string;
  labelFr: string;
} {
  if (!password || password.length < 6) {
    return { score: 1, labelEn: 'Too short (min 6 chars)', labelFr: 'Trop court (min 6 car.)' };
  }
  let pts = 1;
  if (password.length >= 8) pts++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) pts++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) pts++;
  const score = Math.min(4, pts) as 0 | 1 | 2 | 3 | 4;
  const labels = {
    0: { en: 'Weak', fr: 'Faible' },
    1: { en: 'Weak', fr: 'Faible' },
    2: { en: 'Fair', fr: 'Moyen' },
    3: { en: 'Good', fr: 'Bon' },
    4: { en: 'Strong (Encrypted)', fr: 'Fort (Chiffré SHA-256)' },
  }[score];
  return { score, labelEn: labels.en, labelFr: labels.fr };
}

export function loadAccountsDatabase(): StoredAccountRecord[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }

  // Seed default verified founder demo account so demo login works out of the box
  const defaultAccount: StoredAccountRecord = {
    id: 'usr-scorecer-01',
    username: 'Alex Mercer',
    handle: '@tactical_alex',
    email: 'alex@scorecer.ai',
    salt: 'a1b2c3d4e5f60718',
    passwordHash: 'demo_preseeded_hash',
    createdAt: '2026-09-15T18:00:00Z',
    lastLoginAt: new Date().toISOString(),
    authProvider: 'email',
    profile: {
      ...DEFAULT_USER_PROFILE,
      isRegistered: true,
    },
  };
  saveAccountsDatabase([defaultAccount]);
  return [defaultAccount];
}

export function saveAccountsDatabase(accounts: StoredAccountRecord[]): void {
  try {
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
  } catch {
    // ignore storage errors
  }
}

export async function issueSessionToken(
  userId: string,
  email: string,
  rememberMe = true
): Promise<SessionTokenPayload> {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
  const signature = await hashPasswordWithSalt(
    `${userId}:${email}:${issuedAt}:${expiresAt}`,
    'scorecer_jwt_sig_v2'
  );
  const token: SessionTokenPayload = {
    userId,
    email,
    issuedAt,
    expiresAt,
    signature,
    jwt: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${signature}`,
  };
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(token));
  } catch {
    // ignore
  }
  return token;
}

export function getActiveSession(): {
  account: StoredAccountRecord;
  token: SessionTokenPayload;
} | null {
  try {
    const rawToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!rawToken) return null;
    const token: SessionTokenPayload = JSON.parse(rawToken);
    if (Date.now() > token.expiresAt) {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      return null;
    }
    const accounts = loadAccountsDatabase();
    const account = accounts.find(
      (a) =>
        a.id === token.userId ||
        a.email.toLowerCase() === token.email.toLowerCase()
    );
    if (!account) return null;
    return { account, token };
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function registerNewAccount(params: {
  username: string;
  handle: string;
  email: string;
  password: string;
  favoriteClubs: string[];
  favoriteLeagues: string[];
  nationalSquad: string;
  defaultPersona: CommentatorPersona;
  defaultLanguage: CommentaryLanguage;
  gdprZeroPartyOptIn: boolean;
  gdprGeoOptIn: boolean;
}): Promise<{
  ok: boolean;
  errorEn?: string;
  errorFr?: string;
  account?: StoredAccountRecord;
  token?: SessionTokenPayload;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      ok: false,
      errorEn: 'Please enter a valid email address.',
      errorFr: 'Veuillez saisir une adresse e-mail valide.',
    };
  }
  if (!params.password || params.password.length < 6) {
    return {
      ok: false,
      errorEn: 'Password must be at least 6 characters long.',
      errorFr: 'Le mot de passe doit contenir au moins 6 caractères.',
    };
  }

  const accounts = loadAccountsDatabase();
  const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existing && existing.passwordHash !== 'demo_preseeded_hash') {
    return {
      ok: false,
      errorEn: 'An account with this email already exists. Please sign in.',
      errorFr: 'Un compte existe déjà avec cet e-mail. Veuillez vous connecter.',
    };
  }

  const salt = generateSalt(16);
  const passwordHash = await hashPasswordWithSalt(params.password, salt);
  const userId = existing ? existing.id : `usr-${Date.now()}`;
  const formattedHandle = params.handle.trim().startsWith('@')
    ? params.handle.trim()
    : `@${params.handle.trim() || params.username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const newProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    id: userId,
    username: params.username.trim() || 'Football Fan',
    handle: formattedHandle,
    email: cleanEmail,
    isRegistered: true,
    fanScore: 1700, // 1450 base + 250 registration bonus
    favoriteClubs: params.favoriteClubs.length ? params.favoriteClubs : ['Arsenal'],
    favoriteLeagues: params.favoriteLeagues.length
      ? params.favoriteLeagues
      : ['UEFA Champions League'],
    nationalSquad: params.nationalSquad || 'France',
    defaultPersona: params.defaultPersona,
    defaultLanguage: params.defaultLanguage,
    gdprZeroPartyOptIn: params.gdprZeroPartyOptIn,
    gdprGeoOptIn: params.gdprGeoOptIn,
    badges: [
      'Verified Scorecer Member',
      'Early Alpha Founder',
      'xG Tactician (Top 5%)',
    ],
  };

  const record: StoredAccountRecord = {
    id: userId,
    username: newProfile.username,
    handle: newProfile.handle,
    email: cleanEmail,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    authProvider: 'email',
    profile: newProfile,
  };

  const updatedAccounts = existing
    ? accounts.map((a) => (a.id === existing.id ? record : a))
    : [record, ...accounts];
  saveAccountsDatabase(updatedAccounts);

  const token = await issueSessionToken(record.id, record.email, true);
  return { ok: true, account: record, token };
}

export async function authenticateAccount(params: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<{
  ok: boolean;
  errorEn?: string;
  errorFr?: string;
  account?: StoredAccountRecord;
  token?: SessionTokenPayload;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  const accounts = loadAccountsDatabase();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) {
    return {
      ok: false,
      errorEn: 'No account found for this email. Try creating a free account.',
      errorFr: 'Aucun compte trouvé pour cet e-mail. Créez un compte gratuit.',
    };
  }

  // Allow demo pre-seeded login or verify real SHA-256 password hash
  if (account.passwordHash !== 'demo_preseeded_hash') {
    const candidateHash = await hashPasswordWithSalt(
      params.password,
      account.salt
    );
    if (candidateHash !== account.passwordHash) {
      return {
        ok: false,
        errorEn: 'Incorrect password. Please try again or reset your password.',
        errorFr: 'Mot de passe incorrect. Veuillez réessayer ou le réinitialiser.',
      };
    }
  }

  const updatedAccount: StoredAccountRecord = {
    ...account,
    lastLoginAt: new Date().toISOString(),
    profile: {
      ...account.profile,
      isRegistered: true,
    },
  };

  saveAccountsDatabase(
    accounts.map((a) => (a.id === account.id ? updatedAccount : a))
  );
  const token = await issueSessionToken(
    updatedAccount.id,
    updatedAccount.email,
    params.rememberMe ?? true
  );
  return { ok: true, account: updatedAccount, token };
}

export async function authenticateWithOAuthProvider(
  provider: 'google' | 'apple'
): Promise<{
  account: StoredAccountRecord;
  token: SessionTokenPayload;
}> {
  const accounts = loadAccountsDatabase();
  const email =
    provider === 'google' ? 'supporter.google@scorecer.ai' : 'supporter.apple@scorecer.ai';
  let existing = accounts.find((a) => a.email === email);

  if (!existing) {
    const userId = `usr-${provider}-${Date.now()}`;
    existing = {
      id: userId,
      username: provider === 'google' ? 'Lucas Laurent' : 'Claire Moreau',
      handle: provider === 'google' ? '@lucas_pitch' : '@claire_xg',
      email,
      salt: generateSalt(12),
      passwordHash: 'oauth_verified_provider',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      authProvider: provider,
      profile: {
        ...DEFAULT_USER_PROFILE,
        id: userId,
        username: provider === 'google' ? 'Lucas Laurent' : 'Claire Moreau',
        handle: provider === 'google' ? '@lucas_pitch' : '@claire_xg',
        email,
        isRegistered: true,
        fanScore: 1750,
        favoriteClubs: ['Arsenal', 'Paris Saint-Germain', 'Real Madrid'],
        badges: [`Verified ${provider === 'google' ? 'Google' : 'Apple'} ID`, 'Squad Captain'],
      },
    };
    saveAccountsDatabase([existing, ...accounts]);
  } else {
    existing.lastLoginAt = new Date().toISOString();
    existing.profile.isRegistered = true;
    saveAccountsDatabase(
      accounts.map((a) => (a.id === existing!.id ? existing! : a))
    );
  }

  const token = await issueSessionToken(existing.id, existing.email, true);
  return { account: existing, token };
}

export async function resetAccountPassword(
  email: string,
  newPassword: string
): Promise<{ ok: boolean; messageEn: string; messageFr: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return {
      ok: false,
      messageEn: 'New password must be at least 6 characters.',
      messageFr: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
    };
  }
  const accounts = loadAccountsDatabase();
  const target = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (!target) {
    return {
      ok: false,
      messageEn: 'No account found with that email address.',
      messageFr: 'Aucun compte associé à cette adresse e-mail.',
    };
  }
  const newSalt = generateSalt(16);
  const newHash = await hashPasswordWithSalt(newPassword, newSalt);
  const updated: StoredAccountRecord = {
    ...target,
    salt: newSalt,
    passwordHash: newHash,
  };
  saveAccountsDatabase(accounts.map((a) => (a.id === target.id ? updated : a)));
  return {
    ok: true,
    messageEn: 'Password updated! You can now sign in with your new password.',
    messageFr: 'Mot de passe mis à jour ! Vous pouvez maintenant vous connecter.',
  };
}
