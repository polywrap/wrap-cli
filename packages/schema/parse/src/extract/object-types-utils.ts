import {
  createArrayDefinition,
  createPropertyDefinition,
  ObjectDefinition,
  PropertyDefinition,
} from "../typeInfo";
import { TypeDefinitions } from "./type-definitions";
import { setPropertyType } from "./utils";

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

  const property = createPropertyDefinition({
    type: "N/A",
    name: node.name.value,
  });

  state.currentProperty = property;
  importDef.properties.push(property);
}

export function extractNamedType(
  node: NamedTypeNode,
  state: State,
  typeDefinitions: TypeDefinitions
): void {
  const property = state.currentProperty;

  if (!property) {
    return;
  }

  if (property.scalar) {
    return;
  }

  setPropertyType(
    property,
    property.name as string,
    {
      type: node.name.value,
      required: state.nonNullType,
    },
    typeDefinitions
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

  property.array = createArrayDefinition({
    name: property.name,
    type: "N/A",
    required: state.nonNullType,
  });
  state.currentProperty = property.array;
  state.nonNullType = false;
}
