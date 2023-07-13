export enum TestImport_Enum_Return {
  STRING,
  BYTES,
  _MAX_
}

export function sanitizeTestImport_Enum_ReturnValue(value: i32): void {
  const valid = value >= 0 && value < TestImport_Enum_Return._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'TestImport_Enum_Return': " + value.toString());
  }
}

export function getTestImport_Enum_ReturnValue(key: string): TestImport_Enum_Return {
  if (key == "STRING") {
    return TestImport_Enum_Return.STRING;
  }
  if (key == "BYTES") {
    return TestImport_Enum_Return.BYTES;
  }

  throw new Error("Invalid key for enum 'TestImport_Enum_Return': " + key);
}

export function getTestImport_Enum_ReturnKey(value: TestImport_Enum_Return): string {
  sanitizeTestImport_Enum_ReturnValue(value);

  switch (value) {
    case TestImport_Enum_Return.STRING: return "STRING";
    case TestImport_Enum_Return.BYTES: return "BYTES";
    default:
      throw new Error("Invalid value for enum 'TestImport_Enum_Return': " + value.toString());
  }
}
