import { Nullable } from "@web3api/wasm-as";
import {
  serializeTestImport_Object,
  deserializeTestImport_Object
} from "./serialization";

export class TestImport_Object {

  public static uri: string = "testimport.uri.eth";

  prop: string;

  toBuffer(): ArrayBuffer {
    return serializeTestImport_Object(this);
  }

  fromBuffer(buffer: ArrayBuffer): void {
    deserializeTestImport_Object(buffer, this);
  }
}
