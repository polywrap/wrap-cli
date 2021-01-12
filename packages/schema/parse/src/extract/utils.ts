import { ObjectDefinition } from "../typeInfo";

export function getObjectDefinition(
  value: string,
  objects: ObjectDefinition[]
): ObjectDefinition | void {
  for (const object of objects) {
    if (object.name === value) {
      return object;
    }
  }
}
