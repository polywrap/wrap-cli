import {
  TypeInfo,
  ImportedObjectDefinition,
  createImportedObjectDefinition,
} from "../typeInfo";
import {
  extractFieldDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./object-types-utils";
import { extractImportedDefinition } from "./imported-types-utils";
import { TypeDefinitions } from "./type-definitions";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  visit,
} from "graphql";

const visitorEnter = (
  importedObjectTypes: ImportedObjectDefinition[],
  typeDefinitions: TypeDefinitions,
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
    });
    importedObjectTypes.push(importedType);
    state.currentType = importedType;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    extractNamedType(node, state, typeDefinitions);
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

export function extractImportedObjectTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo,
  typeDefinitions: TypeDefinitions
): void {
  const state: State = {};

  visit(astNode, {
    enter: visitorEnter(typeInfo.importedObjectTypes, typeDefinitions, state),
    leave: visitorLeave(state),
  });
}
