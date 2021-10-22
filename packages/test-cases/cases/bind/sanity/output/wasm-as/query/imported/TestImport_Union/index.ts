import { Read, Write, Nullable, BigInt, JSON } from "@web3api/wasm-as";
import * as Types from "..";

export abstract class TestImport_Union {
  get isAnotherObject(): boolean {
    return this instanceof Types.TestImport_AnotherObject;
  }

  get AnotherObject(): Types.TestImport_AnotherObject {
    if (this instanceof AnotherObject) {
      return this.instance;
    }

    throw new Error("Union '{{__commonImport.type}}' is not of type '{{type}}'");
  }

  get isYetAnotherObject(): boolean {
    return this instanceof Types.TestImport_YetAnotherObject;
  }

  get YetAnotherObject(): Types.TestImport_YetAnotherObject {
    if (this instanceof YetAnotherObject) {
      return this.instance;
    }

    throw new Error("Union '{{__commonImport.type}}' is not of type '{{type}}'");
  }
}

class AnotherObject extends Union {
  constructor(private _instance: Types.TestImport_AnotherObject) {
    super();
  }

  get instance(): Types.TestImport_AnotherObject {
    return this._instance;
  }
}

class YetAnotherObject extends Union {
  constructor(public _instance: Types.TestImport_YetAnotherObject) {
    super();
  }

  get instance(): Types.TestImport_YetAnotherObject {
    return this._instance;
  }
}