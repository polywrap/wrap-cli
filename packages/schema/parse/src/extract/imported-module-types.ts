import {
  createImportedModuleDefinition,
  createInterfaceImplementedDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  ImportedModuleDefinition,
  TypeInfo,
} from "../typeInfo";
import { extractImportedDefinition } from "./imported-types-utils";
import {
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./module-types-utils";

import {
  ASTVisitor,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectTypeDefinitionNode,
} from "graphql";

const visitorEnter = (
  importedModuleTypes: ImportedModuleDefinition[],
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const imported = extractImportedDefinition(node, true);

    if (!imported) {
      return;
    }

    const dir =
      node.directives &&
      node.directives.find((dir) => dir.name.value === "enabled_interface");
    const isInterface = dir ? true : false;

    const importedType = createImportedModuleDefinition({
      type: node.name.value,
      uri: imported.uri,
      namespace: imported.namespace,
      nativeType: imported.nativeType,
      isInterface: isInterface,
      interfaces: node.interfaces?.map((x) =>
        createInterfaceImplementedDefinition({ type: x.name.value })
      ),
      comment: node.description?.value,
    });
    importedModuleTypes.push(importedType);
    state.currentImport = importedType;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    const returnType = createPropertyDefinition({
      type: "N/A",
      name: node.name.value,
    });

    const method = createMethodDefinition({
      type: importDef.nativeType,
      name: node.name.value,
      return: returnType,
      comment: node.description?.value,
    });
    importDef.methods.push(method);
    state.currentMethod = method;
    state.currentReturn = returnType;
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

export const getimportedModuleTypesVisitor = (
  typeInfo: TypeInfo
): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.importedModuleTypes, state),
    leave: visitorLeave(state),
  };
};
