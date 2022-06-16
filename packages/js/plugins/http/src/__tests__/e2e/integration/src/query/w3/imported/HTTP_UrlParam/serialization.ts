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
import { HTTP_UrlParam } from "./";
import * as Types from "../..";

export function serializeHTTP_UrlParam(type: HTTP_UrlParam): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: HTTP_UrlParam");
  const sizer = new WriteSizer(sizerContext);
  writeHTTP_UrlParam(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: HTTP_UrlParam");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeHTTP_UrlParam(encoder, type);
  return buffer;
}

export function writeHTTP_UrlParam(writer: Write, type: HTTP_UrlParam): void {
  writer.writeMapLength(2);
  writer.context().push("key", "string", "writing property");
  writer.writeString("key");
  writer.writeString(type.key);
  writer.context().pop();
  writer.context().push("value", "string", "writing property");
  writer.writeString("value");
  writer.writeString(type.value);
  writer.context().pop();
}

export function deserializeHTTP_UrlParam(buffer: ArrayBuffer): HTTP_UrlParam {
  const context: Context = new Context("Deserializing imported object-type HTTP_UrlParam");
  const reader = new ReadDecoder(buffer, context);
  return readHTTP_UrlParam(reader);
}

export function readHTTP_UrlParam(reader: Read): HTTP_UrlParam {
  let numFields = reader.readMapLength();

  let _key: string = "";
  let _keySet: bool = false;
  let _value: string = "";
  let _valueSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "key") {
      reader.context().push(field, "string", "type found, reading property");
      _key = reader.readString();
      _keySet = true;
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "string", "type found, reading property");
      _value = reader.readString();
      _valueSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_keySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'key: String'"));
  }
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'value: String'"));
  }

  return {
    key: _key,
    value: _value
  };
}
