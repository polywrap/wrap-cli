export const envTypeNames = {
  objectType: "Env",
  argName: "env",
};

export function isEnvType(type: string): boolean {
  return type === envTypeNames.objectType;
}

export function isEnvArgName(name: string): boolean {
  return name === envTypeNames.argName;
}

export function isImportedEnvType(type: string): boolean {
  return type.endsWith(`_${envTypeNames.objectType}`);
}
