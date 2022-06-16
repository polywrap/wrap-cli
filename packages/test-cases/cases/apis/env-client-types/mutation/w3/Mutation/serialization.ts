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
  env: Types.MutationClientEnv;
}

export function deserializesanitizeEnvArgs(argsBuf: ArrayBuffer): Input_sanitizeEnv {
  const context: Context =  new Context("Deserializing module-type: sanitizeEnv");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _env: Types.MutationClientEnv | null = null;
  let _envSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "env") {
      reader.context().push(field, "Types.MutationClientEnv", "type found, reading property");
      const object = Types.MutationClientEnv.read(reader);
      _env = object;
      _envSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_env || !_envSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'env: MutationClientEnv'"));
  }

  return {
    env: _env
  };
}

export function serializesanitizeEnvResult(result: Types.MutationEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: sanitizeEnv");
  const sizer = new WriteSizer(sizerContext);
  writesanitizeEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: sanitizeEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesanitizeEnvResult(encoder, result);
  return buffer;
}

export function writesanitizeEnvResult(writer: Write, result: Types.MutationEnv): void {
  writer.context().push("sanitizeEnv", "Types.MutationEnv", "writing property");
  Types.MutationEnv.write(writer, result);
  writer.context().pop();
}

export class Input_mutEnvironment {
  arg: string;
}

export function deserializemutEnvironmentArgs(argsBuf: ArrayBuffer): Input_mutEnvironment {
  const context: Context =  new Context("Deserializing module-type: mutEnvironment");
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

export function serializemutEnvironmentResult(result: Types.MutationEnv | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: mutEnvironment");
  const sizer = new WriteSizer(sizerContext);
  writemutEnvironmentResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: mutEnvironment");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemutEnvironmentResult(encoder, result);
  return buffer;
}

export function writemutEnvironmentResult(writer: Write, result: Types.MutationEnv | null): void {
  writer.context().push("mutEnvironment", "Types.MutationEnv | null", "writing property");
  if (result) {
    Types.MutationEnv.write(writer, result as Types.MutationEnv);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
