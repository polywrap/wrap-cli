import {
  ArrayDefinition,
  PropertyDefinition,
  ScalarDefinition,
  Config,
  ImportDefinition,
  ImportTypeDefinition,
  MethodDefinition
} from "../types";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  visit,
  DirectiveNode
} from "graphql";

interface State {
  currentImport?: ImportTypeDefinition
  currentMethod?: MethodDefinition
  currentArgument?: PropertyDefinition
  currentReturn?: PropertyDefinition
  nonNullType?: boolean
}

const visitorEnter = (config: Config, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return
    }

    // Look for imports
    const importIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === "import"
    );

    if (importIndex !== -1) {
      const importDir = node.directives[importIndex];

      if (!importDir.arguments || importDir.arguments.length !== 3) {
        // TODO: Implement better error handling
        throw Error("Error: import directive missing arguments");
      }

      let namespace: string | undefined;
      let uri: string | undefined;

      for (const importArg of importDir.arguments) {
        if (importArg.name.value === "namespace") {
          if (importArg.value.kind === "StringValue") {
            namespace = importArg.value.value;
          } else {
            throw Error("Error: import namespace argument is not a string");
          }
        } else if (importArg.name.value === "uri") {
          // TODO: use a function for "extractString" to reduce code dup
          if (importArg.value.kind === "StringValue") {
            uri = importArg.value.value;
          } else {
            throw Error("Error: import uri argument is not a string");
          }
        }
      }

      if (!uri || !namespace) {
        throw Error("Error: import directive missing one of its required arguments (namespace, uri, types)");
      }

      let foundImportDef = false;

      for (const importDef of config.imports) {
        if (importDef.namespace === namespace) {
          importDef.uri = uri;
          foundImportDef = true;
          break;
        }
      }

      if (!foundImportDef) {
        config.imports.push(
          new ImportDefinition(uri, namespace)
        );
      }

      return;
    }

    // Look for imported_types
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === "imported_type"
    );

    if (importedIndex !== -1) {
      const importedDir = node.directives[importedIndex];

      if (!importedDir.arguments || importedDir.arguments.length !== 2) {
        // TODO: Implement better error handling
        throw Error("Error: imported_type directive missing arguments");
      }

      let namespace: string | undefined;
      let type: string | undefined;

      for (const importArg of importedDir.arguments) {
        if (importArg.name.value === "namespace") {
          if (importArg.value.kind === "StringValue") {
            namespace = importArg.value.value;
          } else {
            throw Error("Error: import namespace argument is not a string");
          }
        } else if (importArg.name.value === "type") {
          // TODO: use a function for "extractString" to reduce code dup
          if (importArg.value.kind === "StringValue") {
            type = importArg.value.value;
          } else {
            throw Error("Error: import type argument is not a string");
          }
        }
      }

      if (!type || !namespace) {
        throw Error("Error: import directive missing one of its required arguments (namespace, type)");
      }

      let foundImportDef = false;
      let importDefinition;

      for (const importDef of config.imports) {
        if (importDef.namespace === namespace) {
          importDefinition = importDef;
          foundImportDef = true;
          break;
        }
      }

      if (!foundImportDef) {
        importDefinition = new ImportDefinition("", namespace);
        config.imports.push(importDefinition);
      }

      if (!importDefinition) {
        throw Error("This should never happen.");
      }

      const importedType = new ImportTypeDefinition(node.name.value, node.name.value);
      importDefinition.types.push(importedType);
      state.currentImport = importedType;
    }
  },
  FieldDefinitionNode: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    if (!node.arguments || node.arguments.length === 0) {
      throw Error("Imported types must only have methods");
    }

    const method = new MethodDefinition(node.name.value);
    importDef.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinitionNode: (node: InputValueDefinitionNode) => {
    const method = state.currentMethod;

    if (!method) {
      return;
    }

    const argument = new PropertyDefinition(node.name.value);
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
      argument.scalar = new ScalarDefinition(
        argument.name, modifier + node.name.value, state.nonNullType
      );
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = new PropertyDefinition(
          method.name
        );
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }
      state.currentReturn.scalar = new ScalarDefinition(
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
      argument.array = new ArrayDefinition(
        argument.name, "TBD", state.nonNullType
      );
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = new PropertyDefinition(
          method.name
        );
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }

      state.currentReturn.array = new ArrayDefinition(
        method.name, "TBD", state.nonNullType
      );
      state.currentReturn = state.currentReturn.array;
      state.nonNullType = false;
    }
  },
});

const visitorLeave = (config: Config, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  FieldDefinitionNode: (node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinitionNode: (node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function visitImportedTypes(astNode: DocumentNode, config: Config) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(config, state),
    leave: visitorLeave(config, state)
  });
}
