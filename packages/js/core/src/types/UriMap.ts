import { Uri } from "./Uri";

export class UriMap<TValue> implements Map<Uri, TValue> {
  private map: Map<string, TValue>;

  constructor(iterable?: Iterable<[Uri, TValue]>) {
    this.map = new Map<string, TValue>();
    if (iterable) {
      for (let [k, v] of iterable) {
        this.set(k, v);
      }
    }
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
  
  delete(key: Uri): boolean {
    return this.map.delete(key.uri);
  }

  clear(): void {
    this.map.clear();
  }

  forEach(
    callbackfn: (value: TValue, key: Uri, map: Map<Uri, TValue>) => void,
    thisArg?: any
  ): void {
    this.map.forEach((v, k, m) => callbackfn(v, new Uri(k), this), thisArg);
  }

  get size(): number {
    return this.map.size;
  }

  [Symbol.toStringTag]: string = "UriMap";

  *entries(): IterableIterator<[Uri, TValue]> {
    for (let [k, v] of this.map.entries()) {
      yield [new Uri(k), v];
    }
  }
  
  *keys(): IterableIterator<Uri> {
    for (let x of this.map.keys()) {
      yield new Uri(x);
    }
  }
  
  values(): IterableIterator<TValue> {
    return this.map.values();
  }
  
  [Symbol.iterator](): IterableIterator<[Uri, TValue]> {
    return this.entries();
  }
}
