import { withSpinner } from "../helpers";
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

import path from "path";
import * as gluegun from "gluegun";
import { BindLanguage } from "@polywrap/schema-bind";
import { writeDirectorySync } from "@polywrap/os-js";
import { Ora } from "ora";

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

      if (this._config.project.quiet) {
        await this.runCodegen(bindLanguage);
      } else {
        await withSpinner(
          intlMsg.lib_codeGenerator_genCodeText(),
          intlMsg.lib_codeGenerator_genCodeError(),
          intlMsg.lib_codeGenerator_genCodeWarning(),
          async (spinner) => {
            return this.runCodegen(bindLanguage, spinner);
          }
        );
      }

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected async runCodegen(_: BindLanguage, __?: Ora): Promise<string[]> {
    const codegenDir = this._config.codegenDirAbs
      ? path.relative(
          this._config.project.getManifestDir(),
          this._config.codegenDirAbs
        )
      : undefined;

    const abi = await this._config.schemaComposer.getComposedAbis();
    const binding = await this._config.project.generateSchemaBindings(
      abi,
      codegenDir
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
