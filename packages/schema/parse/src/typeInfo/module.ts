export const MODULE_NAME = "Module";

export function isModuleType(type: string): boolean {
  return type === MODULE_NAME;
}

export function isImportedModuleType(type: string): boolean {
  return type.endsWith(`_${MODULE_NAME}`);
}
