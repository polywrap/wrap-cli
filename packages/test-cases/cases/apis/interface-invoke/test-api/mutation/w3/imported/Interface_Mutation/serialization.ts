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

export class Input_abstractMutationMethod {
  arg: u8;
}

export function serializeabstractMutationMethodArgs(input: Input_abstractMutationMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: abstractMutationMethod");
  const sizer = new WriteSizer(sizerContext);
  writeabstractMutationMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: abstractMutationMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeabstractMutationMethodArgs(encoder, input);
  return buffer;
}

export function writeabstractMutationMethodArgs(
  writer: Write,
  input: Input_abstractMutationMethod
): void {
  writer.writeMapLength(1);
  writer.context().push("arg", "u8", "writing property");
  writer.writeString("arg");
  writer.writeUInt8(input.arg);
  writer.context().pop();
}

export function deserializeabstractMutationMethodResult(buffer: ArrayBuffer): u8 {
  const context: Context =  new Context("Deserializing imported module-type: abstractMutationMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("abstractMutationMethod", "u8", "reading function output");
  const res: u8 = reader.readUInt8();
  reader.context().pop();

  return res;
}
