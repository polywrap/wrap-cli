import { ScalarDefinition } from "@polywrap/wrap-manifest-types-js";

export function isMapKeyType(type: string): boolean {
  return type in ScalarDefinition["type"];
}

export const MODULE_NAME = "Module";

export function isModuleType(type: string): boolean {
  return type === MODULE_NAME;
}

export function isImportedModuleType(type: string): boolean {
  return type.endsWith(`_${MODULE_NAME}`);
}

export function isScalarType(type: string): boolean {
  return type in scalarTypes;
}

// Need to hardcode because
// https://stackoverflow.com/questions/64048938/extract-value-from-type-constant-in-typescript
// export const scalarTypeNames = Object.keys(scalarTypes);
