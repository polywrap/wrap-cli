export enum Enum {
  OPTION1,
  OPTION2,
  OPTION3,
  _MAX_
}

export function sanitizeEnumValue(value: i32): void {
  const valid = value >= 0 && value < Enum._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'Enum': " + value.toString());
  }
}

export function getEnumValue(key: string): Enum {
  if (key == "OPTION1") {
    return Enum.OPTION1;
  }
  if (key == "OPTION2") {
    return Enum.OPTION2;
  }
  if (key == "OPTION3") {
    return Enum.OPTION3;
  }

  throw new Error("Invalid key for enum 'Enum': " + key);
}

export function getEnumKey(value: Enum): string {
  sanitizeEnumValue(value);

  switch (value) {
    case Enum.OPTION1: return "OPTION1";
    case Enum.OPTION2: return "OPTION2";
    case Enum.OPTION3: return "OPTION3";
    default:
      throw new Error("Invalid value for enum 'Enum': " + value.toString());
  }
}
