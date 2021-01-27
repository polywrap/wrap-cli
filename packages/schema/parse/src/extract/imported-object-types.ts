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
} from "graphql";
import { directives } from "../validate/directives";

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

    const { namespace, type, uri } = directives.imported.arguments(importedDir)

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
