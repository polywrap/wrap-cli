import {
  createScalarDefinition,
  createMapDefinition,
  createUnresolvedObjectOrEnumRef,
} from "../../abi";
import { isScalarType } from "../../abi/utils";

import { PropertyDefinition } from "@polywrap/wrap-manifest-types-js";

const toBoolean = (val: unknown) => !!val;

export function setPropertyType(
  property: PropertyDefinition,
  name: string,
  type: {
    type: string;
    required: boolean | undefined;
  }
): void {
  if (isScalarType(type.type)) {
    property.scalar = createScalarDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
    return;
  }

  if (type.type === "Map") {
    if (toBoolean(type.required) !== toBoolean(property.map?.required)) {
      throw new Error(
        `Map defined as ${
          type.required ? "required" : "optional"
        } while declaring type but defined as ${
          property.required ? "required" : "optional"
        } while annotating: ${property.type} in ${property.name}`
      );
    }

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
