import { Nullable } from "@web3api/wasm-as";
import { serializeAnotherType } from "./serialize";
import { deserializeAnotherType } from "./deserialize";

export class AnotherType {
  prop: string | null;

  toBuffer(): ArrayBuffer {
    return serializeAnotherType(this);
  }

  fromBuffer(buffer: ArrayBuffer): void {
    deserializeAnotherType(buffer, this);
  }
}
