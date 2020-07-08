import { ethereum } from '@web3api/ts-query'
import { BigInt } from '@web3api/ts-runtime'
import {
  GetDataInput,
  GetDataOutput
} from './codegen-v0/schema'

export function getData(input: GetDataInput): GetDataOutput {
  const data = ethereum.callView(
    input.id,
    'get'
  ) as BigInt

  return {
    data
  }
}
