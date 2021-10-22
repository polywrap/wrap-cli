import { Read, Write, Nullable, BigInt, JSON } from "@web3api/wasm-as";
import * as Types from "..";

export abstract class CustomUnion {
  get isAnotherObject(): boolean {
    return this instanceof Types.AnotherObject;
  }

  get AnotherObject(): Types.AnotherObject {
    if (this instanceof AnotherObject) {
      return this.instance;
    }

    throw new Error("Union '{{__commonImport.type}}' is not of type '{{type}}'");
  }

  get isYetAnotherObject(): boolean {
    return this instanceof Types.YetAnotherObject;
  }

  get YetAnotherObject(): Types.YetAnotherObject {
    if (this instanceof YetAnotherObject) {
      return this.instance;
    }

    throw new Error("Union '{{__commonImport.type}}' is not of type '{{type}}'");
  }
}

class AnotherObject extends CustomUnion {
  constructor(private _instance: Types.AnotherObject) {
    super();
  }

  get instance(): Types.AnotherObject {
    return this._instance;
  }
}

class YetAnotherObject extends CustomUnion {
  constructor(public _instance: Types.YetAnotherObject) {
    super();
  }

  get instance(): Types.YetAnotherObject {
    return this._instance;
  }
}