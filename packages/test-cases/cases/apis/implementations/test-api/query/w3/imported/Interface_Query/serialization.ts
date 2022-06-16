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
import * as Types from "../..";

export class Input_abstractQueryMethod {
  arg: Types.Interface_Argument;
}

export function serializeabstractQueryMethodArgs(input: Input_abstractQueryMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: abstractQueryMethod");
  const sizer = new WriteSizer(sizerContext);
  writeabstractQueryMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: abstractQueryMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeabstractQueryMethodArgs(encoder, input);
  return buffer;
}

export function writeabstractQueryMethodArgs(
  writer: Write,
  input: Input_abstractQueryMethod
): void {
  writer.writeMapLength(1);
  writer.context().push("arg", "Types.Interface_Argument", "writing property");
  writer.writeString("arg");
  Types.Interface_Argument.write(writer, input.arg);
  writer.context().pop();
}

export function deserializeabstractQueryMethodResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: abstractQueryMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("abstractQueryMethod", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}
