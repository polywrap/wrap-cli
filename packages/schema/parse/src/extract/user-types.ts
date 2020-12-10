import {
  TypeInfo,
  AnyDefinition,
  ObjectDefinition,
  createObjectDefinition,
  createScalarDefinition,
  createArrayDefinition,
  createPropertyDefinition
} from "../typeInfo";

import {
  DocumentNode,
  TypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  visit,
  DirectiveNode
} from "graphql";

interface State {
  currentType?: ObjectDefinition
  currentUnknown?: AnyDefinition
  nonNullType?: boolean
}

const visitorEnter = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: TypeDefinitionNode) => {
    // Skip non-custom types
    if (node.name.value === "Query" || node.name.value === "Mutation") {
      return;
    }

    // Skip imported types
    if (node.directives && node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === "imported") > -1
    ) {
      return;
    }

    // Create a new TypeDefinition
    const type = createObjectDefinition(node.name.value);
    typeInfo.userTypes.push(type);
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

    property.scalar = createScalarDefinition(property.name, modifier + node.name.value, state.nonNullType);
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

    property.array = createArrayDefinition(
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

    if (node.arguments && node.arguments.length > 0) {
      throw Error(`Imported types cannot have methods. See type "${type.name}"`);
    }

    // Create a new property
    const property = createPropertyDefinition(node.name.value);

    state.currentUnknown = property;
    type.properties.push(property);
  }
});

const visitorLeave = (schemaInfo: TypeInfo, state: State) => ({
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

export function extractUserTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
