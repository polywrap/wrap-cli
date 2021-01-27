import {
  PropertyDefinition,
  TypeInfo,
  ImportedQueryDefinition,
  MethodDefinition,
  createImportedQueryDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  createScalarDefinition,
  createArrayDefinition
} from "../typeInfo";

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
} from "graphql";
import { directives } from "../validate/directives";

interface State {
  currentImport?: ImportedQueryDefinition
  currentMethod?: MethodDefinition
  currentArgument?: PropertyDefinition
  currentReturn?: PropertyDefinition
  nonNullType?: boolean
}

const visitorEnter = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return
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
    const mutationTest = typeName.substr(-queryIdentifier.length);

    if (queryTest !== queryIdentifier && mutationTest !== mutationIdentifier) {
      // Ignore imported types that aren't query types
      return;
    }

    const importedDir = node.directives[importedIndex];

    const { namespace, type, uri } = directives.imported.arguments(importedDir)

    const importedType = createImportedQueryDefinition(
      uri, namespace, typeName, type
    );
    typeInfo.importedQueryTypes.push(importedType);
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

    const operation = importDef.type === "Query" ? "query" : "mutation";
    const method = createMethodDefinition(operation, node.name.value);
    importDef.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    const method = state.currentMethod;

    if (!method) {
      return;
    }

    const argument = createPropertyDefinition(node.name.value);
    method.arguments.push(argument);
    state.currentArgument = argument;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;
    const modifier = state.nonNullType ? "" : "?";

    if (method && argument) {
      // Argument value
      argument.scalar = createScalarDefinition(
        argument.name, modifier + node.name.value, state.nonNullType
      );

      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = createPropertyDefinition(method.name);

        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }
      state.currentReturn.scalar = createScalarDefinition(
        method.name, modifier + node.name.value, state.nonNullType
      );
      state.nonNullType = false;
    }
  },
  ListType: (node: ListTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;

    if (method && argument) {
      // Argument value
      argument.array = createArrayDefinition(
        argument.name, "TBD", state.nonNullType
      );
      state.currentArgument = argument.array;
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = createPropertyDefinition(method.name);
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }

      state.currentReturn.array = createArrayDefinition(
        method.name, "TBD", state.nonNullType
      );
      state.currentReturn = state.currentReturn.array;
      state.nonNullType = false;
    }
  },
});

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function extractImportedQueryTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
