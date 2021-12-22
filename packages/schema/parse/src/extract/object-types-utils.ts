import {
  createArrayDefinition,
  createPropertyDefinition,
  EnvironmentType,
  ObjectDefinition,
  PropertyDefinition,
} from "../typeInfo";
import { setPropertyType } from "./property-utils";

import { FieldDefinitionNode, NamedTypeNode } from "graphql";

export function isEnviromentType(type: string): boolean {
  return (
    type === EnvironmentType.QueryClientEnvType ||
    type === EnvironmentType.QueryEnvType ||
    type === EnvironmentType.MutationEnvType ||
    type === EnvironmentType.MutationClientEnvType
  );
}

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

  const property = createPropertyDefinition({
    type: "N/A",
    name: node.name.value,
    comment: node.description?.value,
  });

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

  if (!property.name) {
    throw Error(
      "extractNamedType: Invalid state. Uninitialized currentProperty, name not found.\n" +
        `Method: ${JSON.stringify(property, null, 2)}\nState: ${JSON.stringify(
          state,
          null,
          2
        )}`
    );
  }

  setPropertyType(property, property.name, {
    type: node.name.value,
    required: state.nonNullType,
  });

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
    required: state.nonNullType,
  });
  state.currentProperty = property.array;
  state.nonNullType = false;
}
