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

export function indexOfArray(source: Uint8Array, search: Uint8Array): number {
  let run = true;
  let start = 0;

  while (run) {
    const idx = source.indexOf(search[0], start);

    // not found
    if (idx < start) {
      run = false;
      continue;
    }

    // Make sure the rest of the subarray contains the search pattern
    const subBuff = source.subarray(idx, idx + search.length);

    let retry = false;
    let i = 1;
    for (; i < search.length && !retry; ++i) {
      if (subBuff[i] !== search[i]) {
        retry = true;
      }
    }

    if (retry) {
      start = idx + i;
      continue;
    } else {
      return idx;
    }
  }

  return -1;
}
