export type MaybeAsync<T> = Promise<T> | T;

export const isPromise = (test: unknown): boolean => test && typeof (test as Promise<never>).then === "function";

export const executeMaybeAsyncFunction = async <TResult, TArgs extends []>(
  func: (...args: TArgs) => TResult | Promise<TResult>,
  ...args: TArgs
): Promise<TResult> => {
  let result = func(...args);
  if (isPromise(result)) {
    result = await result;
  }
  return result;
};
