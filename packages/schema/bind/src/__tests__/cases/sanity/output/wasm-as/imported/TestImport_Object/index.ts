import { Nullable } from "@web3api/wasm-as";
import {
  serializeTestImport_Object,
  deserializeTestImport_Object
} from "./serialization";
import * as Enums from "../../enums";

export class TestImport_Object {

  public static uri: string = "testimport.uri.eth";

  prop: string;
  enum: Enums.TestImport_Enum;
  optEnum: Nullable<Enums.TestImport_Enum>;
  enumArray: Array<Enums.TestImport_Enum>;
  optEnumArray: Array<Nullable<Enums.TestImport_Enum>> | null;

  toBuffer(): ArrayBuffer {
    return serializeTestImport_Object(this);
  }

  fromBuffer(buffer: ArrayBuffer): void {
    deserializeTestImport_Object(buffer, this);
  }
}
