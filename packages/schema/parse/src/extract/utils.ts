import { ObjectDefinition } from "../typeInfo";

export function isObjectType(
  value: string,
  objects: ObjectDefinition[]
): boolean {
  for (const object of objects) {
    if (object.name === value) {
      return true;
    }
  }

  return false;
}
