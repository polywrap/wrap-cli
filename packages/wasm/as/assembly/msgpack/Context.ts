// Context is stores MsgPack serialization context in a stack, and prints it in a clear format
// Warning: Context assumes its contents implement toString()

export class Context<T> {
  // array (stack)
  // push(string)
  // pop()
  // toString(): string
  //   "${stack[0]}:"
  //   "  ${stack[1]:"
  private first: Node<T> | null = null;
  private n: i32 = 0;

  public isEmpty(): boolean {
    return this.first === null;
  }

  public length(): i32 {
    return this.n;
  }

  public push(item: T, context = ""): void {
    const oldfirst: Node<T> | null = this.first;
    this.first = new Node<T>(item, context, oldfirst);
    this.n++;
  }

  public pop(): T {
    if (this.first === null) {
      throw new Error(
        "Null pointer exception: tried to pop an item from an empty Context stack"
      );
    }
    const item: T = this.first.item;
    this.first = this.first.next;
    this.n--;
    return item;
  }

  public toString(): string {
    if (this.first === null) {
      return "Context stack is empty.";
    }
    let tabs = 1;
    let current: Node<T> | null = this.first;
    // @ts-ignore
    let result = `${current.item.toString()}: ${current.description}`;
    while (current !== null) {
      // @ts-ignore
      result += "\n".padEnd(1 + 2 * tabs++, " ");
      result += `${current.item.toString()}: ${current.description}`;
      current = current.next;
    }
    return result;
  }
}

class Node<T> {
  item: T;
  description: string;
  next: Node<T> | null;

  constructor(item: T, context: string, next: Node<T> | null) {
    this.item = item;
    this.description = context;
    this.next = next;
  }
}
