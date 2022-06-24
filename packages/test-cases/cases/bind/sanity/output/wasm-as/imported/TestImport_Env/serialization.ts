import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import { TestImport_Env } from "./";
import * as Types from "../..";

export function serializeTestImport_Env(type: TestImport_Env): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported env-type: TestImport_Env");
  const sizer = new WriteSizer(sizerContext);
  writeTestImport_Env(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported env-type: TestImport_Env");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeTestImport_Env(encoder, type);
  return buffer;
}

export function writeTestImport_Env(writer: Write, type: TestImport_Env): void {
  writer.writeMapLength(1);
  writer.context().push("enviroProp", "string", "writing property");
  writer.writeString("enviroProp");
  writer.writeString(type.enviroProp);
  writer.context().pop();
}

export function deserializeTestImport_Env(buffer: ArrayBuffer): TestImport_Env {
  const context: Context = new Context("Deserializing imported env-type TestImport_Env");
  const reader = new ReadDecoder(buffer, context);
  return readTestImport_Env(reader);
}

export function readTestImport_Env(reader: Read): TestImport_Env {
  let numFields = reader.readMapLength();

  let _enviroProp: string = "";
  let _enviroPropSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "enviroProp") {
      reader.context().push(field, "string", "type found, reading property");
      _enviroProp = reader.readString();
      _enviroPropSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_enviroPropSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'enviroProp: String'"));
  }

  return {
    enviroProp: _enviroProp
  };
}
