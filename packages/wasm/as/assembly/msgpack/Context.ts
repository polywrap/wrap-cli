// Context stores debug information in a stack,
// and prints it in a clear format
export class Context {
  private _description: string;
  private _nodes: Array<Node> = [];

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  constructor(description: string = "context description not set") {
    this._description = description;
  }

  public isEmpty(): boolean {
    return this._nodes.length === 0;
  }

  get length(): i32 {
    return this._nodes.length;
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public push(item: string, type: string = "", info: string = ""): void {
    this._nodes.push({
      item,
      type,
      info,
    });
  }

  public pop(): string {
    if (this.isEmpty()) {
      throw new Error(
        "Null pointer exception: tried to pop an item from an empty Context stack"
      );
    }
    const node = this._nodes.pop();
    return (
      node.item + ": " + node.type + (node.info == "" ? "" : " >> " + node.info)
    );
  }

  public toString(): string {
    return this._printWithTabs();
  }

  public printWithContext(message: string): string {
    return message + "\n" + this._printWithTabs(1);
  }

  private _printWithTabs(tabs: i32 = 0, size: i32 = 2): string {
    let result = "".padStart(size * tabs++, " ");
    result += "Context: " + this._description;

    if (this.isEmpty()) {
      result += "\n".padEnd(1 + size * tabs++, " ");
      result += "context stack is empty";
      return result;
    }

    for (let i = this._nodes.length - 1; i >= 0; --i) {
      const node = this._nodes[i];
      const info: string = node.info == "" ? "" : " >> " + node.info;

      result += "\n".padEnd(1 + size * tabs++, " ");
      result += "at " + node.item + ": " + node.type + info;
    }

    return result;
  }
}

class Node {
  item: string;
  type: string;
  info: string;
}
