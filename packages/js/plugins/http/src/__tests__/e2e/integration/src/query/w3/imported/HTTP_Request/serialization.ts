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
import { HTTP_Request } from "./";
import * as Types from "../..";

export function serializeHTTP_Request(type: HTTP_Request): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: HTTP_Request");
  const sizer = new WriteSizer(sizerContext);
  writeHTTP_Request(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: HTTP_Request");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeHTTP_Request(encoder, type);
  return buffer;
}

export function writeHTTP_Request(writer: Write, type: HTTP_Request): void {
  writer.writeMapLength(4);
  writer.context().push("headers", "Array<Types.HTTP_Header> | null", "writing property");
  writer.writeString("headers");
  writer.writeNullableArray(type.headers, (writer: Write, item: Types.HTTP_Header): void => {
    Types.HTTP_Header.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("urlParams", "Array<Types.HTTP_UrlParam> | null", "writing property");
  writer.writeString("urlParams");
  writer.writeNullableArray(type.urlParams, (writer: Write, item: Types.HTTP_UrlParam): void => {
    Types.HTTP_UrlParam.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("responseType", "Types.HTTP_ResponseType", "writing property");
  writer.writeString("responseType");
  writer.writeInt32(type.responseType);
  writer.context().pop();
  writer.context().push("body", "string | null", "writing property");
  writer.writeString("body");
  writer.writeNullableString(type.body);
  writer.context().pop();
}

export function deserializeHTTP_Request(buffer: ArrayBuffer): HTTP_Request {
  const context: Context = new Context("Deserializing imported object-type HTTP_Request");
  const reader = new ReadDecoder(buffer, context);
  return readHTTP_Request(reader);
}

export function readHTTP_Request(reader: Read): HTTP_Request {
  let numFields = reader.readMapLength();

  let _headers: Array<Types.HTTP_Header> | null = null;
  let _urlParams: Array<Types.HTTP_UrlParam> | null = null;
  let _responseType: Types.HTTP_ResponseType = 0;
  let _responseTypeSet: bool = false;
  let _body: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "headers") {
      reader.context().push(field, "Array<Types.HTTP_Header> | null", "type found, reading property");
      _headers = reader.readNullableArray((reader: Read): Types.HTTP_Header => {
        const object = Types.HTTP_Header.read(reader);
        return object;
      });
      reader.context().pop();
    }
    else if (field == "urlParams") {
      reader.context().push(field, "Array<Types.HTTP_UrlParam> | null", "type found, reading property");
      _urlParams = reader.readNullableArray((reader: Read): Types.HTTP_UrlParam => {
        const object = Types.HTTP_UrlParam.read(reader);
        return object;
      });
      reader.context().pop();
    }
    else if (field == "responseType") {
      reader.context().push(field, "Types.HTTP_ResponseType", "type found, reading property");
      let value: Types.HTTP_ResponseType;
      if (reader.isNextString()) {
        value = Types.getHTTP_ResponseTypeValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeHTTP_ResponseTypeValue(value);
      }
      _responseType = value;
      _responseTypeSet = true;
      reader.context().pop();
    }
    else if (field == "body") {
      reader.context().push(field, "string | null", "type found, reading property");
      _body = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_responseTypeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'responseType: HTTP_ResponseType'"));
  }

  return {
    headers: _headers,
    urlParams: _urlParams,
    responseType: _responseType,
    body: _body
  };
}
