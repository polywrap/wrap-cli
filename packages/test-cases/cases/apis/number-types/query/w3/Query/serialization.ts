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

export class Input_i8Method {
  first: i8;
  second: i8;
}

export function deserializei8MethodArgs(argsBuf: ArrayBuffer): Input_i8Method {
  const context: Context =  new Context("Deserializing module-type: i8Method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _first: i8 = 0;
  let _firstSet: bool = false;
  let _second: i8 = 0;
  let _secondSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "first") {
      reader.context().push(field, "i8", "type found, reading property");
      _first = reader.readInt8();
      _firstSet = true;
      reader.context().pop();
    }
    else if (field == "second") {
      reader.context().push(field, "i8", "type found, reading property");
      _second = reader.readInt8();
      _secondSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_firstSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'first: Int8'"));
  }
  if (!_secondSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'second: Int8'"));
  }

  return {
    first: _first,
    second: _second
  };
}

export function serializei8MethodResult(result: i8): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: i8Method");
  const sizer = new WriteSizer(sizerContext);
  writei8MethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: i8Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writei8MethodResult(encoder, result);
  return buffer;
}

export function writei8MethodResult(writer: Write, result: i8): void {
  writer.context().push("i8Method", "i8", "writing property");
  writer.writeInt8(result);
  writer.context().pop();
}

export class Input_u8Method {
  first: u8;
  second: u8;
}

export function deserializeu8MethodArgs(argsBuf: ArrayBuffer): Input_u8Method {
  const context: Context =  new Context("Deserializing module-type: u8Method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _first: u8 = 0;
  let _firstSet: bool = false;
  let _second: u8 = 0;
  let _secondSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "first") {
      reader.context().push(field, "u8", "type found, reading property");
      _first = reader.readUInt8();
      _firstSet = true;
      reader.context().pop();
    }
    else if (field == "second") {
      reader.context().push(field, "u8", "type found, reading property");
      _second = reader.readUInt8();
      _secondSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_firstSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'first: UInt8'"));
  }
  if (!_secondSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'second: UInt8'"));
  }

  return {
    first: _first,
    second: _second
  };
}

export function serializeu8MethodResult(result: u8): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: u8Method");
  const sizer = new WriteSizer(sizerContext);
  writeu8MethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: u8Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeu8MethodResult(encoder, result);
  return buffer;
}

export function writeu8MethodResult(writer: Write, result: u8): void {
  writer.context().push("u8Method", "u8", "writing property");
  writer.writeUInt8(result);
  writer.context().pop();
}

export class Input_i16Method {
  first: i16;
  second: i16;
}

export function deserializei16MethodArgs(argsBuf: ArrayBuffer): Input_i16Method {
  const context: Context =  new Context("Deserializing module-type: i16Method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _first: i16 = 0;
  let _firstSet: bool = false;
  let _second: i16 = 0;
  let _secondSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "first") {
      reader.context().push(field, "i16", "type found, reading property");
      _first = reader.readInt16();
      _firstSet = true;
      reader.context().pop();
    }
    else if (field == "second") {
      reader.context().push(field, "i16", "type found, reading property");
      _second = reader.readInt16();
      _secondSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_firstSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'first: Int16'"));
  }
  if (!_secondSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'second: Int16'"));
  }

  return {
    first: _first,
    second: _second
  };
}

export function serializei16MethodResult(result: i16): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: i16Method");
  const sizer = new WriteSizer(sizerContext);
  writei16MethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: i16Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writei16MethodResult(encoder, result);
  return buffer;
}

export function writei16MethodResult(writer: Write, result: i16): void {
  writer.context().push("i16Method", "i16", "writing property");
  writer.writeInt16(result);
  writer.context().pop();
}

export class Input_u16Method {
  first: u16;
  second: u16;
}

export function deserializeu16MethodArgs(argsBuf: ArrayBuffer): Input_u16Method {
  const context: Context =  new Context("Deserializing module-type: u16Method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _first: u16 = 0;
  let _firstSet: bool = false;
  let _second: u16 = 0;
  let _secondSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "first") {
      reader.context().push(field, "u16", "type found, reading property");
      _first = reader.readUInt16();
      _firstSet = true;
      reader.context().pop();
    }
    else if (field == "second") {
      reader.context().push(field, "u16", "type found, reading property");
      _second = reader.readUInt16();
      _secondSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_firstSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'first: UInt16'"));
  }
  if (!_secondSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'second: UInt16'"));
  }

  return {
    first: _first,
    second: _second
  };
}

export function serializeu16MethodResult(result: u16): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: u16Method");
  const sizer = new WriteSizer(sizerContext);
  writeu16MethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: u16Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeu16MethodResult(encoder, result);
  return buffer;
}

export function writeu16MethodResult(writer: Write, result: u16): void {
  writer.context().push("u16Method", "u16", "writing property");
  writer.writeUInt16(result);
  writer.context().pop();
}

export class Input_i32Method {
  first: i32;
  second: i32;
}

export function deserializei32MethodArgs(argsBuf: ArrayBuffer): Input_i32Method {
  const context: Context =  new Context("Deserializing module-type: i32Method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _first: i32 = 0;
  let _firstSet: bool = false;
  let _second: i32 = 0;
  let _secondSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "first") {
      reader.context().push(field, "i32", "type found, reading property");
      _first = reader.readInt32();
      _firstSet = true;
      reader.context().pop();
    }
    else if (field == "second") {
      reader.context().push(field, "i32", "type found, reading property");
      _second = reader.readInt32();
      _secondSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_firstSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'first: Int'"));
  }
  if (!_secondSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'second: Int'"));
  }

  return {
    first: _first,
    second: _second
  };
}

export function serializei32MethodResult(result: i32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: i32Method");
  const sizer = new WriteSizer(sizerContext);
  writei32MethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: i32Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writei32MethodResult(encoder, result);
  return buffer;
}

export function writei32MethodResult(writer: Write, result: i32): void {
  writer.context().push("i32Method", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export class Input_u32Method {
  first: u32;
  second: u32;
}

export function deserializeu32MethodArgs(argsBuf: ArrayBuffer): Input_u32Method {
  const context: Context =  new Context("Deserializing module-type: u32Method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _first: u32 = 0;
  let _firstSet: bool = false;
  let _second: u32 = 0;
  let _secondSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "first") {
      reader.context().push(field, "u32", "type found, reading property");
      _first = reader.readUInt32();
      _firstSet = true;
      reader.context().pop();
    }
    else if (field == "second") {
      reader.context().push(field, "u32", "type found, reading property");
      _second = reader.readUInt32();
      _secondSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_firstSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'first: UInt32'"));
  }
  if (!_secondSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'second: UInt32'"));
  }

  return {
    first: _first,
    second: _second
  };
}

export function serializeu32MethodResult(result: u32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: u32Method");
  const sizer = new WriteSizer(sizerContext);
  writeu32MethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: u32Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeu32MethodResult(encoder, result);
  return buffer;
}

export function writeu32MethodResult(writer: Write, result: u32): void {
  writer.context().push("u32Method", "u32", "writing property");
  writer.writeUInt32(result);
  writer.context().pop();
}
