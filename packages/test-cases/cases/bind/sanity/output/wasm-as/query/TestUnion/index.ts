import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeTestUnion,
  deserializeTestUnion,
  writeTestUnion,
  readTestUnion
} from "./serialization";
import * as Types from "..";

export abstract class TestUnion {

  get isUnionTypeA(): boolean {
    return this instanceof TestUnionUnionTypeA;
  }

  function getUnionTypeA(): Types.UnionTypeA {
    if (!this.isUnionTypeA) {
      throw Error("...")
    }
    return (this as TestUnionUnionTypeA).instance;
  }

  // TODO:
  // x is${type} checkers
  // x get${type} getters
}

class TestUnionUnionTypeA extends TestUnion {
  constructor(public _instance: Types.UnionTypeA) {
    super(TestUnionType.UnionTypeA);
  }

  get instance(): Types.UnionTypeA {
    return this._instance;
  }
}

const vals: TestUnion[] = [
  new TestUnionUnionTypeA(new UnionTypeA())
]

for (const val of vals) {
  if (val.isUnionTypeA) {
    const unionTypeA = val.getUnionTypeA()
  }
}

