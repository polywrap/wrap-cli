import { BaseTypes } from "../../validation";
import { FieldDefinitionNode, TypeDefinitionNode GraphQLSchema } from "graphql";

interface TypeProperty {
  type: BaseTypes
  name: string
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
  TypeDefinition: (node: TypeDefinitionNode) => {
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
      index: config.types.length
    };
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    if (!state.currentType) {
      return;
    }

    const type = config.types[state.currentType?.index];

    // TODO: handle all types NamedTypeNode, ListTypeNode, NonNullTypeNode

    if (node.type.kind !== "NamedType") {
      throw Error("TODO: Invalid property, document info (line number), output surrounding code from document?");
    }

    type.properties.push({
      name: node.name.value,
      type: node.type.name.value as BaseTypes
    });
  }
});

const visitorLeave = (config: MustacheConfig, state: VisitorState) => ({
  TypeDefinition: (node: TypeDefinitionNode) => {
    state.currentType = undefined;
  }
});

export function renderFile(schema: GraphQLSchema) {
  const config: MustacheConfig = {
    types: []
  };
  const state: VisitorState = { };

  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);
  const visitor = getVisitor(langauge, schema);
  const visitorResults = visit(astNode, {
    enter: visitorEnter(config, state),
    leave: visitorLeave(config, state)
  });

  mustache.render(template, visitorResults)
}
