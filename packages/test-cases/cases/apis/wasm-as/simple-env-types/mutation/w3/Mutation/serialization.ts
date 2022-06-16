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

export class Input_getEnv {
  arg: string;
}

export function deserializegetEnvArgs(argsBuf: ArrayBuffer): Input_getEnv {
  const context: Context =  new Context("Deserializing module-type: getEnv");
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

export function serializegetEnvResult(result: Types.MutationEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getEnv");
  const sizer = new WriteSizer(sizerContext);
  writegetEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetEnvResult(encoder, result);
  return buffer;
}

export function writegetEnvResult(writer: Write, result: Types.MutationEnv): void {
  writer.context().push("getEnv", "Types.MutationEnv", "writing property");
  Types.MutationEnv.write(writer, result);
  writer.context().pop();
}
