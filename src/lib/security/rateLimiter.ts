import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new redis instance if the environment variables are available.
// If they aren't (e.g. during build or local dev without keys), we'll mock it.
let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  }
} catch (error) {
  console.warn("Failed to initialize Upstash Redis, rate limiting will be bypassed");
}

// Helper to create limiters or return a mock if redis is unavailable
const createLimiter = (requests: number, windowString: string) => {
  if (!redis) {
    return {
      limit: async () => ({ success: true, pending: Promise.resolve(), limit: requests, remaining: requests, reset: 0 }),
    };
  }
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, windowString as any),
    analytics: true,
  });
};

// Define limiters per AGENT.md requirements
export const matchEventsLimiter = createLimiter(30, "1 m");
export const discoverSearchLimiter = createLimiter(20, "1 m");
export const aiLimiter = createLimiter(5, "1 m");
export const authLimiter = createLimiter(5, "15 m");
export const defaultLimiter = createLimiter(60, "1 m");
