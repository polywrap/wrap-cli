import { ethereum } from '@web3api/ts-mutation'
import {
  SetDataInput,
  SetDataOutput
} from './codegen-v0/schema'

export function setData(input: SetDataInput): SetDataOutput {
  ethereum.sendTransaction( 
    input.id,
    'set',
    [input.value]
  )

  return {
    storage: input.id
  }
}
