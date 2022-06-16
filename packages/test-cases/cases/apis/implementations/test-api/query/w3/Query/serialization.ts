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

export class Input_queryMethod {
  arg: Types.ImplementationType;
}

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): Input_queryMethod {
  const context: Context =  new Context("Deserializing module-type: queryMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.ImplementationType | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.ImplementationType", "type found, reading property");
      const object = Types.ImplementationType.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: ImplementationType'"));
  }

  return {
    arg: _arg
  };
}

export function serializequeryMethodResult(result: Types.ImplementationType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: queryMethod");
  const sizer = new WriteSizer(sizerContext);
  writequeryMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: queryMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writequeryMethodResult(encoder, result);
  return buffer;
}

export function writequeryMethodResult(writer: Write, result: Types.ImplementationType): void {
  writer.context().push("queryMethod", "Types.ImplementationType", "writing property");
  Types.ImplementationType.write(writer, result);
  writer.context().pop();
}

export class Input_abstractQueryMethod {
  arg: Types.Interface_Argument;
}

export function deserializeabstractQueryMethodArgs(argsBuf: ArrayBuffer): Input_abstractQueryMethod {
  const context: Context =  new Context("Deserializing module-type: abstractQueryMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.Interface_Argument | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.Interface_Argument", "type found, reading property");
      const object = Types.Interface_Argument.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Interface_Argument'"));
  }

  return {
    arg: _arg
  };
}

export function serializeabstractQueryMethodResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: abstractQueryMethod");
  const sizer = new WriteSizer(sizerContext);
  writeabstractQueryMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: abstractQueryMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeabstractQueryMethodResult(encoder, result);
  return buffer;
}

export function writeabstractQueryMethodResult(writer: Write, result: string): void {
  writer.context().push("abstractQueryMethod", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
