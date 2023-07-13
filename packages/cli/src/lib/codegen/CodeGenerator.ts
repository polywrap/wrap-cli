import { logActivity } from "../logging";
import { intlMsg } from "../intl";
import {
  AnyProjectManifest,
  AnyProjectManifestLanguage,
  appManifestLanguages,
  appManifestLanguageToBindLanguage,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
  pluginManifestLanguages,
  pluginManifestLanguageToBindLanguage,
  polywrapManifestLanguages,
  polywrapManifestLanguageToBindLanguage,
  Project,
} from "../project";
import { resetDir } from "../system";
import { SchemaComposer } from "../SchemaComposer";
import { CodegenOverrides, tryGetCodegenOverrides } from "./CodegenOverrides";

import path from "path";
import { BindLanguage } from "@polywrap/schema-bind";
import { writeDirectorySync } from "@polywrap/os-js";

export interface CodeGeneratorConfig {
  project: Project<AnyProjectManifest>;
  schemaComposer: SchemaComposer;
  codegenDirAbs?: string;
}

export class CodeGenerator {
  constructor(protected _config: CodeGeneratorConfig) {}

  public async generate(): Promise<boolean> {
    try {
      const language = await this._config.project.getManifestLanguage();
      const bindLanguage = await this.getBindingLanguage(language);

      if (!bindLanguage) {
        throw Error(
          intlMsg.lib_language_unsupportedManifestLanguage({
            language: language,
            supported: [
              ...Object.keys(polywrapManifestLanguages),
              ...Object.keys(pluginManifestLanguages),
              ...Object.keys(appManifestLanguages),
            ].join(", "),
          })
        );
      }

      // Get overrides if they exist
      const overrides = await tryGetCodegenOverrides(language);

      await logActivity(
        this._config.project.logger,
        intlMsg.lib_codeGenerator_genCodeText(),
        intlMsg.lib_codeGenerator_genCodeError(),
        intlMsg.lib_codeGenerator_genCodeWarning(),
        async () => {
          return this.runCodegen(bindLanguage, overrides);
        }
      );

      return true;
    } catch (e) {
      this._config.project.logger.error(e);
      return false;
    }
  }

  protected async runCodegen(
    _: BindLanguage,
    overrides?: CodegenOverrides
  ): Promise<string[]> {
    // TODO: move codegen dir overrides into the new "language-overrides"
    const codegenDir = this._config.codegenDirAbs
      ? path.relative(
          this._config.project.getManifestDir(),
          this._config.codegenDirAbs
        )
      : undefined;

    const bindConfig = overrides
      ? await overrides.getSchemaBindConfig(this._config.project)
      : {};

    const abi = await this._config.schemaComposer.getComposedAbis();
    const binding = await this._config.project.generateSchemaBindings(
      abi,
      codegenDir,
      bindConfig
    );

    resetDir(binding.outputDirAbs);
    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }

  protected async getBindingLanguage(
    language: AnyProjectManifestLanguage
  ): Promise<BindLanguage | undefined> {
    let bindLanguage: BindLanguage | undefined;

    if (isPolywrapManifestLanguage(language)) {
      bindLanguage = polywrapManifestLanguageToBindLanguage(language);
    } else if (isPluginManifestLanguage(language)) {
      bindLanguage = pluginManifestLanguageToBindLanguage(language);
    } else if (isAppManifestLanguage(language)) {
      bindLanguage = appManifestLanguageToBindLanguage(language);
    }

    return bindLanguage;
  }
}
