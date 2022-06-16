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
import { HTTP_Response } from "./";
import * as Types from "../..";

export function serializeHTTP_Response(type: HTTP_Response): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: HTTP_Response");
  const sizer = new WriteSizer(sizerContext);
  writeHTTP_Response(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: HTTP_Response");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeHTTP_Response(encoder, type);
  return buffer;
}

export function writeHTTP_Response(writer: Write, type: HTTP_Response): void {
  writer.writeMapLength(4);
  writer.context().push("status", "i32", "writing property");
  writer.writeString("status");
  writer.writeInt32(type.status);
  writer.context().pop();
  writer.context().push("statusText", "string", "writing property");
  writer.writeString("statusText");
  writer.writeString(type.statusText);
  writer.context().pop();
  writer.context().push("headers", "Array<Types.HTTP_Header> | null", "writing property");
  writer.writeString("headers");
  writer.writeNullableArray(type.headers, (writer: Write, item: Types.HTTP_Header): void => {
    Types.HTTP_Header.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("body", "string | null", "writing property");
  writer.writeString("body");
  writer.writeNullableString(type.body);
  writer.context().pop();
}

export function deserializeHTTP_Response(buffer: ArrayBuffer): HTTP_Response {
  const context: Context = new Context("Deserializing imported object-type HTTP_Response");
  const reader = new ReadDecoder(buffer, context);
  return readHTTP_Response(reader);
}

export function readHTTP_Response(reader: Read): HTTP_Response {
  let numFields = reader.readMapLength();

  let _status: i32 = 0;
  let _statusSet: bool = false;
  let _statusText: string = "";
  let _statusTextSet: bool = false;
  let _headers: Array<Types.HTTP_Header> | null = null;
  let _body: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "status") {
      reader.context().push(field, "i32", "type found, reading property");
      _status = reader.readInt32();
      _statusSet = true;
      reader.context().pop();
    }
    else if (field == "statusText") {
      reader.context().push(field, "string", "type found, reading property");
      _statusText = reader.readString();
      _statusTextSet = true;
      reader.context().pop();
    }
    else if (field == "headers") {
      reader.context().push(field, "Array<Types.HTTP_Header> | null", "type found, reading property");
      _headers = reader.readNullableArray((reader: Read): Types.HTTP_Header => {
        const object = Types.HTTP_Header.read(reader);
        return object;
      });
      reader.context().pop();
    }
    else if (field == "body") {
      reader.context().push(field, "string | null", "type found, reading property");
      _body = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_statusSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'status: Int'"));
  }
  if (!_statusTextSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'statusText: String'"));
  }

  return {
    status: _status,
    statusText: _statusText,
    headers: _headers,
    body: _body
  };
}
