import {
  TypeInfo,
  ImportedQueryDefinition,
  createImportedQueryDefinition,
  createMethodDefinition,
} from "../typeInfo";
import {
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./query-types-utils";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  visit,
  DirectiveNode,
  ValueNode,
} from "graphql";

const visitorEnter = (
  importedQueryTypes: ImportedQueryDefinition[],
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return;
    }

    // Look for imported
    const importedDirective = "imported";
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === importedDirective
    );

    if (importedIndex === -1) {
      return;
    }

    const typeName = node.name.value;

    const queryIdentifier = "_Query";
    const queryTest = typeName.substr(-queryIdentifier.length);
    const mutationIdentifier = "_Mutation";
    const mutationTest = typeName.substr(-mutationIdentifier.length);

    if (queryTest !== queryIdentifier && mutationTest !== mutationIdentifier) {
      // Ignore imported types that aren't query types
      return;
    }

    const importedDir = node.directives[importedIndex];

    if (!importedDir.arguments || importedDir.arguments.length !== 3) {
      // TODO: Implement better error handling
      // https://github.com/Web3-API/prototype/issues/15
      throw Error(
        `The ${importedDirective} directive has incorrect arguments. See type "${typeName}"`
      );
    }

    let namespace: string | undefined;
    let uri: string | undefined;
    let nativeType: string | undefined;

    const extractString = (value: ValueNode, name: string) => {
      if (value.kind === "StringValue") {
        return value.value;
      } else {
        throw Error(`Error: argument '${name}' must be a string`);
      }
    };

    for (const importArg of importedDir.arguments) {
      if (importArg.name.value === "namespace") {
        namespace = extractString(importArg.value, "namespace");
      } else if (importArg.name.value === "uri") {
        uri = extractString(importArg.value, "uri");
      } else if (importArg.name.value === "type") {
        nativeType = extractString(importArg.value, "type");
      }
    }

    if (!nativeType || !namespace || !uri) {
      throw Error(
        "Error: import directive missing one of its required arguments (namespace, uri, type)"
      );
    }

    const importedType = createImportedQueryDefinition({
      type: typeName,
      uri,
      namespace,
      nativeType
    });
    importedQueryTypes.push(importedType);
    state.currentImport = importedType;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    if (!node.arguments || node.arguments.length === 0) {
      throw Error(
        `Imported Query types must only have methods. See property: ${node.name.value}`
      );
    }

    const method = createMethodDefinition({ type: importDef.nativeType, name: node.name.value });
    importDef.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    extractInputValueDefinition(node, state);
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
});

const visitorLeave = (state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  FieldDefinition: (_node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (_node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function extractImportedQueryTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  const state: State = {};

  visit(astNode, {
    enter: visitorEnter(typeInfo.importedQueryTypes, state),
    leave: visitorLeave(state),
  });
}
