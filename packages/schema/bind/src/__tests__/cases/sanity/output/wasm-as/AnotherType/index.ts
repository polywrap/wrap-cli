import { Nullable } from "@web3api/wasm-as";
import {
  serializeAnotherType,
  deserializeAnotherType
} from "./serialization";
import * as Objects from "..";

export class AnotherType {
  prop: string | null;
  circular: Objects.CustomType;

  toBuffer(): ArrayBuffer {
    return serializeAnotherType(this);
  }

  fromBuffer(buffer: ArrayBuffer): void {
    deserializeAnotherType(buffer, this);
  }
}
