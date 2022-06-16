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
  serializeArg3,
  deserializeArg3,
  writeArg3,
  readArg3
} from "./serialization";
import * as Types from "..";

@serializable
export class Arg3 {
  prop: ArrayBuffer;

  static toBuffer(type: Arg3): ArrayBuffer {
    return serializeArg3(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Arg3 {
    return deserializeArg3(buffer);
  }

  static write(writer: Write, type: Arg3): void {
    writeArg3(writer, type);
  }

  static read(reader: Read): Arg3 {
    return readArg3(reader);
  }

  static toJson(type: Arg3): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Arg3 {
    return (new JSONDeserializer(json)).decode<Arg3>();
  }
}
