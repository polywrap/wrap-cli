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
  serializeQueryClientEnv,
  deserializeQueryClientEnv,
  writeQueryClientEnv,
  readQueryClientEnv
} from "./serialization";
import * as Types from "..";

@serializable
export class QueryClientEnv {
  str: string;
  optStr: string | null;

  static toBuffer(type: QueryClientEnv): ArrayBuffer {
    return serializeQueryClientEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): QueryClientEnv {
    return deserializeQueryClientEnv(buffer);
  }

  static write(writer: Write, type: QueryClientEnv): void {
    writeQueryClientEnv(writer, type);
  }

  static read(reader: Read): QueryClientEnv {
    return readQueryClientEnv(reader);
  }

  static toJson(type: QueryClientEnv): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): QueryClientEnv {
    return (new JSONDeserializer(json)).decode<QueryClientEnv>();
  }
}
