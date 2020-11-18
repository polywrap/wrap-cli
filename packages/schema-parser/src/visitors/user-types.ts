import {
  ArrayDefinition,
  UserTypeDefinition,
  PropertyDefinition,
  ScalarDefinition,
  AnyTypeDefinition,
  TypeInfo
} from "../types";

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
  currentType?: UserTypeDefinition
  currentUnknown?: AnyTypeDefinition
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
    const type = new UserTypeDefinition(
      node.name.value
    );
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

export function visitUserTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
