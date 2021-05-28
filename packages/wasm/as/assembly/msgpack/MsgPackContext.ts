// Context is stores MsgPack serialization context in a stack, and prints it in a clear format

export class MsgPackContext {
  // array (stack)
  // push(string)
  // pop()
  // toString(): string
  //   "${stack[0]}:"
  //   "  ${stack[1]:"
  private description: string;
  private first: Node<string> | null = null;
  private n: i32 = 0;

  constructor(description: string = "") {
    this.description = description;
  }

  public isEmpty(): boolean {
    return this.first === null;
  }

  get length(): i32 {
    return this.n;
  }

  public push(item: string, type: string = ""): void {
    const oldfirst: Node<string> | null = this.first;
    this.first = new Node<string>(item, type, oldfirst);
    this.n++;
  }

  public pop(): string {
    if (this.isEmpty()) {
      throw new Error(
        "Null pointer exception: tried to pop an item from an empty Context stack"
      );
    }
    const item: string = this.first!.item;
    this.first = this.first!.next;
    this.n--;
    return item;
  }

  public toString(): string {
    let result = "Context: " + this.description;
    let tabs = 1;
    if (this.isEmpty()) {
      result += "\n".padEnd(14 + 2 * tabs, " ");
      result += "Context stack is empty or context was not set";
      return result;
    }
    let current: Node<string> | null = this.first;
    while (current !== null) {
      result += "\n".padEnd(14 + 2 * tabs++, " ");
      result += "at " + current.item + ": " + current.type;
      current = current.next;
    }
    return result;
  }
}

class Node<T> {
  item: T;
  type: string;
  next: Node<T> | null;

  constructor(item: T, type: string, next: Node<T> | null) {
    this.item = item;
    this.type = type;
    this.next = next;
  }
}
