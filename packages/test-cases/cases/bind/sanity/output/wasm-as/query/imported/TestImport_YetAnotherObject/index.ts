import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeTestImport_YetAnotherObject,
  deserializeTestImport_YetAnotherObject,
  writeTestImport_YetAnotherObject,
  readTestImport_YetAnotherObject
} from "./serialization";
import * as Types from "../..";

export class TestImport_YetAnotherObject {

  public static uri: string = "testimport.uri.eth";

  prop: bool;

  static toBuffer(type: TestImport_YetAnotherObject): ArrayBuffer {
    return serializeTestImport_YetAnotherObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): TestImport_YetAnotherObject {
    return deserializeTestImport_YetAnotherObject(buffer);
  }

  static write(writer: Write, type: TestImport_YetAnotherObject): void {
    writeTestImport_YetAnotherObject(writer, type);
  }

  static read(reader: Read): TestImport_YetAnotherObject {
    return readTestImport_YetAnotherObject(reader);
  }
}
