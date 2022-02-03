export const moduleTypes = {
  Mutation: "Mutation",
  Query: "Query",
};

export type ModuleTypes = typeof moduleTypes;

export type ModuleType = keyof ModuleTypes;

export function isModuleType(type: string): type is ModuleType {
  return type in moduleTypes;
}

export const ModuleTypeNames = Object.keys(moduleTypes);
