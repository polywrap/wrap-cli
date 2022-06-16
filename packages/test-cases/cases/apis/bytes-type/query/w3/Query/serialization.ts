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

export class Input_bytesMethod {
  arg: Types.Args;
}

export function deserializebytesMethodArgs(argsBuf: ArrayBuffer): Input_bytesMethod {
  const context: Context =  new Context("Deserializing module-type: bytesMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.Args | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.Args", "type found, reading property");
      const object = Types.Args.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: Args'"));
  }

  return {
    arg: _arg
  };
}

export function serializebytesMethodResult(result: ArrayBuffer): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: bytesMethod");
  const sizer = new WriteSizer(sizerContext);
  writebytesMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: bytesMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writebytesMethodResult(encoder, result);
  return buffer;
}

export function writebytesMethodResult(writer: Write, result: ArrayBuffer): void {
  writer.context().push("bytesMethod", "ArrayBuffer", "writing property");
  writer.writeBytes(result);
  writer.context().pop();
}
