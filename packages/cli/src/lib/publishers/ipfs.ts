import { intlMsg } from "../";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,@typescript-eslint/naming-convention
const IPFSClient = require("ipfs-http-client");
const { globSource } = IPFSClient;

export async function publishToIPFS(
  buildPath: string,
  ipfs: string
): Promise<string> {
  try {
    new URL(ipfs);
  } catch (e) {
    const urlMalformedMessage = intlMsg.lib_publishers_ipfsPublisher_urlMalformed();
    throw Error(`${urlMalformedMessage}: ${ipfs}\n${e}`);
  }

  const client = new IPFSClient(ipfs);
  const globOptions = {
    recursive: true,
  };

  const addOptions = {
    wrapWithDirectory: false,
  };

  let rootCID = "";

  for await (const file of client.addAll(
    globSource(buildPath, globOptions),
    addOptions
  )) {
    if (file.path.indexOf("/") === -1) {
      rootCID = file.cid.toString();
    }
  }

  return rootCID;
}
