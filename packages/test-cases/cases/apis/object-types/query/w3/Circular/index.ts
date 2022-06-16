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
  serializeCircular,
  deserializeCircular,
  writeCircular,
  readCircular
} from "./serialization";
import * as Types from "..";

@serializable
export class Circular {
  prop: string;

  static toBuffer(type: Circular): ArrayBuffer {
    return serializeCircular(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Circular {
    return deserializeCircular(buffer);
  }

  static write(writer: Write, type: Circular): void {
    writeCircular(writer, type);
  }

  static read(reader: Read): Circular {
    return readCircular(reader);
  }

  static toJson(type: Circular): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Circular {
    return (new JSONDeserializer(json)).decode<Circular>();
  }
}
