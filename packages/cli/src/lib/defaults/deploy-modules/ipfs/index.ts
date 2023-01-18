import { DeployModule } from "../../../deploy";

import { Uri } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,@typescript-eslint/naming-convention
const IPFSClient = require("ipfs-http-client");
const { globSource } = IPFSClient;

const isValidUri = (uri: Uri) => uri.authority === "fs";

class IPFSDeployer implements DeployModule {
  async execute(uri: Uri, config?: { gatewayUri: string }): Promise<Uri> {
    if (!isValidUri(uri)) {
      throw new Error(
        `IPFS Deployer error: Invalid URI: ${uri.toString()}. Supplied URI needs to be a Filesystem URI, example: fs/./build`
      );
    }

    const path = uri.path;

    const ipfsUrl = config?.gatewayUri ?? "http://localhost:5001";

    const client = new IPFSClient({ url: ipfsUrl });
    const globOptions = {
      recursive: true,
    };

    const addOptions = {
      wrapWithDirectory: false,
    };

    let rootCID = "";

    for await (const file of client.addAll(
      globSource(path, globOptions),
      addOptions
    )) {
      if (file.path.indexOf("/") === -1) {
        rootCID = file.cid.toString();
      }
    }

    return new Uri(`ipfs/${rootCID}`);
  }
}

export default new IPFSDeployer();
