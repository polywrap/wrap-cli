import { providers } from "@polywrap/test-env-js";

export function getTestEnvProviders(
  ipfsProvider?: string,
  ethProvider?: string
): { ipfsProvider?: string; ethProvider?: string } {
  return {
    ipfsProvider: ipfsProvider ?? providers.ipfs,
    ethProvider: ethProvider ?? providers.ethereum,
  };
}
