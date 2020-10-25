import YAML from "js-yaml";
import fs from "fs";
import { Web3API as Client} from "@web3api/client-js";
import { Manifest } from "./Manifest";

export class Web3API {
  public static load(manifestPath: string): Manifest {
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest | undefined;

    if (!manifest) {
      throw Error(`Unable to parse manifest: ${manifestPath}`);
    }
  
    Client.validateManifest(manifest)

    return manifest;
  }

  public static dump(manifest: Manifest, manifestPath: string) {
    const str = YAML.safeDump(manifest);

    if (!str) {
      throw Error(`Unable to dump manifest: ${manifest}`);
    }

    fs.writeFileSync(manifestPath, str, "utf-8");
  }
}
