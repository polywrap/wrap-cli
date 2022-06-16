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

export class Input_method1 {
  m_const: Types.Arg1;
}

export function deserializemethod1Args(argsBuf: ArrayBuffer): Input_method1 {
  const context: Context =  new Context("Deserializing module-type: method1");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _const: Types.Arg1 | null = null;
  let _constSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "const") {
      reader.context().push(field, "Types.Arg1", "type found, reading property");
      const object = Types.Arg1.read(reader);
      _const = object;
      _constSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_const || !_constSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'const: Arg1'"));
  }

  return {
    m_const: _const
  };
}

export function serializemethod1Result(result: Types.Result): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method1");
  const sizer = new WriteSizer(sizerContext);
  writemethod1Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method1");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod1Result(encoder, result);
  return buffer;
}

export function writemethod1Result(writer: Write, result: Types.Result): void {
  writer.context().push("method1", "Types.Result", "writing property");
  Types.Result.write(writer, result);
  writer.context().pop();
}
