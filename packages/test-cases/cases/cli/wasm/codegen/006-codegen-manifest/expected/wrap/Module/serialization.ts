import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Box,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import * as Types from "..";

export class Args_method {
  arg: string;
}

export function deserializemethodArgs(argsBuf: ArrayBuffer): Args_method {
  const context: Context = new Context("Deserializing module-type: method");
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

export function serializemethodResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method");
  const sizer = new WriteSizer(sizerContext);
  writemethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodResult(encoder, result);
  return buffer;
}

export function writemethodResult(writer: Write, result: string): void {
  writer.context().push("method", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
