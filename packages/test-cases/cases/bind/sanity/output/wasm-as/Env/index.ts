import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON,
  JSONSerializer,
  JSONDeserializer,
} from "@polywrap/wasm-as";
import {
  serializeEnv,
  deserializeEnv,
  writeEnv,
  readEnv
} from "./serialization";
import * as Types from "..";

@serializable
export class Env {
  prop: string;
  optProp: Option<string>;
  optMap: Option<Map<string, Option<i32>>>;

  static toBuffer(type: Env): ArrayBuffer {
    return serializeEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Env {
    return deserializeEnv(buffer);
  }

  static write(writer: Write, type: Env): void {
    writeEnv(writer, type);
  }

  static read(reader: Read): Env {
    return readEnv(reader);
  }

  static toJson(type: Env): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Env {
    return (new JSONDeserializer(json)).decode<Env>();
  }
}
