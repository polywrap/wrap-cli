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
  serializePair,
  deserializePair,
  writePair,
  readPair
} from "./serialization";
import * as Types from "..";

@serializable
export class Pair {
  x: i32;
  y: i32;

  static toBuffer(type: Pair): ArrayBuffer {
    return serializePair(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Pair {
    return deserializePair(buffer);
  }

  static write(writer: Write, type: Pair): void {
    writePair(writer, type);
  }

  static read(reader: Read): Pair {
    return readPair(reader);
  }

  static toJson(type: Pair): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Pair {
    return (new JSONDeserializer(json)).decode<Pair>();
  }
}
