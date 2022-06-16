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

export class Input_queryEnv {
  arg: string;
}

export function deserializequeryEnvArgs(argsBuf: ArrayBuffer): Input_queryEnv {
  const context: Context =  new Context("Deserializing module-type: queryEnv");
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

export function serializequeryEnvResult(result: Types.QueryEnv | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: queryEnv");
  const sizer = new WriteSizer(sizerContext);
  writequeryEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: queryEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writequeryEnvResult(encoder, result);
  return buffer;
}

export function writequeryEnvResult(writer: Write, result: Types.QueryEnv | null): void {
  writer.context().push("queryEnv", "Types.QueryEnv | null", "writing property");
  if (result) {
    Types.QueryEnv.write(writer, result as Types.QueryEnv);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
