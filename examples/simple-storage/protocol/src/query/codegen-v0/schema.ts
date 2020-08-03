/*import {
  BigInt
} from '@web3api/wasm-ts'*/

export class GetDataInput {
  constructor(
    public id: string
  ) { }
}

export class GetDataOutput {
  constructor(
    // TODO: BigInt
    public data: u64
  ) { }
}
