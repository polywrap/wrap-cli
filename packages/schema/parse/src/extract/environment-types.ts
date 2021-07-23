import {
  TypeInfo,
  createObjectDefinition,
  Environment,
  EnvironmentType,
} from "../typeInfo";
import {
  extractFieldDefinition,
  extractListType,
  extractNamedType,
  isEnviromentType,
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
  environment: {
    mutation: Environment;
    query: Environment;
  },
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (isEnviromentType(node.name.value)) {
      const type = createObjectDefinition({ type: node.name.value });

      if (node.name.value.includes(EnvironmentType.QueryClientEnvType)) {
        environment.query.client = type;
      } else if (node.name.value.includes(EnvironmentType.QueryEnvType)) {
        environment.query.sanitized = type;
      } else if (
        node.name.value.includes(EnvironmentType.MutationClientEnvType)
      ) {
        environment.mutation.client = type;
      } else {
        environment.mutation.sanitized = type;
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

export function getEnvironmentTypesVisitor(typeInfo: TypeInfo): ASTVisitor {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.environment, state),
    leave: visitorLeave(state),
  };
}
