//import { ethereum } from '@web3api/wasm-ts'
import {
  SetDataInput,
  SetDataOutput
} from './codegen-v0/schema'

export function setData(input: SetDataInput): SetDataOutput {
  /*ethereum.sendTransaction( 
    input.id,
    'set',
    [input.value]
  )*/

  return new SetDataOutput(
   input.id
  )
}
