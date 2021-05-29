// Context is stores MsgPack serialization context in a stack, and prints it in a clear format

export class Context {
  private description: string;
  private first: Node<string> | null = null;
  private n: i32 = 0;

  constructor(description: string = "context description not set") {
    this.description = description;
  }

  public isEmpty(): boolean {
    return this.first === null;
  }

  get length(): i32 {
    return this.n;
  }

  public push(item: string, type: string = "", info: string = ""): void {
    const oldfirst: Node<string> | null = this.first;
    this.first = new Node<string>(item, type, info, oldfirst);
    this.n++;
  }

  public pop(): string {
    if (this.isEmpty()) {
      throw new Error(
        "Null pointer exception: tried to pop an item from an empty Context stack"
      );
    }
    const item: string = this.first!.item;
    const type: string = this.first!.type;
    const info: string = this.first!.info;
    this.first = this.first!.next;
    this.n--;
    return item + ": " + type + (info == "" ? "" : " >> " + info);
  }

  public toString(): string {
    return this.printWithTabs();
  }

  public printWithContext(message: string): string {
    return message + "\n" + this.printWithTabs(1);
  }

  private printWithTabs(tabs: i32 = 0, size: i32 = 2): string {
    let result = "".padStart(size * tabs++, " ");
    result += "Context: " + this.description;
    if (this.isEmpty()) {
      result += "\n".padEnd(1 + size * tabs++, " ");
      result += "context stack is empty";
      return result;
    }
    let current: Node<string> | null = this.first;
    while (current !== null) {
      result += "\n".padEnd(1 + size * tabs++, " ");
      const info: string = current.info == "" ? "" : " >> " + current.info;
      result += "at " + current.item + ": " + current.type + info;
      current = current.next;
    }
    return result;
  }
}

class Node<T> {
  item: T;
  type: string;
  info: string;
  next: Node<T> | null;

  constructor(item: T, type: string, info: string, next: Node<T> | null) {
    this.item = item;
    this.type = type;
    this.info = info;
    this.next = next;
  }
}
