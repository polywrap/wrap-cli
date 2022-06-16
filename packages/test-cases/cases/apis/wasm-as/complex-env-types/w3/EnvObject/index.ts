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
  serializeEnvObject,
  deserializeEnvObject,
  writeEnvObject,
  readEnvObject
} from "./serialization";
import * as Types from "..";

@serializable
export class EnvObject {
  prop: string;

  static toBuffer(type: EnvObject): ArrayBuffer {
    return serializeEnvObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): EnvObject {
    return deserializeEnvObject(buffer);
  }

  static write(writer: Write, type: EnvObject): void {
    writeEnvObject(writer, type);
  }

  static read(reader: Read): EnvObject {
    return readEnvObject(reader);
  }

  static toJson(type: EnvObject): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): EnvObject {
    return (new JSONDeserializer(json)).decode<EnvObject>();
  }
}
