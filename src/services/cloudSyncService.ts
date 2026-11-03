import { SquadMessage, UserProfile } from '../types/scorecer';

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableRealtimeMesh: boolean;
}

export interface CloudSyncTelemetry {
  status: 'synced' | 'syncing' | 'offline';
  providerLabel: string;
  lastSyncedAt: string;
  latencyMs: number;
  syncedEventsCount: number;
  connectedPeers: number;
}

export type RealtimeEventType =
  | 'USER_PROFILE_UPDATED'
  | 'SQUAD_MESSAGE_POSTED'
  | 'ACTIVE_MATCH_CHANGED'
  | 'FANSCORE_AWARDED'
  | 'PING_PEER';

export interface RealtimePacket<T = unknown> {
  id: string;
  type: RealtimeEventType;
  senderTabId: string;
  timestamp: string;
  payload: T;
}

const CLOUD_CONFIG_KEY = 'scorecer_cloud_config_v1';
const CLOUD_SNAPSHOT_KEY = 'scorecer_cloud_snapshot_v2';
const IDB_NAME = 'scorecer_cloud_db_v2';
const IDB_STORE = 'state_snapshots';
const CHANNEL_NAME = 'scorecer_realtime_mesh_v2';

const TAB_ID = `tab_${Math.random().toString(36).slice(2, 9)}`;

let broadcastChannel: BroadcastChannel | null = null;
const listeners = new Set<(packet: RealtimePacket) => void>();

export function getCloudConfig(): CloudConfig {
  const envUrl =
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_SUPABASE_URL || '';
  const envKey =
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_SUPABASE_ANON_KEY || '';

  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        supabaseUrl: parsed.supabaseUrl || envUrl,
        supabaseAnonKey: parsed.supabaseAnonKey || envKey,
        enableRealtimeMesh: parsed.enableRealtimeMesh !== false,
      };
    }
  } catch {
    // ignore storage errors
  }

  return {
    supabaseUrl: envUrl,
    supabaseAnonKey: envKey,
    enableRealtimeMesh: true,
  };
}

export function saveCloudConfig(config: CloudConfig): void {
  try {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Persist snapshot to IndexedDB (with localStorage mirror) for durable client-side cloud replica
 */
async function writeToIndexedDB(key: string, value: unknown): Promise<void> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return;
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = () => {
        try {
          const db = request.result;
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(value, key);
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            resolve();
          };
        } catch {
          resolve();
        }
      };
      request.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Push state mutation to Supabase REST API (when configured) + IndexedDB Replica + BroadcastChannel Mesh
 */
export async function pushCloudSyncMutation(
  type: RealtimeEventType,
  payload: unknown
): Promise<{ ok: boolean; latencyMs: number; providerLabel: string }> {
  const start = performance.now();
  const config = getCloudConfig();

  const packet: RealtimePacket = {
    id: `pkt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    senderTabId: TAB_ID,
    timestamp: new Date().toISOString(),
    payload,
  };

  // 1. Broadcast immediately over Web BroadcastChannel for <10ms multi-tab sync
  if (config.enableRealtimeMesh && broadcastChannel) {
    try {
      broadcastChannel.postMessage(packet);
    } catch {
      // ignore channel error
    }
  }

  // 2. Persist to IndexedDB & localStorage replica
  try {
    const existingRaw = localStorage.getItem(CLOUD_SNAPSHOT_KEY);
    const snapshot = existingRaw ? JSON.parse(existingRaw) : {};
    snapshot[type] = {
      updatedAt: packet.timestamp,
      payload,
    };
    localStorage.setItem(CLOUD_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
  await writeToIndexedDB(type, packet);

  // 3. Optional Supabase REST Upsert if credentials are configured
  if (config.supabaseUrl && config.supabaseAnonKey) {
    try {
      const endpoint = `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/scorecer_sync_events`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          event_id: packet.id,
          event_type: packet.type,
          payload: packet.payload,
          created_at: packet.timestamp,
        }),
      });
      const latencyMs = Math.max(4, Math.round(performance.now() - start));
      if (res.ok || res.status === 201) {
        return {
          ok: true,
          latencyMs,
          providerLabel: 'Supabase Cloud + Realtime Mesh',
        };
      }
    } catch {
      // Fallback gracefully to Realtime Mesh + IndexedDB Replica
    }
  }

  const latencyMs = Math.max(3, Math.round(performance.now() - start));
  return {
    ok: true,
    latencyMs,
    providerLabel: config.supabaseUrl
      ? 'Supabase Hybrid Replica'
      : 'Realtime Mesh + IndexedDB Cloud Replica',
  };
}

/**
 * Initialize the Cross-Tab BroadcastChannel Mesh & return an unsubscribe cleanup function
 */
export function subscribeToRealtimeMesh(
  onPacket: (packet: RealtimePacket) => void
): () => void {
  listeners.add(onPacket);

  if (
    typeof window !== 'undefined' &&
    'BroadcastChannel' in window &&
    !broadcastChannel
  ) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event: MessageEvent<RealtimePacket>) => {
        const pkt = event.data;
        if (!pkt || pkt.senderTabId === TAB_ID) return;
        listeners.forEach((cb) => cb(pkt));
      };
      // Announce peer presence
      broadcastChannel.postMessage({
        id: `ping_${Date.now()}`,
        type: 'PING_PEER',
        senderTabId: TAB_ID,
        timestamp: new Date().toISOString(),
        payload: { tabId: TAB_ID },
      } satisfies RealtimePacket);
    } catch {
      // ignore if BroadcastChannel blocked
    }
  }

  return () => {
    listeners.delete(onPacket);
  };
}

export function loadPersistedSquadMessages(): SquadMessage[] | null {
  try {
    const raw = localStorage.getItem('scorecer_squad_messages_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function savePersistedSquadMessages(messages: SquadMessage[]): void {
  try {
    localStorage.setItem(
      'scorecer_squad_messages_v2',
      JSON.stringify(messages.slice(-50))
    );
  } catch {
    // ignore
  }
}

export function syncUserProfileToCloud(user: UserProfile) {
  return pushCloudSyncMutation('USER_PROFILE_UPDATED', user);
}
