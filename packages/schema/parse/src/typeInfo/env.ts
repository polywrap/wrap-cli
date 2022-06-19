export const envTypeNames = {
  objectType: "Env",
  inputField: "env",
};

export function isEnvType(type: string): boolean {
  return type === envTypeNames.objectType;
}

export function isEnvInputField(name: string): boolean {
  return name === envTypeNames.inputField;
}
