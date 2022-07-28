import {
  createImportedObjectDefinition,
  createInterfaceImplementedDefinition,
} from "../abi";
import {
  extractFieldDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./utils/object-types-utils";
import { extractImportedDefinition } from "./utils/imported-types-utils";

import {
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  ASTVisitor,
} from "graphql";
import {
  ImportedObjectDefinition,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";

const visitorEnter = (
  importedObjectTypes: ImportedObjectDefinition[],
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const imported = extractImportedDefinition(node);

    if (!imported) {
      return;
    }

    const importedType = createImportedObjectDefinition({
      type: node.name.value,
      uri: imported.uri,
      namespace: imported.namespace,
      nativeType: imported.nativeType,
      interfaces: node.interfaces?.map((x) =>
        createInterfaceImplementedDefinition({ type: x.name.value })
      ),
      comment: node.description?.value,
    });
    importedObjectTypes.push(importedType);
    state.currentType = importedType;
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

export const getImportedObjectTypesVisitor = (abi: WrapAbi): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(abi.importedObjectTypes || [], state),
    leave: visitorLeave(state),
  };
};
