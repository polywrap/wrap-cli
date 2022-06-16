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

export class Input_get {
}

export function deserializegetArgs(argsBuf: ArrayBuffer): Input_get {
  const context: Context =  new Context("Deserializing module-type: get");

  return {
  };
}

export function serializegetResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: get");
  const sizer = new WriteSizer(sizerContext);
  writegetResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: get");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetResult(encoder, result);
  return buffer;
}

export function writegetResult(writer: Write, result: string): void {
  writer.context().push("get", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
