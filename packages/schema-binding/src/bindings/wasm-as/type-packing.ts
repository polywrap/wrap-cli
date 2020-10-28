import { BaseTypes, Schema } from "../../";
import fs from "fs";
import { printSchemaWithDirectives } from "graphql-tools";
import {
  FieldDefinitionNode,
  TypeDefinitionNode,
  parse,
  visit
} from "graphql";
const Mustache = require("mustache");

interface TypeProperty {
  type: BaseTypes
  name: string
  complexType: boolean
}

interface CustomType {
  name: string
  last: boolean
  properties: TypeProperty[]
}

interface MustacheConfig {
  types: CustomType[]
}

interface VisitorState {
  currentType?: {
    name: string;
    index: number;
  }
}


const visitorEnter = (config: MustacheConfig, state: VisitorState) => ({
  ObjectTypeDefinition: (node: TypeDefinitionNode) => {
    if (config.types.length) {
      config.types[config.types.length-1].last = false;
    }
    config.types.push({
      name: node.name.value,
      last: true,
      properties: []
    });
    state.currentType = {
      name: node.name.value,
      index: config.types.length - 1
    };
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    if (!state.currentType) {
      return;
    }

    const type = config.types[state.currentType?.index];

    let typeName: string | undefined;

    if (node.type.kind === "NamedType") {
      typeName = node.type.name.value;
    } else if (node.type.kind === "ListType") {
      // TODO: support lists
    } else if (node.type.kind === "NonNullType") {
      if (node.type.type.kind === "NamedType") {
        typeName = node.type.type.name.value;
      }
    }

    if (!typeName) {
      // TODO: error reporting? Is it necessary?
      return;
    }

    type.properties.push({
      name: node.name.value,
      type: typeName as BaseTypes,
      complexType: false
    });
  }
});

const visitorLeave = (config: MustacheConfig, state: VisitorState) => ({
  TypeDefinition: (node: TypeDefinitionNode) => {
    state.currentType = undefined;
  },
  FieldDefinition: (node: FieldDefinitionNode) => { }
});

export function render(schema: Schema): string {
  const config: MustacheConfig = {
    types: []
  };
  const state: VisitorState = { };

  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);
  visit(astNode, {
    enter: visitorEnter(config, state),
    leave: visitorLeave(config, state)
  });

  const template = fs.readFileSync(
    __dirname + "/type-packing.mustache", 'utf-8'
  );
  return Mustache.render(template, config)
}
