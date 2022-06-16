import {
  Read,
  Write,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  JSONSerializer,
  JSONDeserializer,
} from "@web3api/wasm-as";
import {
  serializeSetDataResult,
  deserializeSetDataResult,
  writeSetDataResult,
  readSetDataResult
} from "./serialization";
import * as Types from "..";

@serializable
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

  static toJson(type: SetDataResult): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): SetDataResult {
    return (new JSONDeserializer(json)).decode<SetDataResult>();
  }
}
