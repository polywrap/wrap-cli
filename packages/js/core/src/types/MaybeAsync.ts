// $start: MaybeAsync.ts

/** Alias for a type that is either a value or a promise that resolves to the value */
export type MaybeAsync<T> = Promise<T> | T;

// $end
