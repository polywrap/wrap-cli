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
  serializeArgs,
  deserializeArgs,
  writeArgs,
  readArgs
} from "./serialization";
import * as Types from "..";

@serializable
export class Args {
  prop: ArrayBuffer;

  static toBuffer(type: Args): ArrayBuffer {
    return serializeArgs(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Args {
    return deserializeArgs(buffer);
  }

  static write(writer: Write, type: Args): void {
    writeArgs(writer, type);
  }

  static read(reader: Read): Args {
    return readArgs(reader);
  }

  static toJson(type: Args): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Args {
    return (new JSONDeserializer(json)).decode<Args>();
  }
}
