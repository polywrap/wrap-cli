import {
  Read,
  Write,
  Nullable,
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
export class TestImport_Env {
  enviroProp: string;

  static toBuffer(type: TestImport_Env): ArrayBuffer {
    return serializeEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): TestImport_Env {
    return deserializeEnv(buffer);
  }

  static write(writer: Write, type: TestImport_Env): void {
    writeEnv(writer, type);
  }

  static read(reader: Read): TestImport_Env {
    return readEnv(reader);
  }

  static toJson(type: TestImport_Env): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): TestImport_Env {
    return (new JSONDeserializer(json)).decode<TestImport_Env>();
  }
}
