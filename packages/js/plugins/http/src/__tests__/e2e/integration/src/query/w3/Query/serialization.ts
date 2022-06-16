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
import * as Types from "..";

export class Input_get {
  url: string;
  request: Types.HTTP_Request | null;
}

export function deserializegetArgs(argsBuf: ArrayBuffer): Input_get {
  const context: Context =  new Context("Deserializing module-type: get");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _url: string = "";
  let _urlSet: bool = false;
  let _request: Types.HTTP_Request | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "url") {
      reader.context().push(field, "string", "type found, reading property");
      _url = reader.readString();
      _urlSet = true;
      reader.context().pop();
    }
    else if (field == "request") {
      reader.context().push(field, "Types.HTTP_Request | null", "type found, reading property");
      let object: Types.HTTP_Request | null = null;
      if (!reader.isNextNil()) {
        object = Types.HTTP_Request.read(reader);
      }
      _request = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_urlSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'url: String'"));
  }

  return {
    url: _url,
    request: _request
  };
}

export function serializegetResult(result: Types.HTTP_Response | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: get");
  const sizer = new WriteSizer(sizerContext);
  writegetResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: get");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetResult(encoder, result);
  return buffer;
}

export function writegetResult(writer: Write, result: Types.HTTP_Response | null): void {
  writer.context().push("get", "Types.HTTP_Response | null", "writing property");
  if (result) {
    Types.HTTP_Response.write(writer, result as Types.HTTP_Response);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export class Input_post {
  url: string;
  request: Types.HTTP_Request | null;
}

export function deserializepostArgs(argsBuf: ArrayBuffer): Input_post {
  const context: Context =  new Context("Deserializing module-type: post");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _url: string = "";
  let _urlSet: bool = false;
  let _request: Types.HTTP_Request | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "url") {
      reader.context().push(field, "string", "type found, reading property");
      _url = reader.readString();
      _urlSet = true;
      reader.context().pop();
    }
    else if (field == "request") {
      reader.context().push(field, "Types.HTTP_Request | null", "type found, reading property");
      let object: Types.HTTP_Request | null = null;
      if (!reader.isNextNil()) {
        object = Types.HTTP_Request.read(reader);
      }
      _request = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_urlSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'url: String'"));
  }

  return {
    url: _url,
    request: _request
  };
}

export function serializepostResult(result: Types.HTTP_Response | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: post");
  const sizer = new WriteSizer(sizerContext);
  writepostResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: post");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writepostResult(encoder, result);
  return buffer;
}

export function writepostResult(writer: Write, result: Types.HTTP_Response | null): void {
  writer.context().push("post", "Types.HTTP_Response | null", "writing property");
  if (result) {
    Types.HTTP_Response.write(writer, result as Types.HTTP_Response);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
