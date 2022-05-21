import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import { TestImport_YetAnotherObject } from "./";
import * as Types from "../..";

export function serializeTestImport_YetAnotherObject(type: TestImport_YetAnotherObject): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: TestImport_YetAnotherObject");
  const sizer = new WriteSizer(sizerContext);
  writeTestImport_YetAnotherObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: TestImport_YetAnotherObject");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeTestImport_YetAnotherObject(encoder, type);
  return buffer;
}

export function writeTestImport_YetAnotherObject(writer: Write, type: TestImport_YetAnotherObject): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "bool", "writing property");
  writer.writeString("prop");
  writer.writeBool(type.prop);
  writer.context().pop();
}

export function deserializeTestImport_YetAnotherObject(buffer: ArrayBuffer): TestImport_YetAnotherObject {
  const context: Context = new Context("Deserializing imported object-type TestImport_YetAnotherObject");
  const reader = new ReadDecoder(buffer, context);
  return readTestImport_YetAnotherObject(reader);
}

export function readTestImport_YetAnotherObject(reader: Read): TestImport_YetAnotherObject {
  let numFields = reader.readMapLength();

  let _prop: bool = false;
  let _propSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "bool", "type found, reading property");
      _prop = reader.readBool();
      _propSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: Boolean'"));
  }

  return {
    prop: _prop
  };
}
