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
  serializeImplementationType,
  deserializeImplementationType,
  writeImplementationType,
  readImplementationType
} from "./serialization";
import * as Types from "..";

@serializable
export class ImplementationType {
  str: string;
  uint8: u8;

  static toBuffer(type: ImplementationType): ArrayBuffer {
    return serializeImplementationType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ImplementationType {
    return deserializeImplementationType(buffer);
  }

  static write(writer: Write, type: ImplementationType): void {
    writeImplementationType(writer, type);
  }

  static read(reader: Read): ImplementationType {
    return readImplementationType(reader);
  }

  static toJson(type: ImplementationType): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): ImplementationType {
    return (new JSONDeserializer(json)).decode<ImplementationType>();
  }
}
