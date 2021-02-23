import {
  createEnumDefinition,
  createObjectDefinition,
  createScalarDefinition,
  isScalarType,
  PropertyDefinition,
} from "../typeInfo";
import { Blackboard } from "./Blackboard";

export function setPropertyType(
  property: PropertyDefinition,
  name: string,
  type: { type: string; required: boolean | undefined },
  blackboard: Blackboard
): void {
  if (isScalarType(type.type)) {
    property.scalar = createScalarDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
    return;
  }

  // The type is not a known scalar, check to see if it's
  // apart of the custom types defined inside the schema (objects, enums)
  const customTypes = blackboard.getCustomTypes();
  const idx = customTypes.findIndex(
    (customType) => customType.name === type.type
  );

  if (idx === -1) {
    throw new Error(`Unsupported type ${type.type}`);
  }

  const customType = customTypes[idx];

  if (customType.type === "enum") {
    property.enum = createEnumDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else if (customType.type === "object") {
    property.object = createObjectDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else {
    throw new Error(`Unimplemented custom type ${customType}`);
  }
}
