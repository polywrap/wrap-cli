export enum TestImport_Enum {
  STRING,
  BYTES,
}

export function matchTestImport_EnumByValue(value: u32): TestImport_Enum {
  switch (value) {
    case TestImport_Enum.STRING: return TestImport_Enum.STRING;
    case TestImport_Enum.BYTES: return TestImport_Enum.BYTES;
    default:
      throw new Error("Invalid value for enum 'TestImport_Enum': " + value.toString());
  }
}

export function matchTestImport_EnumByKey(key: string): TestImport_Enum {
  if (key == "STRING") {
    return TestImport_Enum.STRING;
  }
  if (key == "BYTES") {
    return TestImport_Enum.BYTES;
  }

  throw new Error("Invalid key for enum 'TestImport_Enum': " + key);
}
