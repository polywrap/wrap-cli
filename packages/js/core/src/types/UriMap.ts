import { Uri } from "./Uri";

const sanitizeUri = (uri: Uri | string) => {
  return Uri.from(uri).uri;
};

export type ReadonlyUriMap<TValue> = ReadonlyMap<Uri | string, TValue>;

export class UriMap<TValue>
  implements Map<Uri | string, TValue>, ReadonlyUriMap<TValue> {
  private _map: Map<string, TValue>;

  constructor(iterable?: Iterable<[Uri | string, TValue]>) {
    this._map = new Map<string, TValue>();
    if (iterable) {
      for (const [k, v] of iterable) {
        this.set(k, v);
      }
    }
  }

  get(key: Uri | string): TValue | undefined {
    return this._map.get(sanitizeUri(key));
  }

  has(key: Uri | string): boolean {
    return this._map.has(sanitizeUri(key));
  }

  set(key: Uri | string, value: TValue): this {
    this._map.set(sanitizeUri(key), value);

    return this;
  }

  delete(key: Uri | string): boolean {
    return this._map.delete(sanitizeUri(key));
  }

  clear(): void {
    this._map.clear();
  }

  forEach(
    callbackfn: (value: TValue, key: Uri, map: Map<Uri, TValue>) => void,
    thisArg?: unknown
  ): void {
    this._map.forEach((v, k) => callbackfn(v, Uri.from(k), this), thisArg);
  }

  get size(): number {
    return this._map.size;
  }

  [Symbol.toStringTag] = "UriMap";

  *entries(): IterableIterator<[Uri, TValue]> {
    for (const [k, v] of this._map.entries()) {
      yield [Uri.from(k), v];
    }
  }

  *keys(): IterableIterator<Uri> {
    for (const k of this._map.keys()) {
      yield Uri.from(k);
    }
  }

  values(): IterableIterator<TValue> {
    return this._map.values();
  }

  [Symbol.iterator](): IterableIterator<[Uri, TValue]> {
    return this.entries();
  }
}
