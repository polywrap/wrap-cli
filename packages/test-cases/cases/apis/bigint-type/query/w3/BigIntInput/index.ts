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
  serializeBigIntInput,
  deserializeBigIntInput,
  writeBigIntInput,
  readBigIntInput
} from "./serialization";
import * as Types from "..";

@serializable
export class BigIntInput {
  prop1: BigInt;
  prop2: BigInt | null;

  static toBuffer(type: BigIntInput): ArrayBuffer {
    return serializeBigIntInput(type);
  }

  static fromBuffer(buffer: ArrayBuffer): BigIntInput {
    return deserializeBigIntInput(buffer);
  }

  static write(writer: Write, type: BigIntInput): void {
    writeBigIntInput(writer, type);
  }

  static read(reader: Read): BigIntInput {
    return readBigIntInput(reader);
  }

  static toJson(type: BigIntInput): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): BigIntInput {
    return (new JSONDeserializer(json)).decode<BigIntInput>();
  }
}
