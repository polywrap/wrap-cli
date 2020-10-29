import { Schema } from "../../";
import * as Mapping from "./mapping";
import fs from "fs";
import { printSchemaWithDirectives } from "graphql-tools";
import {
  FieldDefinitionNode,
  TypeDefinitionNode,
  parse,
  visit,
  NamedTypeNode,
  NonNullTypeNode,
  ListTypeNode
} from "graphql";
const Mustache = require("mustache");

class TypeDefinition {
  constructor(
    public name: string,
    public type?: string,
    public required?: boolean
  ) { }
  public last?: boolean
  public toMsgPack = Mapping.toMsgPack
  public toWasm = Mapping.toWasm
}

class CustomTypeDefinition extends TypeDefinition {
  properties: UnknownTypeDefinition[] = []
}

abstract class UnknownTypeDefinition extends TypeDefinition {
  array: ArrayDefinition | null = null
  scalar: ScalarDefinition | null = null

  public abstract setTypeName(): void;
}

class ScalarDefinition extends TypeDefinition {
  constructor(
    public name: string,
    public type: string,
    public required?: boolean
  ) {
    super(name, type, required);
  }
}

class PropertyDefinition extends UnknownTypeDefinition {
  public setTypeName(): void {
    if (this.array) {
      this.array.setTypeName();
    }
  }
}

class ArrayDefinition extends UnknownTypeDefinition {
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
    let arrayCount = 1;
    let baseType = "";
    let baseTypeFound = false;
    let array: ArrayDefinition = this;

    while (!baseTypeFound) {
      if (array.array) {
        array = array.array;
        array.setTypeName();
      } else if (array.scalar) {
        baseType = array.scalar.type;
        baseTypeFound = true;
      }
    }

    const modifier = this.required ? "" : "?";
    this.type = modifier + "[" + this.item.type + "]";
  }
}

interface Config {
  types: CustomTypeDefinition[]
}

interface State {
  currentType?: CustomTypeDefinition
  currentUnknown?: UnknownTypeDefinition
  nonNullType?: boolean
}

const visitorEnter = (config: Config, state: State) => ({
  ObjectTypeDefinition: (node: TypeDefinitionNode) => {
    // Create a new TypeDefinition
    const type = new CustomTypeDefinition(
      node.name.value
    );
    config.types.push(type);
    state.currentType = type;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    const property = state.currentUnknown;

    if (!property) {
      return;
    }

    if (property.scalar) {
      return;
    }

    const modifier = state.nonNullType ? "" : "?";

    property.scalar = new ScalarDefinition(
      property.name, modifier + node.name.value, state.nonNullType
    );
    state.nonNullType = false;
  },
  ListType: (node: ListTypeNode) => {
    const property = state.currentUnknown;

    if (!property) {
      return;
    }

    if (property.scalar) {
      return;
    }

    // Array type names will be set within the visitorLeave
    property.array = new ArrayDefinition(
      property.name, "TBD", state.nonNullType
    );
    state.currentUnknown = property.array;
    state.nonNullType = false;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const type = state.currentType;

    if (!type) {
      return;
    }

    // Create a new property
    const property = new PropertyDefinition(
      node.name.value
    )

    state.currentUnknown = property;
    type.properties.push(property);
  }
});

const visitorLeave = (config: Config, state: State) => ({
  ObjectTypeDefinition: (node: TypeDefinitionNode) => {
    const numTypes = config.types.length;

    if (numTypes > 0) {
      const latestType = config.types[numTypes - 1];

      // Set the "last" boolean within the type definition
      latestType.last = true;

      // Unset the previous "last"
      if (numTypes - 2 > -1) {
        config.types[numTypes - 2].last = false;
      }

      // Ensure all property names are set
      for (const prop of latestType.properties) {
        prop.setTypeName();
      }
    }

    state.currentType = undefined;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    state.currentUnknown = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function render(schema: Schema): string {
  const config: Config = {
    types: []
  };

  const state: State = { };

  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);
  visit(astNode, {
    enter: visitorEnter(config, state),
    leave: visitorLeave(config, state)
  });

  const template = fs.readFileSync(
    __dirname + "/type-packing.mustache", 'utf-8'
  );
  const write_array_item = fs.readFileSync(
    __dirname + "/type-packing.array-item.mustache", "utf-8"
  );
  return Mustache.render(template, config, {
    write_array_item
  });
}
