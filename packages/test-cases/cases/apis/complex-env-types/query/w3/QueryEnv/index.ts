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
  serializeQueryEnv,
  deserializeQueryEnv,
  writeQueryEnv,
  readQueryEnv
} from "./serialization";
import * as Types from "..";

@serializable
export class QueryEnv {
  queryStr: string | null;
  str: string;
  optStr: string | null;
  optFilledStr: string | null;
  m_number: i8;
  optNumber: Nullable<i8>;
  m_bool: bool;
  optBool: Nullable<bool>;
  en: Types.EnvEnum;
  optEnum: Nullable<Types.EnvEnum>;
  object: Types.EnvObject;
  optObject: Types.EnvObject | null;
  array: Array<u32>;

  static toBuffer(type: QueryEnv): ArrayBuffer {
    return serializeQueryEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): QueryEnv {
    return deserializeQueryEnv(buffer);
  }

  static write(writer: Write, type: QueryEnv): void {
    writeQueryEnv(writer, type);
  }

  static read(reader: Read): QueryEnv {
    return readQueryEnv(reader);
  }

  static toJson(type: QueryEnv): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): QueryEnv {
    return (new JSONDeserializer(json)).decode<QueryEnv>();
  }
}
