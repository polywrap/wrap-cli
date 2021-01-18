import { Nullable } from "@web3api/wasm-as";
import {
  serializeAnotherType,
  deserializeAnotherType
} from "./serialization";

export class AnotherType {
  prop: string | null;

  toBuffer(): ArrayBuffer {
    return serializeAnotherType(this);
  }

  fromBuffer(buffer: ArrayBuffer): void {
    deserializeAnotherType(buffer, this);
  }
}
