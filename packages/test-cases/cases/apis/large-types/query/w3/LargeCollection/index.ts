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
  serializeLargeCollection,
  deserializeLargeCollection,
  writeLargeCollection,
  readLargeCollection
} from "./serialization";
import * as Types from "..";

@serializable
export class LargeCollection {
  largeStr: string;
  largeBytes: ArrayBuffer;
  largeStrArray: Array<string>;
  largeBytesArray: Array<ArrayBuffer>;

  static toBuffer(type: LargeCollection): ArrayBuffer {
    return serializeLargeCollection(type);
  }

  static fromBuffer(buffer: ArrayBuffer): LargeCollection {
    return deserializeLargeCollection(buffer);
  }

  static write(writer: Write, type: LargeCollection): void {
    writeLargeCollection(writer, type);
  }

  static read(reader: Read): LargeCollection {
    return readLargeCollection(reader);
  }

  static toJson(type: LargeCollection): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): LargeCollection {
    return (new JSONDeserializer(json)).decode<LargeCollection>();
  }
}
