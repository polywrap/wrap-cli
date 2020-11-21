import {
  PropertyDefinition,
  TypeInfo,
  ImportedObjectDefinition,
  createImportedObjectDefinition,
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
  visit,
  DirectiveNode,
  ValueNode
} from "graphql";

interface State {
  currentImport?: ImportedObjectDefinition
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

    const queryIdentifier = "Query";
    const mutationIdentifier = "Mutation";

    if (node.name.value.substr(-queryIdentifier.length) === queryIdentifier || node.name.value.substr(-mutationIdentifier.length) === mutationIdentifier) {
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

    const importedType = createImportedObjectDefinition(uri, namespace, node.name.value, type);

    typeInfo.importedObjectTypes.push(importedType);
    state.currentImport = importedType;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    if (node.arguments && node.arguments.length > 0) {
      throw Error(`Imported types cannot have methods. See type "${importDef.name}"`);
    }

    const property = createPropertyDefinition(node.name.value);

    state.currentProperty = property;
    importDef.properties.push(property);
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    const property = state.currentProperty;

    if (!property) {
      return;
    }

    const modifier = state.nonNullType ? "" : "?";

    property.scalar = createScalarDefinition(
      property.name, modifier + node.name.value, state.nonNullType
    );
    state.nonNullType = false;
  },
  ListType: (node: ListTypeNode) => {
    const property = state.currentProperty;

    if (!property) {
      return;
    }

    if (property.scalar) {
      return;
    }

    property.array = createArrayDefinition(
      property.name, "TBD", state.nonNullType
    );
    state.currentProperty = property.array;
    state.nonNullType = false;
  },
});

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    state.currentProperty = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function extractImportedObjectTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
