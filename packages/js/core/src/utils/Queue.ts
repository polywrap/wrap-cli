export class Queue<T> {
  private elements: Record<string, T | undefined>;
  private head: number;
  private tail: number;

  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element: T) {
    this.elements[this.tail] = element;
    this.tail++;
  }

  dequeue(): T | undefined {
    const item = this.elements[this.head];

    if (item === undefined) {
      return undefined;
    }

    delete this.elements[this.head];
    this.head++;

    return item;
  }

  peek() {
    return this.elements[this.head];
  }

  get length() {
    return this.tail - this.head;
  }

  get isEmpty() {
    return this.length === 0;
  }

  toArray(): T[] {
    const array: T[] = [];

    for (let i = this.head; i < this.tail; i++) {
      array.push(this.elements[i] as T);
    }

    return array;
  }
}
