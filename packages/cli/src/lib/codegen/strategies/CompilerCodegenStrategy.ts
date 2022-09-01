import { AnyProjectManifest, Project } from "../../project";
import { CodegenStrategy } from "../CodegenStrategy";
import { intlMsg } from "../../intl";

import { writeDirectorySync } from "@polywrap/os-js";
import { BindLanguage } from "@polywrap/schema-bind";
import { Abi } from "@polywrap/wrap-manifest-types-js";
import { Ora } from "ora";

export class CompilerCodegenStrategy extends CodegenStrategy {
  private _abi: Abi;

  constructor(config: { project: Project<AnyProjectManifest>; abi: Abi }) {
    super(config);

    this._abi = config.abi;
  }

  public async generate(_: BindLanguage, _a?: Ora): Promise<string[]> {
    const generationSubPath = await this._getGenerationSubpath();
    const binding = await this.project.generateSchemaBindings(
      this._abi,
      generationSubPath
    );

    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }

  private async _getGenerationSubpath() {
    const manifest = await this.project.getManifest();
    const manifestLanguage = await this.project.getManifestLanguage();

    const module =
      "module" in manifest.source ? manifest.source.module : undefined;

    switch (manifestLanguage) {
      case "wasm/rust":
        if (module && module.indexOf("Cargo.toml") === -1) {
          throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: module }));
        }
        return "src/wrap";
      default:
        return undefined;
    }
  }
}
