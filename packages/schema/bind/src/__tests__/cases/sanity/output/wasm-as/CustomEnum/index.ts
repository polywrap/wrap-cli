export enum CustomEnum {
  STRING,
  BYTES,
}

export function matchCustomEnumByValue(value: i32): CustomEnum {
  if (CustomEnum.STRING == value) {
    return CustomEnum.STRING;
  }
  if (CustomEnum.BYTES == value) {
    return CustomEnum.BYTES;
  }

  throw new Error("Invalid value for enum 'CustomEnum'");
}
