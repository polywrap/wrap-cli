import YAML from "js-yaml";
import fs from "fs";

import { Manifest } from "./Manifest";
import { manifestValidation } from "./helpers/validators";

export class Web3API {
  public static load(manifestPath: string): Manifest {
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest | undefined;

    if (!manifest) {
      throw Error(`Unable to parse manifest: ${manifestPath}`);
    }
    const valueError = manifestValidation(manifest)
    console.log(valueError)
    // if (valueError) {
    //   throw new Error(valueError)
    // }

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
