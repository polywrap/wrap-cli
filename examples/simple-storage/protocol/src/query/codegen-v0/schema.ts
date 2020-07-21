import {
  BigInt
} from '@web3api/ts-runtime'

export class GetDataInput {
  constructor(
    public id: string
  ) { }
}

export class GetDataOutput {
  constructor(
    public data: BigInt
  ) { }
}
