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
import { extractImportedDirectiveArgs } from "./directive-arguments";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  visit,
  DirectiveNode,
} from "graphql";

const visitorEnter = (
  importedObjectTypes: ImportedObjectDefinition[],
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return;
    }

    // Look for imported
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === "imported"
    );

    if (importedIndex === -1) {
      return;
    }

    const typeName = node.name.value;

    const queryIdentifier = "_Query";
    const queryTest = typeName.substr(-queryIdentifier.length);
    const mutationIdentifier = "_Mutation";
    const mutationTest = typeName.substr(-mutationIdentifier.length);

    if (queryTest === queryIdentifier || mutationTest === mutationIdentifier) {
      // Ignore query & mutation types
      return;
    }

    const importedDir = node.directives[importedIndex];

    const { namespace, uri, type: nativeType } = extractImportedDirectiveArgs(
      importedDir
    );

    const importedType = createImportedObjectDefinition({
      type: typeName,
      uri,
      namespace,
      nativeType,
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

export function extractImportedObjectTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  const state: State = {};

  visit(astNode, {
    enter: visitorEnter(typeInfo.importedObjectTypes, state),
    leave: visitorLeave(state),
  });
}
