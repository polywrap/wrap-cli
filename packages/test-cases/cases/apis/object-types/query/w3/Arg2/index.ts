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
  serializeArg2,
  deserializeArg2,
  writeArg2,
  readArg2
} from "./serialization";
import * as Types from "..";

@serializable
export class Arg2 {
  prop: string;
  circular: Types.Circular;

  static toBuffer(type: Arg2): ArrayBuffer {
    return serializeArg2(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Arg2 {
    return deserializeArg2(buffer);
  }

  static write(writer: Write, type: Arg2): void {
    writeArg2(writer, type);
  }

  static read(reader: Read): Arg2 {
    return readArg2(reader);
  }

  static toJson(type: Arg2): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Arg2 {
    return (new JSONDeserializer(json)).decode<Arg2>();
  }
}
