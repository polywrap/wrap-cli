import {
  createArrayDefinition,
  createObjectDefinition,
  createPropertyDefinition,
  createScalarDefinition,
  isScalarType,
  ObjectDefinition,
  PropertyDefinition,
} from "../typeInfo";

import { FieldDefinitionNode, NamedTypeNode } from "graphql";

export interface State {
  currentType?: ObjectDefinition;
  currentProperty?: PropertyDefinition | undefined;
  nonNullType?: boolean;
}

export function extractFieldDefinition(
  node: FieldDefinitionNode,
  state: State
): void {
  const importDef = state.currentType;

  if (!importDef) {
    return;
  }

  if (node.arguments && node.arguments.length > 0) {
    throw Error(
      `Imported types cannot have methods. See type "${importDef.name}"`
    );
  }

  const property = createPropertyDefinition({ type: "N/A", name: node.name.value });

  state.currentProperty = property;
  importDef.properties.push(property);
}

export function extractNamedType(node: NamedTypeNode, state: State): void {
  const property = state.currentProperty;

  if (!property) {
    return;
  }

  if (property.scalar) {
    return;
  }

  if (isScalarType(node.name.value)) {
    property.scalar = createScalarDefinition({
      name: property.name,
      type: node.name.value,
      required: state.nonNullType
    });
  } else {
    property.object = createObjectDefinition({
      name: property.name,
      type: node.name.value,
      required: state.nonNullType
    });
  }

  state.nonNullType = false;
}

export function extractListType(state: State): void {
  const property = state.currentProperty;

  if (!property) {
    return;
  }

  if (property.scalar) {
    return;
  }

  property.array = createArrayDefinition({
    name: property.name,
    type: "N/A",
    required: state.nonNullType
  });
  state.currentProperty = property.array;
  state.nonNullType = false;
}
