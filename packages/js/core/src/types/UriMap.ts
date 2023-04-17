import { Uri } from "./Uri";

export class UriMap<TValue>
  implements Map<Uri, TValue>, ReadonlyUriMap<TValue> {
  private map: Map<string, TValue>;

  constructor(entries?: readonly (readonly [Uri, TValue])[]) {
    this.map = new Map<string, TValue>(entries?.map((x) => [x[0].uri, x[1]]));
  }

  clear(): void {
    this.map.clear();
  }

  delete(key: Uri): boolean {
    return this.map.delete(key.uri);
  }

  forEach(
    callbackfn: (value: TValue, key: Uri, map: Map<Uri, TValue>) => void,
    thisArg?: unknown
  ): void {
    this.map.forEach((v, k) => callbackfn(v, Uri.from(k), this), thisArg);
  }

  get(key: Uri): TValue | undefined {
    return this.map.get(key.uri);
  }

  has(key: Uri): boolean {
    return this.map.has(key.uri);
  }

  set(key: Uri, value: TValue): this {
    this.map.set(key.uri, value);

    return this;
  }

  get size(): number {
    return this.map.size;
  }

  [Symbol.toStringTag] = "UriMap";

  *entries(): IterableIterator<[Uri, TValue]> {
    for (const [k, v] of this.map.entries()) {
      yield [Uri.from(k), v];
    }
  }

  *keys(): IterableIterator<Uri> {
    for (const k of this.map.keys()) {
      yield Uri.from(k);
    }
  }

  values(): IterableIterator<TValue> {
    return this.map.values();
  }

  [Symbol.iterator](): IterableIterator<[Uri, TValue]> {
    return this.entries();
  }
}

export type ReadonlyUriMap<T> = ReadonlyMap<Uri, T>;
