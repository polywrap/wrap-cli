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
  serializeYetAnotherObject,
  deserializeYetAnotherObject,
  writeYetAnotherObject,
  readYetAnotherObject
} from "./serialization";
import * as Types from "..";

@serializable
export class YetAnotherObject {
  prop: bool;

  static toBuffer(type: YetAnotherObject): ArrayBuffer {
    return serializeYetAnotherObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): YetAnotherObject {
    return deserializeYetAnotherObject(buffer);
  }

  static write(writer: Write, type: YetAnotherObject): void {
    writeYetAnotherObject(writer, type);
  }

  static read(reader: Read): YetAnotherObject {
    return readYetAnotherObject(reader);
  }

  static toJson(type: YetAnotherObject): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): YetAnotherObject {
    return (new JSONDeserializer(json)).decode<YetAnotherObject>();
  }
}
