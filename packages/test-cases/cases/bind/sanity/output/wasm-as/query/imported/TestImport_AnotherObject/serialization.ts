import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import { TestImport_AnotherObject } from "./";
import * as Types from "../..";

export function serializeTestImport_AnotherObject(type: TestImport_AnotherObject): ArrayBuffer {
  const sizer = new WriteSizer();
  writeTestImport_AnotherObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeTestImport_AnotherObject(encoder, type);
  return buffer;
}

export function writeTestImport_AnotherObject(writer: Write, type: TestImport_AnotherObject): void {
  writer.writeMapLength(1);
  writer.writeString("prop");
  writer.writeString(type.prop);
}

export function deserializeTestImport_AnotherObject(buffer: ArrayBuffer): TestImport_AnotherObject {
  const reader = new ReadDecoder(buffer);
  return readTestImport_AnotherObject(reader);
}

export function readTestImport_AnotherObject(reader: Read): TestImport_AnotherObject {
  var numFields = reader.readMapLength();

  var _prop: string = "";
  var _propSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      _prop = reader.readString();
      _propSet = true;
    }
  }

  if (!_propSet) {
    throw new Error("Missing required property: 'prop: String'");
  }

  return {
    prop: _prop
  };
}
