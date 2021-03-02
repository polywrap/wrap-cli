export enum CustomEnum {
  STRING,
  BYTES,
  _MAX_
}

export function sanitizeCustomEnumValue(value: i32): void {
  const valid = value >= 0 && value < CustomEnum._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'CustomEnum': " + value.toString());
  }
}

export function getCustomEnumValue(key: string): CustomEnum {
  if (key == "STRING") {
    return CustomEnum.STRING;
  }
  if (key == "BYTES") {
    return CustomEnum.BYTES;
  }

  throw new Error("Invalid key for enum 'CustomEnum': " + key);
}

export function getCustomEnumKey(value: CustomEnum): string {
  sanitizeCustomEnumValue(value);

  switch (value) {
    case CustomEnum.STRING: return "STRING";
    case CustomEnum.BYTES: return "BYTES";
    default:
      throw new Error("Invalid value for enum 'CustomEnum': " + value.toString());
  }
}
