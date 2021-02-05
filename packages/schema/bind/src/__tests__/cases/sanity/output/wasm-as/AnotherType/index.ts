import { Nullable } from "@web3api/wasm-as";
import {
  serializeAnotherType,
  deserializeAnotherType
} from "./serialization";
import * as Objects from "..";

export class AnotherType {
  prop: string | null;
  circular: Objects.CustomType;

  static toBuffer(type: AnotherType): ArrayBuffer {
    return serializeAnotherType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): AnotherType {
    return deserializeAnotherType(buffer);
  }
}
