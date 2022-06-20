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
  serializeSetDataOptions,
  deserializeSetDataOptions,
  writeSetDataOptions,
  readSetDataOptions
} from "./serialization";
import * as Types from "..";

@serializable
export class SetDataOptions {
  address: string;
  value: u32;

  static toBuffer(type: SetDataOptions): ArrayBuffer {
    return serializeSetDataOptions(type);
  }

  static fromBuffer(buffer: ArrayBuffer): SetDataOptions {
    return deserializeSetDataOptions(buffer);
  }

  static write(writer: Write, type: SetDataOptions): void {
    writeSetDataOptions(writer, type);
  }

  static read(reader: Read): SetDataOptions {
    return readSetDataOptions(reader);
  }

  static toJson(type: SetDataOptions): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): SetDataOptions {
    return (new JSONDeserializer(json)).decode<SetDataOptions>();
  }
}
