import { Ethereum } from '@web3api/wasm-as'

export function getData(address: string): u32 {
  const res = Ethereum.callView(
    address,
    'function get() view returns (uint256)',
    ""
  )

  return U32.parseInt(res)
}
