import { setFirstLast } from "./utils";

type ModifyTypeMethod = (type: TypeDefinition) => TypeDefinition;

export abstract class TypeDefinition {
  constructor(
    public name: string,
    public type?: string,
    public required?: boolean
  ) { }
  public last: boolean | null = null
  public first: boolean | null = null

  public finalize(modify?: ModifyTypeMethod): void { }
}

export class ObjectTypeDefinition extends TypeDefinition {
  properties: PropertyDefinition[] = []

  public finalize(modify?: ModifyTypeMethod) {
    setFirstLast(this.properties);

    for (let i = 0; i < this.properties.length; ++i) {
      this.properties[i] = modify ? modify(this.properties[i]) as PropertyDefinition : this.properties[i];
      this.properties[i].setTypeName();
      this.properties[i].finalize(modify);
    }
  }
}

export abstract class AnyTypeDefinition extends TypeDefinition {
  array: ArrayDefinition | null = null
  scalar: ScalarDefinition | null = null

  public abstract setTypeName(): void;

  public finalize(modify?: ModifyTypeMethod) {
    if (this.array) {
      this.array = modify ? modify(this.array) as ArrayDefinition : this.array;
    }
    if (this.scalar) {
      this.scalar = modify ? modify(this.scalar) as ScalarDefinition : this.scalar;
    }
  }
}

export class ScalarDefinition extends TypeDefinition {
  constructor(
    public name: string,
    public type: string,
    public required?: boolean
  ) {
    super(name, type, required);
  }
}

export class PropertyDefinition extends AnyTypeDefinition {
  public setTypeName(): void {
    if (this.array) {
      this.array.setTypeName();
      this.type = this.array.type;
      this.required = this.array.required;
    } else if (this.scalar) {
      this.type = this.scalar.type;
      this.required = this.scalar.required;
    }
  }
}

export class ArrayDefinition extends AnyTypeDefinition {
  constructor(
    public name: string,
    public type: string,
    public required?: boolean
  ) {
    super(name, type, required);
  }

  public get item(): TypeDefinition {
    if (!this.array && !this.scalar) {
      throw Error("Array hasn't been configured yet");
    }

    if (this.array) {
      return this.array;
    } else {
      // @ts-ignore
      return this.scalar;
    }
  }

  public setTypeName(): void {
    let baseTypeFound = false;
    let array: ArrayDefinition = this;

    while (!baseTypeFound) {
      if (array.array) {
        array = array.array;
        array.setTypeName();
      } else if (array.scalar) {
        baseTypeFound = true;
      }
    }

    const modifier = this.required ? "" : "?";
    this.type = modifier + "[" + this.item.type + "]";
  }
}

export class MethodDefinition extends TypeDefinition {
  constructor(
    public operation: "query" | "mutation",
    name: string,
    type?: string,
    required?: boolean
  ) {
    super(name, type, required);
  }

  arguments: PropertyDefinition[] = []
  return: PropertyDefinition | null = null;

  public finalize(modify?: ModifyTypeMethod) {
    setFirstLast(this.arguments);

    for (let i = 0; i < this.arguments.length; ++i) {
      this.arguments[i] = modify ? modify(this.arguments[i]) as PropertyDefinition : this.arguments[i];
      this.arguments[i].setTypeName();
      this.arguments[i].finalize(modify);
    }

    this.return?.setTypeName();
  }
}

export class QueryTypeDefinition extends TypeDefinition {
  methods: MethodDefinition[] = []

  public finalize(modify?: ModifyTypeMethod) {
    setFirstLast(this.methods);

    for (let i = 0; i < this.methods.length; ++i) {
      this.methods[i] = modify ? modify(this.methods[i]) as MethodDefinition : this.methods[i];
      this.methods[i].finalize(modify);
    }
  }
}

export class ImportedQueryTypeDefinition extends QueryTypeDefinition {
  constructor(
    public uri: string,
    public namespace: string,
    name: string,
    type: string
  ) {
    super(name, type);
  }
}

export class ImportedObjectTypeDefinition extends ObjectTypeDefinition {
  constructor(
    public uri: string,
    public namespace: string,
    name: string,
    type: string
  ) {
    super(name, type);
  }
}
