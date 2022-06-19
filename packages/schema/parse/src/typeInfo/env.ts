export const envTypes = {
  ClientEnv: "ClientEnv",
  Env: "Env",
};

export type EnvTypes = typeof envTypes;

export type EnvType = keyof EnvTypes;

export function isEnvType(type: string): type is EnvType {
  return type in envTypes;
}

export function isClientEnvType(type: EnvType): boolean {
  return type === "ClientEnv";
}

export const envTypeNames = Object.keys(envTypes);
