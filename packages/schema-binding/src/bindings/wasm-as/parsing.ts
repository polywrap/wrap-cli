import { Schema } from "../../";
import * as Mapping from "./mapping";
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

export class TypeDefinition {
  constructor(
    public name: string,
    public type?: string,
    public required?: boolean
  ) { }
  public last: boolean | null = null
  public first: boolean | null = null
  public toMsgPack = Mapping.toMsgPack
  public toWasm = Mapping.toWasm
}

export class CustomTypeDefinition extends TypeDefinition {
  properties: PropertyDefinition[] = []
}

export abstract class UnknownTypeDefinition extends TypeDefinition {
  array: ArrayDefinition | null = null
  scalar: ScalarDefinition | null = null

  public abstract setTypeName(): void;
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

export class PropertyDefinition extends UnknownTypeDefinition {
  public setTypeName(): void {
    if (this.array) {
      this.array.setTypeName();
    }
  }
}

export class ArrayDefinition extends UnknownTypeDefinition {
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

export interface Config {
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
    state.currentType = undefined;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    state.currentUnknown = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

const finalizeConfig = (config: Config) => {
  if (config.types.length > 0) {
    const types = config.types;
    types[0].first = true;
    types[types.length - 1].last = true;

    for (const type of types) {
      if (type.properties.length > 0) {
        const properties = type.properties;
        properties[0].first = true;
        properties[properties.length - 1].last = true;

        // Ensure all property names are set
        for (const prop of properties) {
          prop.setTypeName();
        }
      }
    }
  }
}

export function buildConfig(schema: Schema): Config {
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
  finalizeConfig(config);

  return config;
}