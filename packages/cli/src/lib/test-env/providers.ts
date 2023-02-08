import { ETH_ENS_IPFS_MODULE_CONSTANTS } from "../../lib"

export function getTestEnvProviders(
  ipfsProvider?: string,
  ethProvider?: string
): { ipfsProvider?: string; ethProvider?: string } {
  return {
    ipfsProvider: ipfsProvider ?? ETH_ENS_IPFS_MODULE_CONSTANTS.ipfsProvider,
    ethProvider: ethProvider ?? ETH_ENS_IPFS_MODULE_CONSTANTS.ethereumProvider,
  };
}
