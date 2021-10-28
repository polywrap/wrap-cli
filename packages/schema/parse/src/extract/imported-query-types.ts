import {
  TypeInfo,
  ImportedQueryDefinition,
  createImportedQueryDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  createInterfaceImplementedDefinition,
  QueryCapability,
  CapabilityType,
  InvokableModules,
} from "../typeInfo";
import {
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./query-types-utils";
import { extractImportedDefinition } from "./imported-types-utils";

import {
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ASTVisitor,
  StringValueNode,
  ListValueNode,
} from "graphql";

const visitorEnter = (
  importedQueryTypes: ImportedQueryDefinition[],
  state: State
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const imported = extractImportedDefinition(node, true);

    if (!imported) {
      return;
    }

    const importedType = createImportedQueryDefinition({
      type: node.name.value,
      uri: imported.uri,
      namespace: imported.namespace,
      nativeType: imported.nativeType,
      interfaces: node.interfaces?.map((x) =>
        createInterfaceImplementedDefinition({ type: x.name.value })
      ),
      capabilities:
        (node.directives
          ?.map((directive) => {
            if (directive.name.value === "capability") {
              const capability: Record<string, unknown> = {};
              directive.arguments?.forEach((argument) => {
                switch (argument.name.value) {
                  case "type": {
                    capability.type = (argument.value as StringValueNode)
                      .value as CapabilityType;
                    break;
                  }
                  case "modules": {
                    const modules: Record<InvokableModules, boolean> = {
                      query: false,
                      mutation: false,
                    };
                    const invokableModules = (argument.value as ListValueNode).values.map(
                      (module) => {
                        return (module as StringValueNode)
                          .value as InvokableModules;
                      }
                    );
                    invokableModules.forEach((module) => {
                      modules[module] = true;
                    });
                    capability.modules = modules;
                    break;
                  }
                  default: {
                    throw Error("Not implemented!");
                  }
                }
              });
              return capability
                ? ((capability as unknown) as QueryCapability)
                : undefined;
            }
            return undefined;
          })
          .filter(
            (capability) => capability !== undefined
          ) as QueryCapability[]) ?? [],
      comment: node.description?.value,
    });
    importedQueryTypes.push(importedType);
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

export const getImportedQueryTypesVisitor = (
  typeInfo: TypeInfo
): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.importedQueryTypes, state),
    leave: visitorLeave(state),
  };
};
