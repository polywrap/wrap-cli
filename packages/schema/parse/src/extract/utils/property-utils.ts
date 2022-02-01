import {
  createScalarDefinition,
  createMapDefinition,
  createUnresolvedObjectOrEnumRef,
  isScalarType,
  PropertyDefinition,
} from "../../typeInfo";

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

  if (type.type.startsWith("Map")) {
    property.map = {
      ...createMapDefinition({
        type: type.type,
      }),
      ...property.map,
      name: name,
      required: type.required ? true : null,
    };
    return;
  }

  property.unresolvedObjectOrEnum = createUnresolvedObjectOrEnumRef({
    name: name,
    type: type.type,
    required: type.required,
  });
}
