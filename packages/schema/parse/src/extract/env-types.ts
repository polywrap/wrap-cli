import { Abi, isEnvType, createEnvDefinition } from "../abi";
import {
  extractFieldDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./utils/object-types-utils";

import {
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  ASTVisitor,
} from "graphql";

const visitorEnter = (abi: Abi, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const typeName = node.name.value;

    if (isEnvType(typeName)) {
      abi.envType = createEnvDefinition({});
      state.currentType = abi.envType;
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

export function getEnvVisitor(abi: Abi): ASTVisitor {
  const state: State = {};

  return {
    enter: visitorEnter(abi, state),
    leave: visitorLeave(state),
  };
}
