import { EthereumQuery as Ethereum } from './.w3/imports/Ethereum';

export function getData(address: string): u32 {
  const res = Ethereum.callView({
    address,
    method: 'function get() view returns (uint256)',
    args: []
  });

  return U32.parseInt(res)
}
