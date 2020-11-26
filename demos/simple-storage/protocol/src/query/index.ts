import { Ethereum_Query, IPFS_Mutation } from 'w3/imported'

export function getData(address: string): u32 {
  const res = Ethereum_Query.callView(
    address,
    'function get() view returns (uint256)',
    ""
  )

  return U32.parseInt(res)
}
