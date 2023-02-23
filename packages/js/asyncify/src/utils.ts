export type MaybeAsync<T> = Promise<T> | T;

export function isPromise<T extends unknown>(
  test?: MaybeAsync<T>
): test is Promise<T> {
  return !!test && typeof (test as Promise<T>).then === "function";
}

export function proxyGet<T extends Record<string, unknown>>(
  obj: T,
  transform: (value: unknown, name: string) => unknown
): T {
  return new Proxy<T>(obj, {
    get: (obj: T, name: string) => {
      return transform(obj[name], name);
    },
  });
}
