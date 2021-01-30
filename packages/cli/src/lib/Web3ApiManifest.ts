import fs from "fs";
import YAML from "js-yaml";
import { Manifest, sanitizeAndUpgrade } from "@web3api/core-js";

export class Web3ApiManifest {
  public static load(manifestPath: string): Manifest {
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as
      | Manifest
      | undefined;

    if (!manifest) {
      throw Error(`Unable to parse manifest: ${manifestPath}`);
    }

    manifest = sanitizeAndUpgrade(manifest);

    return manifest;
  }

  public static dump(manifest: Manifest, manifestPath: string): void {
    const str = YAML.safeDump(manifest);

    if (!str) {
      throw Error(`Unable to dump manifest: ${manifest}`);
    }

    fs.writeFileSync(manifestPath, str, "utf-8");
  }
}
