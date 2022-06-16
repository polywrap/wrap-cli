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
  serializeArg1,
  deserializeArg1,
  writeArg1,
  readArg1
} from "./serialization";
import * as Types from "..";

@serializable
export class Arg1 {
  m_const: string;

  static toBuffer(type: Arg1): ArrayBuffer {
    return serializeArg1(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Arg1 {
    return deserializeArg1(buffer);
  }

  static write(writer: Write, type: Arg1): void {
    writeArg1(writer, type);
  }

  static read(reader: Read): Arg1 {
    return readArg1(reader);
  }

  static toJson(type: Arg1): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Arg1 {
    return (new JSONDeserializer(json)).decode<Arg1>();
  }
}
