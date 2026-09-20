// Minimal structured logger. Deliberately never receives passwords, JWTs,
// or OAuth secrets — callers must not pass those in.
const time = () => new Date().toISOString();

export const logger = {
  info: (msg, meta = {}) => console.log(`[INFO] ${time()} ${msg}`, meta),
  warn: (msg, meta = {}) => console.warn(`[WARN] ${time()} ${msg}`, meta),
  error: (msg, meta = {}) => console.error(`[ERROR] ${time()} ${msg}`, meta),
};
