import { mapKeyTypeSet, scalarTypeSet } from "../definitions";

export function isMapKeyType(type: string): boolean {
  return type in mapKeyTypeSet;
}

export const MODULE_NAME = "Module";

export function isModuleType(type: string): boolean {
  return type === MODULE_NAME;
}

export function isImportedModuleType(type: string): boolean {
  return type.endsWith(`_${MODULE_NAME}`);
}

export function isScalarType(type: string): boolean {
  return type in scalarTypeSet;
}
