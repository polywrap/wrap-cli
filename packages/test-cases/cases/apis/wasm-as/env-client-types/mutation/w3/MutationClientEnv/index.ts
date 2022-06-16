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
  serializeMutationClientEnv,
  deserializeMutationClientEnv,
  writeMutationClientEnv,
  readMutationClientEnv
} from "./serialization";
import * as Types from "..";

@serializable
export class MutationClientEnv {
  str: string;
  optStr: string | null;

  static toBuffer(type: MutationClientEnv): ArrayBuffer {
    return serializeMutationClientEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): MutationClientEnv {
    return deserializeMutationClientEnv(buffer);
  }

  static write(writer: Write, type: MutationClientEnv): void {
    writeMutationClientEnv(writer, type);
  }

  static read(reader: Read): MutationClientEnv {
    return readMutationClientEnv(reader);
  }

  static toJson(type: MutationClientEnv): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): MutationClientEnv {
    return (new JSONDeserializer(json)).decode<MutationClientEnv>();
  }
}
