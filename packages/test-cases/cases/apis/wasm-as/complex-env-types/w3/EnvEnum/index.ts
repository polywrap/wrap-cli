export enum EnvEnum {
  FIRST,
  SECOND,
  _MAX_
}

export function sanitizeEnvEnumValue(value: i32): void {
  const valid = value >= 0 && value < EnvEnum._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'EnvEnum': " + value.toString());
  }
}

export function getEnvEnumValue(key: string): EnvEnum {
  if (key == "FIRST") {
    return EnvEnum.FIRST;
  }
  if (key == "SECOND") {
    return EnvEnum.SECOND;
  }

  throw new Error("Invalid key for enum 'EnvEnum': " + key);
}

export function getEnvEnumKey(value: EnvEnum): string {
  sanitizeEnvEnumValue(value);

  switch (value) {
    case EnvEnum.FIRST: return "FIRST";
    case EnvEnum.SECOND: return "SECOND";
    default:
      throw new Error("Invalid value for enum 'EnvEnum': " + value.toString());
  }
}
