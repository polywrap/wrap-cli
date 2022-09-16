export type Result<T, E = undefined> =
  | { ok: true; value: T }
  | { ok: false; error: E | undefined };
