export const MODULE_NAME = "Module";

export function isModuleType(type: string): boolean {
  return type.includes(MODULE_NAME);
}
