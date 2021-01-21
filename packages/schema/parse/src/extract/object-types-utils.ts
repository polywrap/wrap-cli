import {
  createArrayDefinition,
  createPropertyDefinition,
  createScalarDefinition,
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

  const property = createPropertyDefinition(node.name.value);

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

  const modifier = state.nonNullType ? "" : "?";

  property.scalar = createScalarDefinition(
    property.name,
    modifier + node.name.value,
    state.nonNullType
  );
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

  property.array = createArrayDefinition(
    property.name,
    "TBD",
    state.nonNullType
  );
  state.currentProperty = property.array;
  state.nonNullType = false;
}
