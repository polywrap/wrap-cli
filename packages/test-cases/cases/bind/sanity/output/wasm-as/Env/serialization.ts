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
import { Env } from "./";
import * as Types from "..";

export function serializeEnv(type: Env): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) env-type: Env");
  const sizer = new WriteSizer(sizerContext);
  writeEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) env-type: Env");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEnv(encoder, type);
  return buffer;
}

export function writeEnv(writer: Write, type: Env): void {
  writer.writeMapLength(3);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
  writer.context().push("optProp", "string | null", "writing property");
  writer.writeString("optProp");
  writer.writeOptionalString(type.optProp);
  writer.context().pop();
  writer.context().push("optMap", "Map<string, Nullable<i32> | null> | null", "writing property");
  writer.writeString("optMap");
  writer.writeOptionalExtGenericMap(type.optMap, (writer: Write, key: string) => {
    writer.writeString(key);
  }, (writer: Write, value: Nullable<i32> | null): void => {
    writer.writeOptionalInt32(value);
  });
  writer.context().pop();
}

export function deserializeEnv(buffer: ArrayBuffer): Env {
  const context: Context = new Context("Deserializing env-type Env");
  const reader = new ReadDecoder(buffer, context);
  return readEnv(reader);
}

export function readEnv(reader: Read): Env {
  let numFields = reader.readMapLength();

  let _prop: string = "";
  let _propSet: bool = false;
  let _optProp: string | null = null;
  let _optMap: Map<string, Nullable<i32> | null> | null = null;

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
    else if (field == "optProp") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optProp = reader.readOptionalString();
      reader.context().pop();
    }
    else if (field == "optMap") {
      reader.context().push(field, "Map<string, Nullable<i32> | null> | null", "type found, reading property");
      _optMap = reader.readOptionalExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): Nullable<i32> | null => {
        return reader.readOptionalInt32();
      });
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }

  return {
    prop: _prop,
    optProp: _optProp,
    optMap: _optMap
  };
}
