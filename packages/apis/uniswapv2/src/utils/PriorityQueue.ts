/*
  Heap priority queue that sorts by max priority, determined by priority function comapareTo.
  compareTo is a sorting function that takes two values and returns:
    a negative number if left < right,
    a positive number if left > right,
    or zero if left = right.
  To sort by min priority, simply write compareTo to flip the sign of the result before returning.
  It is assumed that any mutations of Key don't change sort order.
*/
export class PriorityQueue<Key> {
  private readonly _pq: (Key | null)[];
  private _n: i32 = 0;
  private readonly _compareTo: (left: Key, right: Key) => i32;

  constructor(comparator: (left: Key, right: Key) => i32, capacity: i32 = 0) {
    this._pq = new Array<Key | null>(capacity + 1);
    this._pq[0] = null; // 0 index must be null for heap tree math
    this._compareTo = comparator;
  }

  public toArray(): Key[] {
    return this._pq
      .filter((v: Key | null) => v != null)
      .map<Key>((v: Key | null) => v!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  public isEmpty(): boolean {
    return this._n == 0;
  }

  public length(): i32 {
    return this._n;
  }

  public insert(v: Key): void {
    this._pq.push(v);
    this._swim(++this._n);
  }

  public delMax(): Key | null {
    if (this._n < 1) return null;
    const max: Key | null = this._pq[1];
    this._exch(1, this._n--);
    this._pq.pop();
    this._sink(1);
    return max;
  }

  private _less(i: i32, j: i32): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._compareTo(this._pq[i]!, this._pq[j]!) < 0;
  }

  private _exch(i: i32, j: i32): void {
    const t: Key | null = this._pq[i];
    this._pq[i] = this._pq[j];
    this._pq[j] = t;
  }

  private _swim(k: i32): void {
    while (k > 1 && this._less(k / 2, k)) {
      this._exch(k / 2, k);
      k = k / 2;
    }
  }

  private _sink(k: i32): void {
    while (2 * k <= this._n) {
      let j: i32 = 2 * k;
      if (j < this._n && this._less(j, j + 1)) j++;
      if (!this._less(k, j)) break;
      this._exch(k, j);
      k = j;
    }
  }
}
