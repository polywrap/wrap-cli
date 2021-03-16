// eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
import { getIntl } from "../internationalization";

const IPFSClient = require("ipfs-http-client");
const { globSource } = IPFSClient;

export async function publishToIPFS(
  buildPath: string,
  ipfs: string
): Promise<string> {
  try {
    new URL(ipfs);
  } catch (e) {
    const intl = getIntl();
    const urlMalformedMessage = intl.formatMessage({
      id: "lib_publishers_ipfsPublisher_urlMalformed",
      defaultMessage: "IPFS URL Malformed",
      description: "IPFS URL has incorrect syntax",
    });
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
