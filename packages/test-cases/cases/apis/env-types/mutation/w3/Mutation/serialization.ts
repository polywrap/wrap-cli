import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import * as Types from "..";

export class Input_mutationEnv {
  arg: string;
}

export function deserializemutationEnvArgs(argsBuf: ArrayBuffer): Input_mutationEnv {
  const context: Context =  new Context("Deserializing module-type: mutationEnv");
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

export function serializemutationEnvResult(result: Types.MutationEnv | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: mutationEnv");
  const sizer = new WriteSizer(sizerContext);
  writemutationEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: mutationEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemutationEnvResult(encoder, result);
  return buffer;
}

export function writemutationEnvResult(writer: Write, result: Types.MutationEnv | null): void {
  writer.context().push("mutationEnv", "Types.MutationEnv | null", "writing property");
  if (result) {
    Types.MutationEnv.write(writer, result as Types.MutationEnv);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
