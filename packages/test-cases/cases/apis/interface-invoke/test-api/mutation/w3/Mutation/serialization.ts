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

export class Input_mutationMethod {
  arg: u8;
}

export function deserializemutationMethodArgs(argsBuf: ArrayBuffer): Input_mutationMethod {
  const context: Context =  new Context("Deserializing module-type: mutationMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: u8 = 0;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "u8", "type found, reading property");
      _arg = reader.readUInt8();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: UInt8'"));
  }

  return {
    arg: _arg
  };
}

export function serializemutationMethodResult(result: u8): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: mutationMethod");
  const sizer = new WriteSizer(sizerContext);
  writemutationMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: mutationMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemutationMethodResult(encoder, result);
  return buffer;
}

export function writemutationMethodResult(writer: Write, result: u8): void {
  writer.context().push("mutationMethod", "u8", "writing property");
  writer.writeUInt8(result);
  writer.context().pop();
}
