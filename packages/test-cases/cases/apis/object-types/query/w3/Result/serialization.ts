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
} from "@web3api/wasm-as";
import { Result } from "./";
import * as Types from "..";

export function serializeResult(type: Result): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Result");
  const sizer = new WriteSizer(sizerContext);
  writeResult(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeResult(encoder, type);
  return buffer;
}

export function writeResult(writer: Write, type: Result): void {
  writer.writeMapLength(2);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
  writer.context().push("nested", "Types.Nested", "writing property");
  writer.writeString("nested");
  Types.Nested.write(writer, type.nested);
  writer.context().pop();
}

export function deserializeResult(buffer: ArrayBuffer): Result {
  const context: Context = new Context("Deserializing object-type Result");
  const reader = new ReadDecoder(buffer, context);
  return readResult(reader);
}

export function readResult(reader: Read): Result {
  let numFields = reader.readMapLength();

  let _prop: string = "";
  let _propSet: bool = false;
  let _nested: Types.Nested | null = null;
  let _nestedSet: bool = false;

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
    else if (field == "nested") {
      reader.context().push(field, "Types.Nested", "type found, reading property");
      const object = Types.Nested.read(reader);
      _nested = object;
      _nestedSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }
  if (!_nested || !_nestedSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'nested: Nested'"));
  }

  return {
    prop: _prop,
    nested: _nested
  };
}
