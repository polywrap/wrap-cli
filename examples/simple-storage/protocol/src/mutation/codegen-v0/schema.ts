import {
  BigInt
} from '@web3api/ts-runtime'

export class SetDataInput {
  constructor(
    public id: string,
    public value: BigInt
  ) { }
}

export class SetDataOutput {
  constructor(
    public storage: string
  ) { }
}
