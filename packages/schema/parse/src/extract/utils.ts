import {
  createEnumDefinition,
  createObjectDefinition,
  createScalarDefinition,
  isScalarType,
  PropertyDefinition,
} from "../typeInfo";
import { TypeDefinitions } from "./type-definitions";

export function contains(item: string, items: string[]): boolean {
  return items.findIndex(
    (el: string) => el === item
  ) !== -1;
}

export function setPropertyType(
  property: PropertyDefinition,
  name: string,
  type: { type: string; required: boolean | undefined },
  typeDefinitions: TypeDefinitions
): void {
  if (isScalarType(type.type)) {
    property.scalar = createScalarDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else if (contains(type.type, typeDefinitions.enumTypes)) {
    property.enum = createEnumDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else if (contains(type.type, typeDefinitions.objectTypes)) {
    property.object = createObjectDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else {
    throw new Error(`Unsupported type ${type.type}`);
  }
}
