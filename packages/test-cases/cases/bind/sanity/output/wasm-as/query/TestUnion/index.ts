import { Read, Write, Nullable, BigInt, JSON } from "@web3api/wasm-as";
import {
  serializeTestUnion,
  deserializeTestUnion,
  writeTestUnion,
  readTestUnion,
} from "./serialization";
import * as Types from "..";

export abstract class TestUnion {
  get isUnionTypeA(): boolean {
    return this instanceof Types.UnionTypeA;
  }

  get UnionTypeA(): Types.UnionTypeA {
    if (this instanceof UnionTypeA) {
      return this.instance;
    }

    throw new Error("Union '{{__commonImport.type}}' is not of type '{{type}}'");
  }

  get isUnionTypeB(): boolean {
    return this instanceof Types.UnionTypeB;
  }

  get UnionTypeB(): Types.UnionTypeB {
    if (this instanceof UnionTypeB) {
      return this.instance;
    }

    throw new Error("Union '{{__commonImport.type}}' is not of type '{{type}}'");
  }
}

class UnionTypeA extends TestUnion {
  constructor(private _instance: Types.UnionTypeA) {
    super();
  }

  get instance(): Types.UnionTypeA {
    return this._instance;
  }
}

class UnionTypeB extends TestUnion {
  constructor(public _instance: Types.UnionTypeB) {
    super();
  }

  get instance(): Types.UnionTypeB {
    return this._instance;
  }
}
