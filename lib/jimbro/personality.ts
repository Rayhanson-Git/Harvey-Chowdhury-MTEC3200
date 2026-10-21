import { phraseCatalog, type PhraseEvent, type Tone } from "./phrases.ts";
export type PhraseMemory = {
  recent: string[];
  bags: Record<string, string[]>;
  events: string[];
  lastAt: number;
};
export const emptyMemory = (): PhraseMemory => ({
  recent: [],
  bags: {},
  events: [],
  lastAt: 0,
});
export type PhraseContext = {
  tone: Tone;
  flirtation: boolean;
  history?: boolean;
  previous?: boolean;
  class?: boolean;
  deadline?: boolean;
  personalBest?: boolean;
  saved?: boolean;
  previousNotes?: boolean;
};
export function selectPhrase(
  event: PhraseEvent,
  eventId: string,
  context: PhraseContext,
  memory: PhraseMemory,
  now: number,
  random = Math.random,
  catalog: typeof phraseCatalog = phraseCatalog,
) {
  if (memory.events.includes(eventId)) return { memory, text: null, id: null };
  const next = structuredClone(memory);
  next.events = [...next.events, eventId].slice(-100);
  const urgent = ["error", "departure", "preparation", "warning"].includes(
    event,
  );
  if (!urgent && now - next.lastAt < 12000)
    return { memory: next, text: null, id: null };
  const rank = ["quiet", "encouraging", "playful", "unhinged"];
  const pool = catalog.filter(
    (p) =>
      p.event === event &&
      rank.indexOf(p.tone) <= rank.indexOf(context.tone) &&
      (!p.flirtatious || context.flirtation) &&
      p.requires.every((r) => context[r]),
  );
  if (!pool.length) return { memory: next, text: null, id: null };
  const key = `${event}:${context.tone}:${context.flirtation}`;
  let bag = (next.bags[key] || []).filter((id) =>
    pool.some((p) => p.id === id),
  );
  if (!bag.length) {
    bag = pool.map((p) => p.id);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.min(i, Math.max(0, Math.floor(random() * (i + 1))));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  let id = bag.find(
    (id) => !next.recent.slice(-Math.min(8, pool.length - 1)).includes(id),
  );
  if (!id)
    id = [...bag].sort(
      (a, b) => next.recent.lastIndexOf(a) - next.recent.lastIndexOf(b),
    )[0];
  next.bags[key] = bag.filter((x) => x !== id);
  next.recent = [...next.recent, id].slice(-50);
  next.lastAt = now;
  return { memory: next, text: pool.find((p) => p.id === id)!.text, id };
}
export const mascotPriority = {
  idle: 0,
  greeting: 1,
  ready: 2,
  rest: 3,
  set: 4,
  progress: 5,
  complete: 6,
  recovery: 7,
  warning: 8,
  preparation: 9,
  departure: 10,
  error: 11,
} as const;
export function chooseMascot(
  current: keyof typeof mascotPriority,
  next: keyof typeof mascotPriority,
  until: number,
  now: number,
) {
  return now >= until || mascotPriority[next] >= mascotPriority[current]
    ? next
    : current;
}
