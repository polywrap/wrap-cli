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
  serializeAnotherObject,
  deserializeAnotherObject,
  writeAnotherObject,
  readAnotherObject
} from "./serialization";
import * as Types from "..";

@serializable
export class AnotherObject {
  prop: string;

  static toBuffer(type: AnotherObject): ArrayBuffer {
    return serializeAnotherObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): AnotherObject {
    return deserializeAnotherObject(buffer);
  }

  static write(writer: Write, type: AnotherObject): void {
    writeAnotherObject(writer, type);
  }

  static read(reader: Read): AnotherObject {
    return readAnotherObject(reader);
  }

  static toJson(type: AnotherObject): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): AnotherObject {
    return (new JSONDeserializer(json)).decode<AnotherObject>();
  }
}
