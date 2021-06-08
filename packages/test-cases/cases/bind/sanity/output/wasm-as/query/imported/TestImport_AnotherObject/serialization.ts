import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  Context
} from "@web3api/wasm-as";
import { TestImport_AnotherObject } from "./";
import * as Types from "../..";

export function serializeTestImport_AnotherObject(type: TestImport_AnotherObject): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: TestImport_AnotherObject");
  const sizer = new WriteSizer(sizerContext);
  writeTestImport_AnotherObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: TestImport_AnotherObject");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeTestImport_AnotherObject(encoder, type);
  return buffer;
}

export function writeTestImport_AnotherObject(writer: Write, type: TestImport_AnotherObject): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
}

export function deserializeTestImport_AnotherObject(buffer: ArrayBuffer): TestImport_AnotherObject {
  const context: Context = new Context("Deserializing imported object-type TestImport_AnotherObject");
  const reader = new ReadDecoder(buffer, context);
  return readTestImport_AnotherObject(reader);
}

export function readTestImport_AnotherObject(reader: Read): TestImport_AnotherObject {
  var numFields = reader.readMapLength();

  var _prop: string = "";
  var _propSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "string", "type found, reading property");
      _prop = reader.readString();
      _propSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }

  return {
    prop: _prop
  };
}
