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

export class Input_sanitizeEnv {
  env: Types.QueryClientEnv;
}

export function deserializesanitizeEnvArgs(argsBuf: ArrayBuffer): Input_sanitizeEnv {
  const context: Context =  new Context("Deserializing module-type: sanitizeEnv");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _env: Types.QueryClientEnv | null = null;
  let _envSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "env") {
      reader.context().push(field, "Types.QueryClientEnv", "type found, reading property");
      const object = Types.QueryClientEnv.read(reader);
      _env = object;
      _envSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_env || !_envSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'env: QueryClientEnv'"));
  }

  return {
    env: _env
  };
}

export function serializesanitizeEnvResult(result: Types.QueryEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: sanitizeEnv");
  const sizer = new WriteSizer(sizerContext);
  writesanitizeEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: sanitizeEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesanitizeEnvResult(encoder, result);
  return buffer;
}

export function writesanitizeEnvResult(writer: Write, result: Types.QueryEnv): void {
  writer.context().push("sanitizeEnv", "Types.QueryEnv", "writing property");
  Types.QueryEnv.write(writer, result);
  writer.context().pop();
}

export class Input_environment {
  arg: string;
}

export function deserializeenvironmentArgs(argsBuf: ArrayBuffer): Input_environment {
  const context: Context =  new Context("Deserializing module-type: environment");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: string = "";
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "string", "type found, reading property");
      _arg = reader.readString();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: String'"));
  }

  return {
    arg: _arg
  };
}

export function serializeenvironmentResult(result: Types.QueryEnv | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: environment");
  const sizer = new WriteSizer(sizerContext);
  writeenvironmentResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: environment");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeenvironmentResult(encoder, result);
  return buffer;
}

export function writeenvironmentResult(writer: Write, result: Types.QueryEnv | null): void {
  writer.context().push("environment", "Types.QueryEnv | null", "writing property");
  if (result) {
    Types.QueryEnv.write(writer, result as Types.QueryEnv);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
