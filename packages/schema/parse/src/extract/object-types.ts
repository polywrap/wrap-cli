import {
  createObjectDefinition,
  createInterfaceImplementedDefinition,
  isEnvType,
} from "../abi";
import {
  extractFieldDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./utils/object-types-utils";
import { isModuleType } from "../abi/utils";

import {
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  DirectiveNode,
  ASTVisitor,
} from "graphql";
import { ObjectDefinition, WrapAbi } from "@polywrap/wrap-manifest-types-js";

const visitorEnter = (objectTypes: ObjectDefinition[], state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const typeName = node.name.value;

    // Skip non-custom types
    if (isModuleType(typeName) || isEnvType(typeName)) {
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

    const interfaces = node.interfaces?.map((x) =>
      createInterfaceImplementedDefinition({ type: x.name.value })
    );

    // Create a new TypeDefinition
    const type = createObjectDefinition({
      type: typeName,
      interfaces: interfaces?.length ? interfaces : undefined,
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
    state.nonNullType = undefined;
  },
});

export const getObjectTypesVisitor = (abi: WrapAbi): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(abi.objectTypes || [], state),
    leave: visitorLeave(state),
  };
};
