function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
assert.strictEqual = function (actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
  }
};
assert.ok = function (condition: unknown, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

import {
  MatchTelemetryStateSchema,
  buildMatchTelemetryState,
  authStore,
  promoteGuestToAuthenticated,
  resetToGuestAccount,
  uiPreferencesStore,
} from './stores/scorecerStores';
import {
  TELEMETRY_PROVIDER_PHASES,
  COMPETITOR_BENCHMARKS_2026,
  SLEEPER_OUTLIER_CALLOUT,
  buildPlayerRatingLedger,
} from './services/telemetryProviderAdapter';
import {
  INITIAL_MATCHES,
  INITIAL_MATCH_EVENTS,
  INITIAL_PLAYERS,
  FAN_REWARDS_STORE,
  INITIAL_SQUAD_MESSAGES,
  DEFAULT_USER_PROFILE,
} from './data/mockScorecerData';
import { LiveMatch, MatchStatus, SquadMessage } from './types/scorecer';

console.log('--- STARTING ARCHITECTURAL UPGRADE VERIFICATION TEST SUITE ---');

// TEST 1: Strict camelCase Schema Validation (ActivityKit JSONDecoder Parity)
console.log('Testing Test 1: MatchTelemetryStateSchema camelCase Enforcement...');
const activeMatch = INITIAL_MATCHES[0];
const samplePayload = buildMatchTelemetryState(activeMatch, INITIAL_MATCH_EVENTS);

const parseResult = MatchTelemetryStateSchema.safeParse(samplePayload);
assert.strictEqual(parseResult.success, true, 'Valid camelCase payload must pass ActivityKit validation');
assert.strictEqual(parseResult.snakeCaseViolations.length, 0, 'There must be zero snake_case violations');

// Test intentional snake_case rejection
const invalidPayload = {
  ...samplePayload,
  home_score: 2,
};
const invalidResult = MatchTelemetryStateSchema.safeParse(invalidPayload);
assert.strictEqual(invalidResult.success, false, 'Payload with snake_case keys must fail');
assert.ok(
  invalidResult.snakeCaseViolations.includes('home_score'),
  'Validator must specifically identify home_score as a snake_case violation'
);
console.log('✓ Test 1 Passed: ActivityKit strict camelCase schema validator passed & rejected snake_case.');

// TEST 2: Explainable ML Player Rating Delta Ledger for all 22 players
console.log('Testing Test 2: Rating Delta Ledger across all 22 pitch players...');
assert.strictEqual(INITIAL_PLAYERS.length >= 22, true, 'At least 22 players on the pitch');

for (const player of INITIAL_PLAYERS) {
  const ledger = buildPlayerRatingLedger(player, 78);
  assert.strictEqual(ledger.baseRating, 6.5, `Player ${player.name} base rating must be 6.50`);
  assert.ok(ledger.positiveContributions.length > 0, `Player ${player.name} must have positive contributions`);
  assert.ok(ledger.negativeDeductions.length > 0, `Player ${player.name} must have negative deductions`);
  assert.ok(ledger.sparkline.length > 0, `Player ${player.name} sparkline must not be empty`);
  assert.strictEqual(ledger.sparkline[0].minute, 0, 'Sparkline must start at minute 0');
  assert.strictEqual(ledger.sparkline[ledger.sparkline.length - 1].minute, 78, 'Sparkline must terminate at current minute');
}
console.log('✓ Test 2 Passed: All 22 players produce valid Explainable ML Rating Ledgers.');

// TEST 3: Telemetry Provider Tier Adapter & Dual-Lane Multiplexer Config
console.log('Testing Test 3: TelemetryProviderAdapter Phases & Dual-Lane specs...');
const p1 = TELEMETRY_PROVIDER_PHASES['PHASE_1_MVP'];
const p2 = TELEMETRY_PROVIDER_PHASES['PHASE_2_GROWTH'];
const p3 = TELEMETRY_PROVIDER_PHASES['PHASE_3_ENTERPRISE'];

assert.ok(p1 && p2 && p3, 'All 3 provider phases must exist');
assert.strictEqual(p3.scoutLaneLatencyMs, 185, 'Phase 3 Scout Lane latency must be <200ms');
assert.strictEqual(p3.analyticalSyncDelayMs, 2000, 'Phase 3 Opta Analytical Sync delay must be 2000ms');
assert.ok(p3.providers.some(p => p.includes('Stats Perform') || p.includes('Opta')), 'Phase 3 must include Opta');
assert.ok(p3.providers.some(p => p.includes('Sportradar')), 'Phase 3 must include Sportradar');
assert.ok(p3.providers.some(p => p.includes('RunningBall')), 'Phase 3 must include RunningBall');
console.log('✓ Test 3 Passed: TelemetryProviderAdapter 3 growth phases verified.');

// TEST 4: Competitor Benchmark Matrix & Sleeper Outlier Callout
console.log('Testing Test 4: Competitor Benchmarks and Sleeper outlier...');
const scorecerRow = COMPETITOR_BENCHMARKS_2026.find(b => b.isScorecer);
const flashscoreRow = COMPETITOR_BENCHMARKS_2026.find(b => b.platform === 'Flashscore');
const fotmobRow = COMPETITOR_BENCHMARKS_2026.find(b => b.platform === 'FotMob');
const tikiTakaRow = COMPETITOR_BENCHMARKS_2026.find(b => b.platform === 'Tiki Taka');
const sofaScoreRow = COMPETITOR_BENCHMARKS_2026.find(b => b.platform === 'SofaScore');

assert.strictEqual(scorecerRow?.latencySeconds, 0.7, 'Scorecer target latency is 0.7s');
assert.strictEqual(flashscoreRow?.latencySeconds, 0.8, 'Flashscore latency is 0.8s');
assert.strictEqual(fotmobRow?.latencySeconds, 1.0, 'FotMob latency is 1.0s');
assert.strictEqual(tikiTakaRow?.latencySeconds, 1.1, 'Tiki Taka latency is 1.1s');
assert.strictEqual(sofaScoreRow?.latencySeconds, 1.2, 'SofaScore latency is 1.2s');
assert.ok(SLEEPER_OUTLIER_CALLOUT.latencyLabel.includes('15-Min'), 'Sleeper outlier callout documents 15-min delay');
console.log('✓ Test 4 Passed: 2026 Competitor Benchmarks verified.');

// TEST 5: Apple Guideline 5.3.2 Non-Monetary FanScore Rewards
console.log('Testing Test 5: Apple Guideline 5.3.2 Compliance isolation...');
for (const reward of FAN_REWARDS_STORE) {
  assert.ok(reward.costPoints > 0, 'Reward cost must be in virtual points');
  assert.ok(!reward.title.toLowerCase().includes('cash') && !reward.title.toLowerCase().includes('dollar'), 'No cash-value rewards');
}
console.log('✓ Test 5 Passed: All FanScore rewards verified strictly non-monetary.');

// TEST 6: useAuthStore Guest Promotion & Reset Lifecycle
console.log('Testing Test 6: useAuthStore Guest Promotion & Reset Lifecycle...');
resetToGuestAccount();
assert.strictEqual(authStore.getState().isGuestAccount, true, 'Initial state must be a guest account');
assert.strictEqual(authStore.getState().jwtToken, null, 'Guest account must have null jwtToken');

const testProfile = {
  ...DEFAULT_USER_PROFILE,
  id: 'user-auth-test-77',
  username: 'BukayoThierry',
  email: 'bukayo@scorecer.test',
  favoriteClubs: ['Arsenal', 'Real Madrid'],
};
const testJwt = 'jwt-bearer-token-verification-xyz-2026';

promoteGuestToAuthenticated(testProfile, testJwt);
const authenticatedState = authStore.getState();
assert.strictEqual(authenticatedState.isGuestAccount, false, 'Promoted account must not be guest');
assert.strictEqual(authenticatedState.jwtToken, testJwt, 'Promoted account must possess valid JWT');
assert.ok(authenticatedState.promotedAtTimestamp !== null, 'Promoted timestamp must be recorded');
assert.ok(authenticatedState.favoriteClubs.includes('Arsenal'), 'Favorite clubs must persist');

// Test reset to guest
resetToGuestAccount();
const resetState = authStore.getState();
assert.strictEqual(resetState.isGuestAccount, true, 'Reset must return account to guest');
assert.strictEqual(resetState.jwtToken, null, 'Reset must clear jwtToken');
assert.strictEqual(resetState.promotedAtTimestamp, null, 'Reset must clear promoted timestamp');
console.log('✓ Test 6 Passed: Auth store guest promotion and reset verified.');

// TEST 7: Squad Sub-channel Segregation
console.log('Testing Test 7: Squad Sub-channel Segregation...');
assert.ok(INITIAL_SQUAD_MESSAGES.length > 0, 'Initial squad messages must exist');

const matchDayMessages = INITIAL_SQUAD_MESSAGES.filter(
  (m) => m.subChannel === 'match-day-thread' || m.channel === 'match-day-thread'
);
const generalBanterMessages = INITIAL_SQUAD_MESSAGES.filter(
  (m) => m.subChannel === 'general-banter' || m.channel === 'general-banter'
);
const pinnedWidgetMessages = INITIAL_SQUAD_MESSAGES.filter(
  (m) => m.subChannel === 'pinned-widgets' || m.channel === 'pinned-widgets'
);

assert.ok(matchDayMessages.length > 0, 'Match Day Thread messages must exist');
assert.ok(generalBanterMessages.length > 0, 'General Banter messages must exist');

// Verify no intersection between segregated sub-channels
for (const msg of matchDayMessages) {
  assert.ok(
    msg.subChannel !== 'general-banter',
    'Match Day message must not belong to general-banter'
  );
}
for (const msg of generalBanterMessages) {
  assert.ok(
    msg.subChannel !== 'match-day-thread',
    'General Banter message must not belong to match-day-thread'
  );
}

// Simulate sending a new message into pinned-widgets
const newWidgetMsg: SquadMessage = {
  id: 'msg-test-widget-pointer-1',
  squadId: 'squad-arsenal-london',
  author: 'Analyst Pro',
  authorHandle: '@tactical_pro',
  avatarColor: '#00F59B',
  text: 'Dropping live 60fps xG widget',
  timestamp: '78:45',
  channel: 'pinned-widgets',
  subChannel: 'pinned-widgets',
  isPro: true,
  reactions: [{ emoji: '🔥', count: 4 }],
  widget: {
    type: 'xg-chart',
    widgetType: 'xg-chart',
    title: 'Arsenal 1.84 xG Spike',
    subtitle: 'Rolling 5-min pressure',
    metricPrimary: '1.84 xG',
    metricSecondary: '+0.42 xG Delta',
    accentColor: '#00F59B',
    pointer: {
      widgetType: 'xg-chart',
      matchId: activeMatch.id,
      sharedAtMinute: 78,
    },
  },
};
assert.strictEqual(newWidgetMsg.subChannel, 'pinned-widgets', 'Sub-channel must be pinned-widgets');
assert.ok(newWidgetMsg.widget !== undefined, 'Widget must be attached');
console.log('✓ Test 7 Passed: Squad sub-channel segregation verified.');

// TEST 8: Instant Match Status Transition & ActivityKit Schema Parity
console.log('Testing Test 8: Instant Match Status Transitions...');
const testStatuses: LiveMatch['status'][] = ['UPCOMING', 'LIVE', 'HT', 'SUSPENDED', 'FT'];

for (const status of testStatuses) {
  const updatedMatch: LiveMatch = {
    ...activeMatch,
    status,
    minute: status === 'HT' ? 45 : status === 'FT' ? 90 : 78,
  };
  const telemetry = buildMatchTelemetryState(updatedMatch, INITIAL_MATCH_EVENTS);
  const validated = MatchTelemetryStateSchema.safeParse(telemetry);
  assert.strictEqual(validated.success, true, `Status ${status} must generate valid camelCase ActivityKit schema`);
  assert.strictEqual(validated.snakeCaseViolations.length, 0, `Zero snake_case violations on ${status}`);
}
console.log('✓ Test 8 Passed: Instant match status transitions verified.');

// TEST 9: Pure Tactical Mode & UI Preferences Store Isolation
console.log('Testing Test 9: Pure Tactical Mode & UI Preferences...');
uiPreferencesStore.setState({ pureTacticalMode: false });
assert.strictEqual(uiPreferencesStore.getState().pureTacticalMode, false, 'Pure tactical mode initially false');

uiPreferencesStore.setState((prev) => ({ ...prev, pureTacticalMode: true }));
assert.strictEqual(uiPreferencesStore.getState().pureTacticalMode, true, 'Pure tactical mode toggled true');

uiPreferencesStore.setState((prev) => ({ ...prev, pureTacticalMode: false }));
assert.strictEqual(uiPreferencesStore.getState().pureTacticalMode, false, 'Pure tactical mode toggled false');

// Verify notification filters
assert.strictEqual(
  uiPreferencesStore.getState().notificationFilters.varReviews,
  true,
  'Mandatory varReviews notification filter must default to true'
);
console.log('✓ Test 9 Passed: Pure Tactical Mode and UI preferences verified.');

console.log('--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
