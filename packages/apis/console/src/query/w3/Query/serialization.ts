import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write,
  Nullable,
  BigInt,
  Context
} from "@web3api/wasm-as";
import * as Types from "..";

export class Input_debug {
  message: string;
}

export function deserializedebugArgs(argsBuf: ArrayBuffer): Input_debug {
  const context: Context =  new Context("Deserializing query-type: debug");
  const reader = new ReadDecoder(argsBuf, context);
  var numFields = reader.readMapLength();

  var _message: string = "";
  var _messageSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "message") {
      reader.context().push(field, "string", "type found, reading property");
      _message = reader.readString();
      _messageSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_messageSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'message: String'"));
  }

  return {
    message: _message
  };
}

export function serializedebugResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: debug");
  const sizer = new WriteSizer(sizerContext);
  writedebugResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: debug");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writedebugResult(encoder, result);
  return buffer;
}

export function writedebugResult(writer: Write, result: bool): void {
  writer.context().push("debug", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_info {
  message: string;
}

export function deserializeinfoArgs(argsBuf: ArrayBuffer): Input_info {
  const context: Context =  new Context("Deserializing query-type: info");
  const reader = new ReadDecoder(argsBuf, context);
  var numFields = reader.readMapLength();

  var _message: string = "";
  var _messageSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "message") {
      reader.context().push(field, "string", "type found, reading property");
      _message = reader.readString();
      _messageSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_messageSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'message: String'"));
  }

  return {
    message: _message
  };
}

export function serializeinfoResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: info");
  const sizer = new WriteSizer(sizerContext);
  writeinfoResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: info");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeinfoResult(encoder, result);
  return buffer;
}

export function writeinfoResult(writer: Write, result: bool): void {
  writer.context().push("info", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_warn {
  message: string;
}

export function deserializewarnArgs(argsBuf: ArrayBuffer): Input_warn {
  const context: Context =  new Context("Deserializing query-type: warn");
  const reader = new ReadDecoder(argsBuf, context);
  var numFields = reader.readMapLength();

  var _message: string = "";
  var _messageSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "message") {
      reader.context().push(field, "string", "type found, reading property");
      _message = reader.readString();
      _messageSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_messageSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'message: String'"));
  }

  return {
    message: _message
  };
}

export function serializewarnResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: warn");
  const sizer = new WriteSizer(sizerContext);
  writewarnResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: warn");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writewarnResult(encoder, result);
  return buffer;
}

export function writewarnResult(writer: Write, result: bool): void {
  writer.context().push("warn", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_error {
  message: string;
}

export function deserializeerrorArgs(argsBuf: ArrayBuffer): Input_error {
  const context: Context =  new Context("Deserializing query-type: error");
  const reader = new ReadDecoder(argsBuf, context);
  var numFields = reader.readMapLength();

  var _message: string = "";
  var _messageSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "message") {
      reader.context().push(field, "string", "type found, reading property");
      _message = reader.readString();
      _messageSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_messageSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'message: String'"));
  }

  return {
    message: _message
  };
}

export function serializeerrorResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: error");
  const sizer = new WriteSizer(sizerContext);
  writeerrorResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: error");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeerrorResult(encoder, result);
  return buffer;
}

export function writeerrorResult(writer: Write, result: bool): void {
  writer.context().push("error", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}
