import axios from "axios";

export async function getTestEnvProviders(
  ipfsProvider?: string,
  ethProvider?: string
): Promise<{ ipfsProvider?: string; ethProvider?: string }> {
  const result = {
    ipfsProvider: ipfsProvider,
    ethProvider: ethProvider,
  };

  // If defaults have not been provided
  if (!result.ethProvider || !result.ipfsProvider) {
    // Try to fetch them from the local dev-server
    try {
      const {
        data: { ipfs, ethereum },
      } = await axios.get("http://localhost:4040/providers");
      result.ipfsProvider = result.ipfsProvider || ipfs;
      result.ethProvider = result.ethProvider || ethereum;
    } catch (e) {
      // Dev server not found
    }
  }

  return result;
}
