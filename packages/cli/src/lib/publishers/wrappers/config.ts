export const wrappersConfig = {
  gatewayURI: process.env.WRAPPERS_GATEWAY ?? "https://ipfs.wrappers.io",
};

export const ethersConfig = {
  providerNetwork:
    process.env.ETHEREUM_NETWORK_PROVIDER ?? "http://localhost:8545",
  privateKey: process.env.ETHEREUM_PRIVATE_KEY ?? "",
};

export const ensConfig = {
  resolverAddr:
    process.env.ENS_RESOLVER_ADDR ??
    "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615",
  resolverAbi: [
    "function contenthash(bytes32 node) external view returns (bytes memory)",
    "function setContenthash(bytes32 node, bytes calldata hash) external",
    "event ContenthashChanged(bytes32 indexed node, bytes hash)",
  ],
};
