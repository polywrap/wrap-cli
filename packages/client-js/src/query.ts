/*function tryGetContentFromENS(name: string) {
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  const ensAbi = [
    "function setOwner(bytes32 node, address owner) external @500000",
    "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external @500000",
    "function setResolver(bytes32 node, address resolver) external @500000",
    "function owner(bytes32 node) external view returns (address)",
    "function resolver(bytes32 node) external view returns (address)"
  ];

  const ens = new ethers.Contract(
    ensAddress,
    ensAbi,
    privateKey || provider
  )

  const nodeHash = ethers.utils.namehash(name)
  const resolver = await ens.resolver(nodeHash).call()

  if (resolver === ethers.constants.AddressZero) {
    throw Error(`ENS Resolver not configured for "${name}" (${nodeHash})`)
  }
}
*/
