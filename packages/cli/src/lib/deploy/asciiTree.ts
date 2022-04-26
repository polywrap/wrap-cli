//  https://github.com/aws/jsii/blob/main/packages/oo-ascii-tree/lib/ascii-tree.ts

export class AsciiTree {
  public parent?: AsciiTree;

  private readonly _children = new Array<AsciiTree>();

  public constructor(public readonly text?: string, ...children: AsciiTree[]) {
    for (const child of children) {
      this.add(child);
    }
  }

  public printTree(output: Printer = process.stdout): void {
    let ancestorsPrefix = "";

    for (const parent of this.ancestors) {
      if (parent.level <= 0) {
        continue;
      }

      if (parent.last) {
        ancestorsPrefix += "  ";
      } else {
        ancestorsPrefix += " │";
      }
    }

    let myPrefix = "";
    let multilinePrefix = "";
    if (this.level > 0) {
      if (this.last) {
        if (!this.empty) {
          myPrefix += " └─┬ ";
          multilinePrefix += " └─┬ ";
        } else {
          myPrefix += " └── ";
          multilinePrefix = "     ";
        }
      } else {
        if (!this.empty) {
          myPrefix += " ├─┬ ";
          multilinePrefix += " │ │ ";
        } else {
          myPrefix += " ├── ";
          multilinePrefix += " │   ";
        }
      }
    }

    if (this.text) {
      output.write(ancestorsPrefix);
      output.write(myPrefix);
      const lines = this.text.split("\n");
      output.write(lines[0]);
      output.write("\n");

      for (const line of lines.splice(1)) {
        output.write(ancestorsPrefix);
        output.write(multilinePrefix);
        output.write(line);
        output.write("\n");
      }
    }

    for (const child of this._children) {
      child.printTree(output);
    }
  }

  public toString(): string {
    let out = "";
    const printer: Printer = {
      write: (data: Uint8Array | string) => {
        out += data;
        return true;
      },
    };
    this.printTree(printer);
    return out;
  }

  public add(...children: AsciiTree[]): void {
    for (const child of children) {
      child.parent = this;
      this._children.push(child);
    }
  }

  public get children(): AsciiTree[] {
    return this._children.map((x) => x);
  }

  public get root(): boolean {
    return !this.parent;
  }

  public get last(): boolean {
    if (!this.parent) {
      return true;
    }
    return (
      this.parent.children.indexOf(this) === this.parent.children.length - 1
    );
  }

  public get level(): number {
    if (!this.parent) {
      return this.text ? 0 : -1;
    }

    return this.parent.level + 1;
  }

  public get empty(): boolean {
    return this.children.length === 0;
  }

  public get ancestors(): AsciiTree[] {
    if (!this.parent) {
      return [];
    }

    return [...this.parent.ancestors, this.parent];
  }
}

export type Printer = Pick<NodeJS.WritableStream, "write">;
