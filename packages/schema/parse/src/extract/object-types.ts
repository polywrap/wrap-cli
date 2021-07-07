import {
  TypeInfo,
  ObjectDefinition,
  createObjectDefinition,
  createInterfaceImplementedDefinition,
} from "../typeInfo";
import {
  extractFieldDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./object-types-utils";

import {
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  DirectiveNode,
  ASTVisitor,
} from "graphql";

const visitorEnter = (objectTypes: ObjectDefinition[], state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    // Skip non-custom types
    if (node.name.value === "Query" || node.name.value === "Mutation") {
      return;
    }

    // Skip imported types
    if (
      node.directives &&
      node.directives.findIndex(
        (dir: DirectiveNode) => dir.name.value === "imported"
      ) > -1
    ) {
      return;
    }

    // Create a new TypeDefinition
    const type = createObjectDefinition({
      type: node.name.value,
      interfaces: node.interfaces?.map((x) =>
        createInterfaceImplementedDefinition({ type: x.name.value })
      ),
      comment: node.description?.value,
    });
    objectTypes.push(type);
    state.currentType = type;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    extractNamedType(node, state);
  },
  ListType: (_node: ListTypeNode) => {
    extractListType(state);
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    extractFieldDefinition(node, state);
  },
});

const visitorLeave = (state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    state.currentType = undefined;
  },
  FieldDefinition: (_node: FieldDefinitionNode) => {
    state.currentProperty = undefined;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export const getObjectTypesVisitor = (typeInfo: TypeInfo): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.objectTypes, state),
    leave: visitorLeave(state),
  };
};
