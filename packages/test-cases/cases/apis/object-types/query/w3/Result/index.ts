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
  serializeResult,
  deserializeResult,
  writeResult,
  readResult
} from "./serialization";
import * as Types from "..";

@serializable
export class Result {
  prop: string;
  nested: Types.Nested;

  static toBuffer(type: Result): ArrayBuffer {
    return serializeResult(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Result {
    return deserializeResult(buffer);
  }

  static write(writer: Write, type: Result): void {
    writeResult(writer, type);
  }

  static read(reader: Read): Result {
    return readResult(reader);
  }

  static toJson(type: Result): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Result {
    return (new JSONDeserializer(json)).decode<Result>();
  }
}
