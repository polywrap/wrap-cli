// import { ethereum, BigInt } from '@web3api/wasm-ts'
import {
  GetDataInput,
  GetDataOutput
} from './codegen-v0/schema'

export function getData(input: GetDataInput): GetDataOutput {
  /*const data = ethereum.callView(
    input.id,
    'get'
  ) as BigInt*/
  const data: u64 = 5;

  return new GetDataOutput(
    data
  )
}
