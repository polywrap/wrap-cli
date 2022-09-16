import { ScriptHelper } from "./AssemblyscriptHelper";

import Toml from "toml";
import fse from "fs-extra";
import path from "path";

export class RustHelper implements ScriptHelper {
  async linkPackages(args: {
    pkgs: {
      dir: string;
      name: string;
    }[];
    manifestDir: string;
    projectVolumeDir: string;
  }): Promise<void> {
    const cargoToml = Toml.parse(
      fse.readFileSync(path.join(args.manifestDir, "Cargo.toml"), "utf8")
    );
  }
}
