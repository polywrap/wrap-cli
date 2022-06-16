import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeSetDataResult,
  deserializeSetDataResult,
  writeSetDataResult,
  readSetDataResult
} from "./serialization";
import * as Types from "..";

export class SetDataResult {
  txReceipt: string;
  value: u32;

  static toBuffer(type: SetDataResult): ArrayBuffer {
    return serializeSetDataResult(type);
  }

  static fromBuffer(buffer: ArrayBuffer): SetDataResult {
    return deserializeSetDataResult(buffer);
  }

  static write(writer: Write, type: SetDataResult): void {
    writeSetDataResult(writer, type);
  }

  static read(reader: Read): SetDataResult {
    return readSetDataResult(reader);
  }
}
