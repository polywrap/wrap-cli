import { Nullable } from "@web3api/wasm-as";

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
  private readonly pq: Nullable<Key>[];
  private n: i32 = 0;
  private readonly compareTo: (left: Key, right: Key) => i32;

  constructor(comparator: (left: Key, right: Key) => i32, capacity: i32 = 8) {
    this.pq = new Array<Nullable<Key>>(capacity + 1);
    this.pq[0] = Nullable.fromNull();
    this.compareTo = comparator;
  }

  public toArray(): Key[] {
    return this.pq
      .filter((v: Nullable<Key>) => !v.isNull)
      .map((v: Nullable<Key>) => v.value);
  }

  public isEmpty(): boolean {
    return this.n == 0;
  }

  public length(): i32 {
    return this.n;
  }

  public insert(v: Key): void {
    this.pq[++this.n] = Nullable.fromValue(v);
    this.swim(this.n);
  }

  public delMax(): Key {
    const max: Key = this.pq[1].value;
    this.exch(1, this.n--);
    this.pq[this.n + 1] = Nullable.fromNull();
    this.sink(1);
    return max;
  }

  private less(i: i32, j: i32): boolean {
    return this.compareTo(this.pq[i].value, this.pq[j].value) < 0;
  }

  private exch(i: i32, j: i32): void {
    const t: Nullable<Key> = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = t;
  }

  private swim(k: i32): void {
    while (k > 1 && this.less(k / 2, k)) {
      this.exch(k / 2, k);
      k = k / 2;
    }
  }

  private sink(k: i32): void {
    while (2 * k <= this.n) {
      let j: i32 = 2 * k;
      if (j < this.n && this.less(j, j + 1)) j++;
      if (!this.less(k, j)) break;
      this.exch(k, j);
      k = j;
    }
  }
}
