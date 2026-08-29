// Centralized logger. Wraps console.* so Metro forwards native (iOS/Android)
// output to the terminal in dev. Web output lands in the browser devtools —
// intentional: a Metro HTTP bridge was rejected as over-engineering.
//
// Convention: pass sensitive values (tokens, passwords) through the `meta`
// object only. Redaction is *key-name* based, not value-based — anything
// interpolated into the `msg` string will NOT be scrubbed.

type Level = 'debug' | 'info' | 'warn' | 'error';
export type LogTag =
  | 'AUTH'
  | 'API'
  | 'MODAL'
  | 'STORE'
  | 'DELETE_ACCOUNT'
  | (string & {});
type Meta = Record<string, unknown> | undefined;

const EMOJI: Record<Level, string> = {
  debug: '🐛',
  info: 'ℹ️',
  warn: '⚠️',
  error: '🔴',
};

// All levels go through console.log intentionally. In React Native dev,
// console.error triggers a full-screen LogBox and console.warn triggers a
// yellow-box — both fire for every intentional log call, which is far too
// noisy for a general-purpose logger. Metro still forwards console.log to the
// terminal, and the 🔴/⚠️ emoji + tag make severity searchable. Actual
// crashes will still surface via React's own error boundaries.
const CONSOLE_FN: Record<Level, (...args: unknown[]) => void> = {
  debug: console.log.bind(console),
  info: console.log.bind(console),
  warn: console.log.bind(console),
  error: console.log.bind(console),
};

const REDACT_KEYS = new Set([
  'token',
  'password',
  'idtoken',
  'apptoken',
  'authorization',
]);

const timestamp = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
};

const safeMeta = (meta: Meta): Record<string, unknown> | undefined => {
  if (!meta) return undefined;
  const seen = new WeakSet<object>();
  const walk = (value: unknown): unknown => {
    if (value === null || typeof value !== 'object') return value;
    if (seen.has(value as object)) return '[Circular]';
    seen.add(value as object);
    if (Array.isArray(value)) return value.map(walk);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = REDACT_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : walk(v);
    }
    return out;
  };
  return walk(meta) as Record<string, unknown>;
};

const emit = (level: Level, tag: LogTag, msg: string, meta?: Meta) => {
  if (!__DEV__ && level !== 'warn' && level !== 'error') return;
  const line = `${EMOJI[level]} ${timestamp()} [${tag}] ${msg}`;
  const scrubbed = safeMeta(meta);
  if (scrubbed) CONSOLE_FN[level](line, scrubbed);
  else CONSOLE_FN[level](line);
};

export const log = {
  debug: (tag: LogTag, msg: string, meta?: Meta) => emit('debug', tag, msg, meta),
  info: (tag: LogTag, msg: string, meta?: Meta) => emit('info', tag, msg, meta),
  warn: (tag: LogTag, msg: string, meta?: Meta) => emit('warn', tag, msg, meta),
  error: (tag: LogTag, msg: string, meta?: Meta) => emit('error', tag, msg, meta),
};
