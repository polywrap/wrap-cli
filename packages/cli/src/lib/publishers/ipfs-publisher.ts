const IPFSClient = require("ipfs-http-client");
const { globSource } = IPFSClient;

export async function publishToIPFS(buildPath: string, ipfs: string): Promise<string> {
  let url;
  try {
    url = new URL(ipfs);
  } catch (e) {
    throw Error(`IPFS URL Malformed: ${ipfs}\n${e}`)
  }

  const client = new IPFSClient(ipfs);
  const globOptions = {
    recursive: true
  };

  const addOptions = {
    wrapWithDirectory: false
  };

  let rootCID = '';

  for await (const file of client.addAll(
    globSource(buildPath, globOptions), addOptions
  )) {
    if (file.path.indexOf('/') === -1) {
      rootCID = file.cid.toString();
    }
  }

  return rootCID;
}
