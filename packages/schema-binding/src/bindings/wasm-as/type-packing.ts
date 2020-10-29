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
    public required?: boolean
  ) { }
  public last?: boolean
  public toMsgPack = Mapping.toMsgPack
  public toWasm = Mapping.toWasm
}

class CustomTypeDefinition extends TypeDefinition {
  properties: UnknownTypeDefinition[] = []
}

class UnknownTypeDefinition extends TypeDefinition {
  array?: ArrayDefinition
  scalar?: ScalarDefinition
}

class ScalarDefinition extends TypeDefinition {
  constructor(
    public type: string,
    public name: string,
    public required?: boolean
  ) {
    super(name, required);
  }
}

class ArrayDefinition extends UnknownTypeDefinition {
  constructor(
    public type: string,
    public name: string,
    public required?: boolean
  ) {
    super(name, required);
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

    property.scalar = new ScalarDefinition(
      node.name.value, property.name, state.nonNullType
    );
    state.currentUnknown = property.scalar;
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

    // TODO: add [...] around each type on the way up, resulting in [[UInt8]] at the top
    property.array = new ArrayDefinition(
      "[]", property.name, state.nonNullType
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
    const property = new UnknownTypeDefinition(
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
      config.types[numTypes - 1].last = true;

      if (numTypes - 2 > -1) {
        config.types[numTypes - 2].last = false;
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
  const write_scalar = fs.readFileSync(
    __dirname + "/type-packing.scalar.mustache", "utf-8"
  );
  const write_array = fs.readFileSync(
    __dirname + "/type-packing.array.mustache", "utf-8"
  );
  return Mustache.render(template, config, {
    write_scalar, write_array
  });
}
