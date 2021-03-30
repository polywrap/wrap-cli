
// TODO: use this if localCompare doesn't exist in AssemblyScript (it's not in the docs)
export function compareAddresses(ref: string, other: string): u8 {
  const n: u8 = Math.min(ref.length, other.length);
  for (let i = 0; i < n; i++) {
    if (ref.charAt(i) < other.charAt(i))
      return -1;
    else if (ref.charAt(i) > other.charAt(i))
      return 1;
  }
  return ref.length - other.length;
}

export function resolveChainId(chainId: ChainId): u32 {
  switch (chainId) {
    case 0: // mainnet
      return 1;
    case 1: // ropsten
      return 3;
    case 2: // rinkeby
      return 4;
    case 3: // goerli
      return 420;
    case 4: // kovan
      return 42;
    default:
      throw Error("Unknown chain ID. This should never happen.");
  }
}
