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
import { BigIntInput } from "./";
import * as Types from "..";

export function serializeBigIntInput(type: BigIntInput): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: BigIntInput");
  const sizer = new WriteSizer(sizerContext);
  writeBigIntInput(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: BigIntInput");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeBigIntInput(encoder, type);
  return buffer;
}

export function writeBigIntInput(writer: Write, type: BigIntInput): void {
  writer.writeMapLength(2);
  writer.context().push("prop1", "BigInt", "writing property");
  writer.writeString("prop1");
  writer.writeBigInt(type.prop1);
  writer.context().pop();
  writer.context().push("prop2", "BigInt | null", "writing property");
  writer.writeString("prop2");
  writer.writeNullableBigInt(type.prop2);
  writer.context().pop();
}

export function deserializeBigIntInput(buffer: ArrayBuffer): BigIntInput {
  const context: Context = new Context("Deserializing object-type BigIntInput");
  const reader = new ReadDecoder(buffer, context);
  return readBigIntInput(reader);
}

export function readBigIntInput(reader: Read): BigIntInput {
  let numFields = reader.readMapLength();

  let _prop1: BigInt = BigInt.fromUInt16(0);
  let _prop1Set: bool = false;
  let _prop2: BigInt | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop1") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _prop1 = reader.readBigInt();
      _prop1Set = true;
      reader.context().pop();
    }
    else if (field == "prop2") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _prop2 = reader.readNullableBigInt();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_prop1Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop1: BigInt'"));
  }

  return {
    prop1: _prop1,
    prop2: _prop2
  };
}
