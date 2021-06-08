import {
  Read,
  Write,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import {
  serializeTestImport_AnotherObject,
  deserializeTestImport_AnotherObject,
  writeTestImport_AnotherObject,
  readTestImport_AnotherObject
} from "./serialization";
import * as Types from "../..";

export class TestImport_AnotherObject {

  public static uri: string = "testimport.uri.eth";

  prop: string;

  static toBuffer(type: TestImport_AnotherObject): ArrayBuffer {
    return serializeTestImport_AnotherObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): TestImport_AnotherObject {
    return deserializeTestImport_AnotherObject(buffer);
  }

  static write(writer: Write, type: TestImport_AnotherObject): void {
    writeTestImport_AnotherObject(writer, type);
  }

  static read(reader: Read): TestImport_AnotherObject {
    return readTestImport_AnotherObject(reader);
  }
}
