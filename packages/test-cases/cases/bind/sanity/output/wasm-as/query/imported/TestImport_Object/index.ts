import {
  Read,
  Write,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import {
  serializeTestImport_Object,
  deserializeTestImport_Object,
  writeTestImport_Object,
  readTestImport_Object
} from "./serialization";
import * as Types from "../..";

export class TestImport_Object {

  public static uri: string = "testimport.uri.eth";

  object: Types.TestImport_AnotherObject;
  optObject: Types.TestImport_AnotherObject | null;
  objectArray: Array<Types.TestImport_AnotherObject>;
  optObjectArray: Array<Types.TestImport_AnotherObject | null> | null;
  en: Types.TestImport_Enum;
  optEnum: Nullable<Types.TestImport_Enum>;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray: Array<Nullable<Types.TestImport_Enum>> | null;

  static toBuffer(type: TestImport_Object): ArrayBuffer {
    return serializeTestImport_Object(type);
  }

  static fromBuffer(buffer: ArrayBuffer): TestImport_Object {
    return deserializeTestImport_Object(buffer);
  }

  static write(writer: Write, type: TestImport_Object): void {
    writeTestImport_Object(writer, type);
  }

  static read(reader: Read): TestImport_Object {
    return readTestImport_Object(reader);
  }
}
