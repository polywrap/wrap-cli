/*import {
  BigInt
} from '@web3api/wasm-ts'*/

export class SetDataInput {
  constructor(
    public id: string,
    // TODO: BigInt
    public value: u64
  ) { }
}

export class SetDataOutput {
  constructor(
    public storage: string
  ) { }
}
