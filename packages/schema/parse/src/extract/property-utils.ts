import {
  createScalarDefinition,
  createUnresolvedObjectOrUnionOrEnumRef,
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

  property.unresolvedObjectOrUnionOrEnum = createUnresolvedObjectOrUnionOrEnumRef(
    {
      name: name,
      type: type.type,
      required: type.required,
    }
  );
}
