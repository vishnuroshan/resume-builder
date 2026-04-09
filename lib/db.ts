import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI environment variable is not defined. Add it to your .env.local file.",
  );
}

// ─── Global cache type augmentation ──────────────────────────────────────────
// Storing the connection on globalThis prevents connection exhaustion during
// Next.js hot module replacement, where modules are re-evaluated on every save.

declare global {
  var _mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

let connectionPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
  // In development, reuse the cached promise across HMR cycles.
  if (!globalThis._mongooseConnectionPromise) {
    globalThis._mongooseConnectionPromise = mongoose.connect(MONGODB_URI);
  }
  connectionPromise = globalThis._mongooseConnectionPromise;
} else {
  // In production, a fresh module instance is used per request — no caching needed.
  connectionPromise = mongoose.connect(MONGODB_URI);
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  return connectionPromise;
}

export { mongoose };
