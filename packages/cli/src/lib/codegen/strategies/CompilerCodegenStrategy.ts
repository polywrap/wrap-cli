import { CodegenStrategy } from "../CodegenStrategy";
import { intlMsg } from "../../intl";

import { writeDirectorySync } from "@polywrap/os-js";
import { BindLanguage } from "@polywrap/schema-bind";
import { Ora } from "ora";

export class CompilerCodegenStrategy extends CodegenStrategy {
  public async generate(_: BindLanguage, _a?: Ora): Promise<string[]> {
    const generationSubPath = await this._getGenerationSubpath();
    const abi = await this.schemaComposer.getComposedAbis();
    const binding = await this.project.generateSchemaBindings(
      abi,
      generationSubPath
    );

    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }

  private async _getGenerationSubpath(): Promise<string | undefined> {
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
