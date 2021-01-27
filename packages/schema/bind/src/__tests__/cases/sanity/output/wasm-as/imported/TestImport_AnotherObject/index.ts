import { Nullable } from "@web3api/wasm-as";
import {
  serializeTestImport_AnotherObject,
  deserializeTestImport_AnotherObject
} from "./serialization";
import * as Objects from "../../";

export class TestImport_AnotherObject {

  public static uri: string = "testimport.uri.eth";

  prop: string;

  toBuffer(): ArrayBuffer {
    return serializeTestImport_AnotherObject(this);
  }

  fromBuffer(buffer: ArrayBuffer): void {
    deserializeTestImport_AnotherObject(buffer, this);
  }
}
