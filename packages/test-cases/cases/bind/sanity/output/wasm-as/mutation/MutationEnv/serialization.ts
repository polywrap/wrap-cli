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
import { MutationEnv } from "./";
import * as Types from "..";

export function serializeMutationEnv(type: MutationEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: MutationEnv");
  const sizer = new WriteSizer(sizerContext);
  writeMutationEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: MutationEnv");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeMutationEnv(encoder, type);
  return buffer;
}

export function writeMutationEnv(writer: Write, type: MutationEnv): void {
  writer.writeMapLength(3);
  writer.context().push("mutProp", "string", "writing property");
  writer.writeString("mutProp");
  writer.writeString(type.mutProp);
  writer.context().pop();
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
  writer.context().push("optProp", "string | null", "writing property");
  writer.writeString("optProp");
  writer.writeNullableString(type.optProp);
  writer.context().pop();
}

export function deserializeMutationEnv(buffer: ArrayBuffer): MutationEnv {
  const context: Context = new Context("Deserializing object-type MutationEnv");
  const reader = new ReadDecoder(buffer, context);
  return readMutationEnv(reader);
}

export function readMutationEnv(reader: Read): MutationEnv {
  let numFields = reader.readMapLength();

  let _mutProp: string = "";
  let _mutPropSet: bool = false;
  let _prop: string = "";
  let _propSet: bool = false;
  let _optProp: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "mutProp") {
      reader.context().push(field, "string", "type found, reading property");
      _mutProp = reader.readString();
      _mutPropSet = true;
      reader.context().pop();
    }
    else if (field == "prop") {
      reader.context().push(field, "string", "type found, reading property");
      _prop = reader.readString();
      _propSet = true;
      reader.context().pop();
    }
    else if (field == "optProp") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optProp = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_mutPropSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'mutProp: String'"));
  }
  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }

  return {
    mutProp: _mutProp,
    prop: _prop,
    optProp: _optProp
  };
}
