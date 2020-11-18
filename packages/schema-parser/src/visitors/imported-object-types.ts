import {
  ArrayDefinition,
  PropertyDefinition,
  ScalarDefinition,
  TypeInfo,
  ImportedQueryTypeDefinition,
  MethodDefinition, ImportedObjectTypeDefinition
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
  DirectiveNode,
  ValueNode
} from "graphql";

interface State {
  currentImport?: ImportedObjectTypeDefinition
  currentProperty?: PropertyDefinition
  nonNullType?: boolean
}

const visitorEnter = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return
    }

    // Look for imported
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === "imported"
    );

    if (importedIndex === -1) {
      return;
    }

    if (node.name.value == "Query" || node.name.value === "Mutation") {
      return;
    }

    const importedDir = node.directives[importedIndex];

    if (!importedDir.arguments || importedDir.arguments.length !== 3) {
      // TODO: Implement better error handling
      throw Error("Error: imported_type directive missing arguments");
    }

    let namespace: string | undefined;
    let uri: string | undefined;
    let type: string | undefined;

    const extractString = (value: ValueNode, name: string) => {
      if (value.kind === "StringValue") {
        return value.value;
      } else {
        throw Error(`Error: argument '${name}' must be a string`);
      }
    }

    for (const importArg of importedDir.arguments) {
      if (importArg.name.value === "namespace") {
        namespace = extractString(importArg.value, "namespace");
      } else if (importArg.name.value === "uri") {
        uri = extractString(importArg.value, "uri")
      } else if (importArg.name.value === "type") {
        type = extractString(importArg.value, "type")
      }
    }

    if (!type || !namespace || !uri) {
      throw Error("Error: import directive missing one of its required arguments (namespace, uri, type)");
    }

    const importedType = new ImportedObjectTypeDefinition(
      uri, namespace, node.name.value, type
    );
    typeInfo.importObjectTypes.push(importedType);
    state.currentImport = importedType;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    if (node.arguments) {
      throw Error("Imported types cannot have methods.");
    }

    const property = new PropertyDefinition(node.name.value);
    state.currentProperty = property;
    state.currentImport?.properties.push(property);
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    const modifier = state.nonNullType ? "" : "?";

    const property = state.currentProperty;

    if (!property) {
      return;
    }

    property.scalar = new ScalarDefinition(
      property.name, modifier + node.name.value, state.nonNullType
    )
    state.nonNullType = false;
  },
  ListType: (node: ListTypeNode) => {
    if (!state.currentProperty) {
      return;
    }

    state.currentProperty.array = new ArrayDefinition(
      state.currentProperty.name, "TBD", state.nonNullType
    )

    state.nonNullType = false;
  },
});

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function visitImportedObjectTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
