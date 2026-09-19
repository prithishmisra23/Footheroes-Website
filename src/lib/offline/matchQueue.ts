import { MatchEvent } from "@/types";

export interface QueuedEvent {
  localId: string;
  matchId: string;
  eventData: Omit<MatchEvent, "id">;
  timestamp: number;
  synced: boolean;
}

const QUEUE_KEY = "foot_heroes_match_queue";

export function getOfflineQueue(): QueuedEvent[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(QUEUE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function queueEvent(matchId: string, eventData: Omit<MatchEvent, "id">): QueuedEvent {
  const queue = getOfflineQueue();
  const queuedEvent: QueuedEvent = {
    localId: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    matchId,
    eventData,
    timestamp: Date.now(),
    synced: false,
  };
  queue.push(queuedEvent);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return queuedEvent;
}

export function removeEventFromQueue(localId: string) {
  const queue = getOfflineQueue();
  const newQueue = queue.filter(e => e.localId !== localId);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
}

export async function syncQueue() {
  if (typeof window === "undefined" || !navigator.onLine) return;

  const queue = getOfflineQueue();
  const pending = queue.filter(e => !e.synced);

  if (pending.length === 0) return;

  console.log(`Syncing ${pending.length} offline events...`);

  // Simple sequential sync for MVP
  for (const event of pending) {
    try {
      // In a real implementation, we would POST to /api/match/events here
      // const res = await fetch("/api/match/events", { ... });
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // If successful, remove from queue
      removeEventFromQueue(event.localId);
      console.log(`Synced event ${event.localId}`);
    } catch (error) {
      console.error(`Failed to sync event ${event.localId}`, error);
      // Stop syncing on first error to maintain ordering
      break; 
    }
  }
}

// Add event listener for when the browser comes online
if (typeof window !== "undefined") {
  window.addEventListener("online", syncQueue);
}
