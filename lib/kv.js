import { Redis } from "@upstash/redis";

// Vercel's Upstash integration creates KV_REST_API_URL / KV_REST_API_TOKEN
// (not UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN), so we point the
// client at those explicitly instead of using Redis.fromEnv().
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Each date has its own key namespace so Aug 7/8/9 don't mix.
export function entriesKey(date) {
  return `entries:${date}`;
}

export async function getEntries(date) {
  const data = await redis.get(entriesKey(date));
  return data || {};
}

export async function saveEntry(date, sectionId, entry) {
  const all = await getEntries(date);
  if (!all[sectionId]) all[sectionId] = [];
  all[sectionId].push(entry);
  await redis.set(entriesKey(date), all);
  return all;
}

export async function deleteEntry(date, sectionId, entryId) {
  const all = await getEntries(date);
  if (all[sectionId]) {
    all[sectionId] = all[sectionId].filter((e) => e.id !== entryId);
    if (all[sectionId].length === 0) delete all[sectionId];
  }
  await redis.set(entriesKey(date), all);
  return all;
}
