export enum TestImport_Enum {
  STRING,
  BYTES,
  _MAX_
}

export function sanitizeTestImport_EnumValue(value: i32): void {
  const valid = value >= 0 && value < TestImport_Enum._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'TestImport_Enum': " + value.toString());
  }
}

export function getTestImport_EnumValue(key: string): TestImport_Enum {
  if (key == "STRING") {
    return TestImport_Enum.STRING;
  }
  if (key == "BYTES") {
    return TestImport_Enum.BYTES;
  }

  throw new Error("Invalid key for enum 'TestImport_Enum': " + key);
}

export function getTestImport_EnumKey(value: TestImport_Enum): string {
  sanitizeTestImport_EnumValue(value);

  switch (value) {
    case TestImport_Enum.STRING: return "STRING";
    case TestImport_Enum.BYTES: return "BYTES";
    default:
      throw new Error("Invalid value for enum 'TestImport_Enum': " + value.toString());
  }
}
