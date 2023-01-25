export class Queue<T> {
  private _elements: Record<string, T | undefined>;
  private _head: number;
  private _tail: number;

  constructor() {
    this._elements = {};
    this._head = 0;
    this._tail = 0;
  }

  enqueue(element: T): void {
    this._elements[this._tail] = element;
    this._tail++;
  }

  dequeue(): T | undefined {
    const item = this._elements[this._head];

    if (item === undefined) {
      return undefined;
    }

    delete this._elements[this._head];
    this._head++;

    return item;
  }

  peek(): T | undefined {
    return this._elements[this._head];
  }

  get length(): number {
    return this._tail - this._head;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }

  toArray(): T[] {
    const array: T[] = [];

    for (let i = this._head; i < this._tail; i++) {
      array.push(this._elements[i] as T);
    }

    return array;
  }
}
