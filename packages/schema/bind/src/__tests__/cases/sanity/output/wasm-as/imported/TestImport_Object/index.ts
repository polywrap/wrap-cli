import { Nullable } from "@web3api/wasm-as";
import {
  serializeTestImport_Object,
  deserializeTestImport_Object
} from "./serialization";
import * as Objects from "../..";

export class TestImport_Object {

  public static uri: string = "testimport.uri.eth";

  object: Objects.TestImport_AnotherObject;
  optObject: Objects.TestImport_AnotherObject | null;
  objectArray: Array<Objects.TestImport_AnotherObject>;
  optObjectArray: Array<Objects.TestImport_AnotherObject | null> | null;

  static toBuffer(type: TestImport_Object): ArrayBuffer {
    return serializeTestImport_Object(type);
  }

  static fromBuffer(buffer: ArrayBuffer): TestImport_Object {
    return deserializeTestImport_Object(buffer);
  }
}
