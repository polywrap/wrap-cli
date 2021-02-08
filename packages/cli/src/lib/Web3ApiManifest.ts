import fs from "fs";
import YAML from "js-yaml";
import { Manifest, deserializeManifest } from "@web3api/core-js";

export class Web3ApiManifest {
  public static load(manifestPath: string): Manifest {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      throw Error(`Unable to load manifest: ${manifestPath}`);
    }

    return deserializeManifest(manifest);
  }

  public static dump(manifest: Manifest, manifestPath: string): void {
    const str = YAML.safeDump(manifest);

    if (!str) {
      throw Error(`Unable to dump manifest: ${manifest}`);
    }

    fs.writeFileSync(manifestPath, str, "utf-8");
  }
}
