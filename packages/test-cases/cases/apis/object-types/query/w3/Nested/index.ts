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
  serializeNested,
  deserializeNested,
  writeNested,
  readNested
} from "./serialization";
import * as Types from "..";

@serializable
export class Nested {
  prop: string;

  static toBuffer(type: Nested): ArrayBuffer {
    return serializeNested(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Nested {
    return deserializeNested(buffer);
  }

  static write(writer: Write, type: Nested): void {
    writeNested(writer, type);
  }

  static read(reader: Read): Nested {
    return readNested(reader);
  }

  static toJson(type: Nested): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Nested {
    return (new JSONDeserializer(json)).decode<Nested>();
  }
}
