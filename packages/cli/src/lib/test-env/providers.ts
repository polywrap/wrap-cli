import { providers } from "@web3api/test-env-js";

export async function getTestEnvProviders(
  ipfsProvider?: string,
  ethProvider?: string
): Promise<{ ipfsProvider?: string; ethProvider?: string }> {
  return {
    ipfsProvider: ipfsProvider ?? providers.ipfs,
    ethProvider: ethProvider ?? providers.ethereum,
  };
}
