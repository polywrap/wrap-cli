import { DeployModule } from "../../../deploy";
import { AddResult, ArgsAddDir, DirectoryEntry } from "./types";
import { readDirContents } from "./utils";

import { Uri } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import * as Sys from "@polywrap/sys-config-bundle-js";
import { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";

const isValidUri = (uri: Uri) =>
  uri.authority === "fs" || uri.authority === "file";

class IPFSDeployer implements DeployModule {
  async execute(uri: Uri, config?: { gatewayUri: string }): Promise<Uri> {
    if (!isValidUri(uri)) {
      throw new Error(
        `IPFS Deployer error: Invalid URI: ${uri.toString()}. Supplied URI needs to be a Filesystem URI, example: fs/./build`
      );
    }

    const path = uri.path;
    const data: DirectoryEntry = await readDirContents(path, "");

    const ipfsProvider = config?.gatewayUri ?? "http://localhost:5001";

    const args: ArgsAddDir = {
      data,
      ipfsProvider,
      addOptions: {
        pin: true,
        wrapWithDirectory: false,
      },
      timeout: 10000,
    };

    const clientConfig = new PolywrapClientConfigBuilder()
      .addDefaults()
      .build();
    const client: PolywrapClient = new PolywrapClient(clientConfig);

    const result = await client.invoke<AddResult[]>({
      uri: Sys.bundle.ipfsHttpClient.uri,
      method: "addDir",
      args: (args as unknown) as Record<string, unknown>,
    });

    if (!result.ok) throw result.error;

    let rootCID = "";
    for (const addResult of result.value) {
      if (addResult.name.indexOf("/") === -1) {
        rootCID = addResult.hash;
      }
    }

    return new Uri(`ipfs/${rootCID}`);
  }
}

export default new IPFSDeployer();
