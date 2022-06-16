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

export class Input_boolMethod {
  arg: bool;
}

export function deserializeboolMethodArgs(argsBuf: ArrayBuffer): Input_boolMethod {
  const context: Context =  new Context("Deserializing module-type: boolMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: bool = false;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "bool", "type found, reading property");
      _arg = reader.readBool();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Boolean'"));
  }

  return {
    arg: _arg
  };
}

export function serializeboolMethodResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: boolMethod");
  const sizer = new WriteSizer(sizerContext);
  writeboolMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: boolMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeboolMethodResult(encoder, result);
  return buffer;
}

export function writeboolMethodResult(writer: Write, result: bool): void {
  writer.context().push("boolMethod", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_intMethod {
  arg: i32;
}

export function deserializeintMethodArgs(argsBuf: ArrayBuffer): Input_intMethod {
  const context: Context =  new Context("Deserializing module-type: intMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: i32 = 0;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "i32", "type found, reading property");
      _arg = reader.readInt32();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Int32'"));
  }

  return {
    arg: _arg
  };
}

export function serializeintMethodResult(result: i32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: intMethod");
  const sizer = new WriteSizer(sizerContext);
  writeintMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: intMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeintMethodResult(encoder, result);
  return buffer;
}

export function writeintMethodResult(writer: Write, result: i32): void {
  writer.context().push("intMethod", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export class Input_uIntMethod {
  arg: u32;
}

export function deserializeuIntMethodArgs(argsBuf: ArrayBuffer): Input_uIntMethod {
  const context: Context =  new Context("Deserializing module-type: uIntMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: u32 = 0;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "u32", "type found, reading property");
      _arg = reader.readUInt32();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: UInt32'"));
  }

  return {
    arg: _arg
  };
}

export function serializeuIntMethodResult(result: u32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: uIntMethod");
  const sizer = new WriteSizer(sizerContext);
  writeuIntMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: uIntMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeuIntMethodResult(encoder, result);
  return buffer;
}

export function writeuIntMethodResult(writer: Write, result: u32): void {
  writer.context().push("uIntMethod", "u32", "writing property");
  writer.writeUInt32(result);
  writer.context().pop();
}

export class Input_bytesMethod {
  arg: ArrayBuffer;
}

export function deserializebytesMethodArgs(argsBuf: ArrayBuffer): Input_bytesMethod {
  const context: Context =  new Context("Deserializing module-type: bytesMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: ArrayBuffer = new ArrayBuffer(0);
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _arg = reader.readBytes();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Bytes'"));
  }

  return {
    arg: _arg
  };
}

export function serializebytesMethodResult(result: ArrayBuffer): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: bytesMethod");
  const sizer = new WriteSizer(sizerContext);
  writebytesMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: bytesMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writebytesMethodResult(encoder, result);
  return buffer;
}

export function writebytesMethodResult(writer: Write, result: ArrayBuffer): void {
  writer.context().push("bytesMethod", "ArrayBuffer", "writing property");
  writer.writeBytes(result);
  writer.context().pop();
}

export class Input_arrayMethod {
  arg: Array<string>;
}

export function deserializearrayMethodArgs(argsBuf: ArrayBuffer): Input_arrayMethod {
  const context: Context =  new Context("Deserializing module-type: arrayMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Array<string> = [];
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _arg = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: [String]'"));
  }

  return {
    arg: _arg
  };
}

export function serializearrayMethodResult(result: Array<string> | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: arrayMethod");
  const sizer = new WriteSizer(sizerContext);
  writearrayMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: arrayMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writearrayMethodResult(encoder, result);
  return buffer;
}

export function writearrayMethodResult(writer: Write, result: Array<string> | null): void {
  writer.context().push("arrayMethod", "Array<string> | null", "writing property");
  writer.writeNullableArray(result, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}
