import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeTestImport_Union,
  deserializeTestImport_Union,
  writeTestImport_Union,
  readTestImport_Union
} from "./serialization";
import * as Types from "..";

export abstract class TestImport_Union {

  static toBuffer(type: TestImport_Union): ArrayBuffer {
    return serializeTestImport_Union(type);
  }

  static fromBuffer(buffer: ArrayBuffer): TestImport_Union {
    return deserializeTestImport_Union(buffer);
  }

  static write(writer: Write, type: TestImport_Union): void {
    writeTestImport_Union(writer, type);
  }

  static read(reader: Read): TestImport_Union {
    return readTestImport_Union(reader);
  }

  get isTestImport_AnotherObject(): boolean {
    return this instanceof UnionMember_TestImport_AnotherObject;
  }

  get TestImport_AnotherObject(): Types.TestImport_AnotherObject {
    if (this instanceof UnionMember_TestImport_AnotherObject) {
      return this.instance;
    }

    throw new Error("Union '' is not of type 'TestImport_AnotherObject'");
  }

  get isTestImport_YetAnotherObject(): boolean {
    return this instanceof UnionMember_TestImport_YetAnotherObject;
  }

  get TestImport_YetAnotherObject(): Types.TestImport_YetAnotherObject {
    if (this instanceof UnionMember_TestImport_YetAnotherObject) {
      return this.instance;
    }

    throw new Error("Union '' is not of type 'TestImport_YetAnotherObject'");
  }

  static create<T>(value: T): TestImport_Union {
    if (value instanceof Types.TestImport_AnotherObject) {
      return new UnionMember_TestImport_AnotherObject(value);
    }
    if (value instanceof Types.TestImport_YetAnotherObject) {
      return new UnionMember_TestImport_YetAnotherObject(value);
    }
  }
}

const Union_Class = TestImport_Union;

class UnionMember_TestImport_AnotherObject extends Union_Class {
  constructor(private _instance: Types.TestImport_AnotherObject) {
    super();
  }

  get instance(): Types.TestImport_AnotherObject {
    return this._instance;
  }
}
class UnionMember_TestImport_YetAnotherObject extends Union_Class {
  constructor(private _instance: Types.TestImport_YetAnotherObject) {
    super();
  }

  get instance(): Types.TestImport_YetAnotherObject {
    return this._instance;
  }
}
