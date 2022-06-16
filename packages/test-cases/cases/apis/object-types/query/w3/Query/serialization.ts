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

export class Input_method1 {
  arg1: Types.Arg1;
  arg2: Types.Arg2 | null;
}

export function deserializemethod1Args(argsBuf: ArrayBuffer): Input_method1 {
  const context: Context =  new Context("Deserializing module-type: method1");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg1: Types.Arg1 | null = null;
  let _arg1Set: bool = false;
  let _arg2: Types.Arg2 | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg1") {
      reader.context().push(field, "Types.Arg1", "type found, reading property");
      const object = Types.Arg1.read(reader);
      _arg1 = object;
      _arg1Set = true;
      reader.context().pop();
    }
    else if (field == "arg2") {
      reader.context().push(field, "Types.Arg2 | null", "type found, reading property");
      let object: Types.Arg2 | null = null;
      if (!reader.isNextNil()) {
        object = Types.Arg2.read(reader);
      }
      _arg2 = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg1 || !_arg1Set) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg1: Arg1'"));
  }

  return {
    arg1: _arg1,
    arg2: _arg2
  };
}

export function serializemethod1Result(result: Array<Types.Result>): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method1");
  const sizer = new WriteSizer(sizerContext);
  writemethod1Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method1");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod1Result(encoder, result);
  return buffer;
}

export function writemethod1Result(writer: Write, result: Array<Types.Result>): void {
  writer.context().push("method1", "Array<Types.Result>", "writing property");
  writer.writeArray(result, (writer: Write, item: Types.Result): void => {
    Types.Result.write(writer, item);
  });
  writer.context().pop();
}

export class Input_method2 {
  arg: Types.Arg1;
}

export function deserializemethod2Args(argsBuf: ArrayBuffer): Input_method2 {
  const context: Context =  new Context("Deserializing module-type: method2");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.Arg1 | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.Arg1", "type found, reading property");
      const object = Types.Arg1.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Arg1'"));
  }

  return {
    arg: _arg
  };
}

export function serializemethod2Result(result: Types.Result | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method2");
  const sizer = new WriteSizer(sizerContext);
  writemethod2Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method2");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod2Result(encoder, result);
  return buffer;
}

export function writemethod2Result(writer: Write, result: Types.Result | null): void {
  writer.context().push("method2", "Types.Result | null", "writing property");
  if (result) {
    Types.Result.write(writer, result as Types.Result);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export class Input_method3 {
  arg: Types.Arg1;
}

export function deserializemethod3Args(argsBuf: ArrayBuffer): Input_method3 {
  const context: Context =  new Context("Deserializing module-type: method3");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.Arg1 | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.Arg1", "type found, reading property");
      const object = Types.Arg1.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Arg1'"));
  }

  return {
    arg: _arg
  };
}

export function serializemethod3Result(result: Array<Types.Result | null>): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method3");
  const sizer = new WriteSizer(sizerContext);
  writemethod3Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method3");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod3Result(encoder, result);
  return buffer;
}

export function writemethod3Result(writer: Write, result: Array<Types.Result | null>): void {
  writer.context().push("method3", "Array<Types.Result | null>", "writing property");
  writer.writeArray(result, (writer: Write, item: Types.Result | null): void => {
    if (item) {
      Types.Result.write(writer, item as Types.Result);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
}

export class Input_method5 {
  arg: Types.Arg3;
}

export function deserializemethod5Args(argsBuf: ArrayBuffer): Input_method5 {
  const context: Context =  new Context("Deserializing module-type: method5");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.Arg3 | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.Arg3", "type found, reading property");
      const object = Types.Arg3.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Arg3'"));
  }

  return {
    arg: _arg
  };
}

export function serializemethod5Result(result: Types.Result): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method5");
  const sizer = new WriteSizer(sizerContext);
  writemethod5Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method5");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod5Result(encoder, result);
  return buffer;
}

export function writemethod5Result(writer: Write, result: Types.Result): void {
  writer.context().push("method5", "Types.Result", "writing property");
  Types.Result.write(writer, result);
  writer.context().pop();
}
