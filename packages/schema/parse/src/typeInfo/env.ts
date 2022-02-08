export const envTypes = {
  QueryClientEnv: "QueryClientEnv",
  QueryEnv: "QueryEnv",
  MutationClientEnv: "MutationClientEnv",
  MutationEnv: "MutationEnv",
};

export type EnvTypes = typeof envTypes;

export type EnvType = keyof EnvTypes;

export function isEnvType(type: string): type is EnvType {
  return type in envTypes;
}

export function isClientEnvType(type: EnvType): boolean {
  return type.includes("ClientEnv");
}

export const envTypeNames = Object.keys(envTypes);
