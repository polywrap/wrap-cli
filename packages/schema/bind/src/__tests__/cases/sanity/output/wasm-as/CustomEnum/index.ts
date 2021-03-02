export enum CustomEnum {
  STRING,
  BYTES,
}

export function matchCustomEnumByValue(value: u32): CustomEnum {
  switch (value) {
    case CustomEnum.STRING: return CustomEnum.STRING;
    case CustomEnum.BYTES: return CustomEnum.BYTES;
    default:
      throw new Error("Invalid value for enum 'CustomEnum': " + value.toString());
  }
}

export function matchCustomEnumByKey(key: string): CustomEnum {
  if (key == "STRING") {
    return CustomEnum.STRING;
  }
  if (key == "BYTES") {
    return CustomEnum.BYTES;
  }

  throw new Error("Invalid key for enum 'CustomEnum': " + key);
}
