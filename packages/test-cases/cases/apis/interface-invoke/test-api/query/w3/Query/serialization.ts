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
