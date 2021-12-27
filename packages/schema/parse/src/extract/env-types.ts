import {
  TypeInfo,
  createObjectDefinition,
  EnvDefinition,
  isEnvType,
  isClientEnvType,
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
  ASTVisitor,
} from "graphql";

const visitorEnter = (
  envTypes: {
    query: EnvDefinition;
    mutation: EnvDefinition;
  },
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const typeName = node.name.value;

    if (isEnvType(typeName)) {
      const type = createObjectDefinition({ type: typeName });
      const envType = typeName.includes("Query") ? envTypes.query : envTypes.mutation;

      if (isClientEnvType(typeName)) {
        envType.client = type;
      } else {
        envType.sanitized = type;
      }

      state.currentType = type;
    }
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

export function getEnvVisitor(typeInfo: TypeInfo): ASTVisitor {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.envTypes, state),
    leave: visitorLeave(state),
  };
}
