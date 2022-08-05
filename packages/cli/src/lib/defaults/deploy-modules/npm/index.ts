import { Deployer } from "../../../deploy/deployer";

import { Uri } from "@polywrap/core-js";
import pacote from "pacote";
import { publish } from "libnpmpublish";

class NPMDeployer implements Deployer {
  async execute(uri: Uri, config?: { npmToken: string }): Promise<Uri> {
    if (uri.authority !== "fs") {
      throw new Error(
        `NPM Deployer error: Invalid URI: ${uri.toString()}. Supplied URI needs to be a Filesystem URI, example: fs/./build`
      );
    }

    if (!config?.npmToken) {
      throw new Error(
        `NPM Deployer error: no NPM token provided. Please provide a NPM token in the config.`
      );
    }

    const path = uri.path;
    const tarball = await pacote.tarball(path);
    const manifest = await pacote.manifest(path);

    const response = await publish(JSON.parse(manifest._resolved), tarball, {
      npmVersion: manifest.version,
      token: config.npmToken,
    });

    if (!response.ok) {
      throw new Error(
        `NPM Deployer error: ${response.status} ${response.statusText}`
      );
    }

    return new Uri(`http/https://www.npmjs.com/package/${manifest.name}`);
  }
}

export default new NPMDeployer();
