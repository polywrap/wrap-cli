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
import { QueryEnv } from "./";
import * as Types from "..";

export function serializeQueryEnv(type: QueryEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: QueryEnv");
  const sizer = new WriteSizer(sizerContext);
  writeQueryEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: QueryEnv");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeQueryEnv(encoder, type);
  return buffer;
}

export function writeQueryEnv(writer: Write, type: QueryEnv): void {
  writer.writeMapLength(3);
  writer.context().push("queryProp", "string", "writing property");
  writer.writeString("queryProp");
  writer.writeString(type.queryProp);
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

export function deserializeQueryEnv(buffer: ArrayBuffer): QueryEnv {
  const context: Context = new Context("Deserializing object-type QueryEnv");
  const reader = new ReadDecoder(buffer, context);
  return readQueryEnv(reader);
}

export function readQueryEnv(reader: Read): QueryEnv {
  let numFields = reader.readMapLength();

  let _queryProp: string = "";
  let _queryPropSet: bool = false;
  let _prop: string = "";
  let _propSet: bool = false;
  let _optProp: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "queryProp") {
      reader.context().push(field, "string", "type found, reading property");
      _queryProp = reader.readString();
      _queryPropSet = true;
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

  if (!_queryPropSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'queryProp: String'"));
  }
  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }

  return {
    queryProp: _queryProp,
    prop: _prop,
    optProp: _optProp
  };
}
