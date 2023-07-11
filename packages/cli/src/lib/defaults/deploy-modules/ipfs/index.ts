import { DeployModule } from "../../../deploy";

import { Uri } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { DefaultBundle } from "@polywrap/client-config-builder-js";
import fs from "fs";

const isValidUri = (uri: Uri) =>
  uri.authority === "fs" || uri.authority === "file";

interface FileEntry {
  name: string;
  data: Uint8Array;
}

interface DirectoryEntry {
  name: string;
  directories?: DirectoryEntry[];
  files?: FileEntry[];
}

interface AddOptions {
  pin?: boolean;
  onlyHash?: boolean;
  wrapWithDirectory?: boolean;
}

interface AddResult {
  name: string;
  hash: string;
  size: string;
}

interface ArgsAddDir {
  data: DirectoryEntry;
  ipfsProvider: string;
  timeout?: number;
  addOptions?: AddOptions;
}

const readDirContents = async (
  path: string,
  dirName: string
): Promise<DirectoryEntry> => {
  const dirents: fs.Dirent[] = await fs.promises.readdir(path, {
    withFileTypes: true,
  });
  const data: DirectoryEntry = { name: dirName };

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const subDir = await readDirContents(
        `${path}/${dirent.name}`,
        `${dirName}/${dirent.name}`
      );
      data.directories = data.directories ?? [];
      data.directories?.push(subDir);
    } else {
      const fileData = await fs.promises.readFile(`${path}/${dirent.name}`);
      data.files = data.files ?? [];
      data.files?.push({
        name: dirent.name,
        data: fileData,
      });
    }
  }

  return data;
};

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

    const client = new PolywrapClient();

    const result = await client.invoke<AddResult[]>({
      uri: DefaultBundle.embeds.ipfsHttpClient.uri.uri,
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
