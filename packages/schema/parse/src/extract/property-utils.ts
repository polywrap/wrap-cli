import {
  createScalarDefinition,
  createUnresolvedObjectOrEnumRef,
  isScalarType,
  PropertyDefinition,
} from "../typeInfo";

export function setPropertyType(
  property: PropertyDefinition,
  name: string,
  type: { type: string; required: boolean | undefined }
): void {
  if (isScalarType(type.type)) {
    property.scalar = createScalarDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
    return;
  }

  property.unresolvedObjectOrEnum = createUnresolvedObjectOrEnumRef({
    name: name,
    type: type.type,
    required: type.required,
  });
}
