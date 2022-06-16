export enum SanityEnum {
  OPTION1,
  OPTION2,
  OPTION3,
  _MAX_
}

export function sanitizeSanityEnumValue(value: i32): void {
  const valid = value >= 0 && value < SanityEnum._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'SanityEnum': " + value.toString());
  }
}

export function getSanityEnumValue(key: string): SanityEnum {
  if (key == "OPTION1") {
    return SanityEnum.OPTION1;
  }
  if (key == "OPTION2") {
    return SanityEnum.OPTION2;
  }
  if (key == "OPTION3") {
    return SanityEnum.OPTION3;
  }

  throw new Error("Invalid key for enum 'SanityEnum': " + key);
}

export function getSanityEnumKey(value: SanityEnum): string {
  sanitizeSanityEnumValue(value);

  switch (value) {
    case SanityEnum.OPTION1: return "OPTION1";
    case SanityEnum.OPTION2: return "OPTION2";
    case SanityEnum.OPTION3: return "OPTION3";
    default:
      throw new Error("Invalid value for enum 'SanityEnum': " + value.toString());
  }
}
