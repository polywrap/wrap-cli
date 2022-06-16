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
import { Arg2 } from "./";
import * as Types from "..";

export function serializeArg2(type: Arg2): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Arg2");
  const sizer = new WriteSizer(sizerContext);
  writeArg2(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Arg2");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeArg2(encoder, type);
  return buffer;
}

export function writeArg2(writer: Write, type: Arg2): void {
  writer.writeMapLength(2);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
  writer.context().push("circular", "Types.Circular", "writing property");
  writer.writeString("circular");
  Types.Circular.write(writer, type.circular);
  writer.context().pop();
}

export function deserializeArg2(buffer: ArrayBuffer): Arg2 {
  const context: Context = new Context("Deserializing object-type Arg2");
  const reader = new ReadDecoder(buffer, context);
  return readArg2(reader);
}

export function readArg2(reader: Read): Arg2 {
  let numFields = reader.readMapLength();

  let _prop: string = "";
  let _propSet: bool = false;
  let _circular: Types.Circular | null = null;
  let _circularSet: bool = false;

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
    else if (field == "circular") {
      reader.context().push(field, "Types.Circular", "type found, reading property");
      const object = Types.Circular.read(reader);
      _circular = object;
      _circularSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }
  if (!_circular || !_circularSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'circular: Circular'"));
  }

  return {
    prop: _prop,
    circular: _circular
  };
}
