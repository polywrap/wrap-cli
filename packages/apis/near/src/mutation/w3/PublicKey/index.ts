import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializePublicKey,
  deserializePublicKey,
  writePublicKey,
  readPublicKey
} from "./serialization";
import * as Types from "..";

export class PublicKey {
  keyType: Types.KeyType;
  data: ArrayBuffer;

  static toBuffer(type: PublicKey): ArrayBuffer {
    return serializePublicKey(type);
  }

  static fromBuffer(buffer: ArrayBuffer): PublicKey {
    return deserializePublicKey(buffer);
  }

  static write(writer: Write, type: PublicKey): void {
    writePublicKey(writer, type);
  }

  static read(reader: Read): PublicKey {
    return readPublicKey(reader);
  }
}
