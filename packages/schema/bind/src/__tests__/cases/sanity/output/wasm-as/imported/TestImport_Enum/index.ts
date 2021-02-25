export enum TestImport_Enum {
  STRING,
  BYTES,
}

export function matchTestImport_EnumByValue(value: i32): TestImport_Enum {
  if (TestImport_Enum.STRING == value) {
    return TestImport_Enum.STRING;
  }
  if (TestImport_Enum.BYTES == value) {
    return TestImport_Enum.BYTES;
  }

  throw new Error("Invalid value for enum 'TestImport_Enum'");
}

export function matchTestImport_EnumByKey(key: string): TestImport_Enum {
  if (key == "STRING") {
    return TestImport_Enum.STRING;
  }
  if (key == "BYTES") {
    return TestImport_Enum.BYTES;
  }

  throw new Error("Invalid key for enum 'TestImport_Enum'");
}
