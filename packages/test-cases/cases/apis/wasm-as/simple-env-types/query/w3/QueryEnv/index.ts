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
  str: string | null;
  requiredInt: i32;

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
