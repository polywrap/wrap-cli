import { withSpinner } from "../helpers";
import { intlMsg } from "../intl";
import {
  AnyProjectManifest,
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
import { CodegenStrategy } from "./CodegenStrategy";

import { Ora } from "ora";
import * as gluegun from "gluegun";
import { BindLanguage } from "@polywrap/schema-bind";

export interface CodeGeneratorConfig {
  project: Project<AnyProjectManifest>;
}

export class CodeGenerator {
  constructor(
    protected _config: {
      strategy: CodegenStrategy;
    }
  ) {}

  public async generate(): Promise<boolean> {
    try {
      const run = async (spinner?: Ora) => {
        const language = await this._config.strategy.project.getManifestLanguage();
        let bindLanguage: BindLanguage | undefined;

        if (isPolywrapManifestLanguage(language)) {
          bindLanguage = polywrapManifestLanguageToBindLanguage(language);
        } else if (isPluginManifestLanguage(language)) {
          bindLanguage = pluginManifestLanguageToBindLanguage(language);
        } else if (isAppManifestLanguage(language)) {
          bindLanguage = appManifestLanguageToBindLanguage(language);
        }

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

        await this._config.strategy.generate(bindLanguage, spinner);
      };

      if (this._config.strategy.project.quiet) {
        await run();
      } else {
        await withSpinner(
          intlMsg.lib_codeGenerator_genCodeText(),
          intlMsg.lib_codeGenerator_genCodeError(),
          intlMsg.lib_codeGenerator_genCodeWarning(),
          async (spinner) => {
            return run(spinner);
          }
        );
      }

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }
}
