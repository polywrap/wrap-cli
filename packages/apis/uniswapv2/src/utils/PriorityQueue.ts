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
  private readonly pq: (Key | null)[];
  private n: i32 = 0;
  private readonly compareTo: (left: Key, right: Key) => i32;

  constructor(comparator: (left: Key, right: Key) => i32, capacity: i32 = 0) {
    this.pq = new Array<Key | null>(capacity + 1);
    this.pq[0] = null; // 0 index must be null for heap tree math
    this.compareTo = comparator;
  }

  public toArray(): Key[] {
    return this.pq
      .filter((v: Key | null) => v != null)
      .map<Key>((v: Key | null) => v!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  public isEmpty(): boolean {
    return this.n == 0;
  }

  public length(): i32 {
    return this.n;
  }

  public insert(v: Key): void {
    this.pq.push(v);
    this.swim(++this.n);
  }

  public delMax(): Key | null {
    if (this.n < 1) return null;
    const max: Key | null = this.pq[1];
    this.exch(1, this.n--);
    this.pq.pop();
    this.sink(1);
    return max;
  }

  private less(i: i32, j: i32): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.compareTo(this.pq[i]!, this.pq[j]!) < 0;
  }

  private exch(i: i32, j: i32): void {
    const t: Key | null = this.pq[i];
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
