import {
  step,
  withSpinner,
  isTypescriptFile,
  importTypescriptModule,
  web3apiManifestLanguages,
  isWeb3ApiManifestLanguage,
  web3apiManifestLanguageToBindLanguage,
  pluginManifestLanguages,
  isPluginManifestLanguage,
  pluginManifestLanguageToBindLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  appManifestLanguageToBindLanguage,
  Project,
  AnyManifest,
  SchemaComposer,
  intlMsg,
} from "./";

import { TypeInfo } from "@web3api/schema-parse";
import {
  bindSchema,
  BindLanguage,
  GenerateBindingFn,
} from "@web3api/schema-bind";
import { writeDirectorySync } from "@web3api/os-js";
import path from "path";
import fs, { readFileSync } from "fs";
import * as gluegun from "gluegun";
import { Ora } from "ora";
import Mustache from "mustache";
import rimraf from "rimraf";

export interface CodeGeneratorConfig {
  outputDir: string;
  project: Project<AnyManifest>;
  schemaComposer: SchemaComposer;
  customScript?: string;
  mustacheView?: Record<string, unknown>;
}

export class CodeGenerator {
  private _schema: string | undefined = "";

  constructor(private _config: CodeGeneratorConfig) {}

  public async generate(config?: Record<string, unknown>): Promise<boolean> {
    try {
      // Compile the API
      await this._generateCode(config);

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  private async _generateCode(config?: Record<string, unknown>) {
    const { schemaComposer, project } = this._config;

    const run = async (spinner?: Ora) => {
      const language = await project.getManifestLanguage();
      let bindLanguage: BindLanguage | undefined;

      if (isWeb3ApiManifestLanguage(language)) {
        bindLanguage = web3apiManifestLanguageToBindLanguage(language);
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
              ...Object.keys(web3apiManifestLanguages),
              ...Object.keys(pluginManifestLanguages),
              ...Object.keys(appManifestLanguages),
            ].join(", "),
          })
        );
      }

      // Make sure the output dir is reset
      this._resetDir(this._config.outputDir);

      // Get the fully composed schema
      const composed = await schemaComposer.getComposedSchemas();

      if (!composed.combined) {
        throw Error(intlMsg.lib_codeGenerator_noComposedSchema());
      }

      const typeInfo = composed.combined.typeInfo;
      this._schema = composed.combined.schema;

      if (!typeInfo) {
        throw Error(intlMsg.lib_codeGenerator_typeInfoMissing());
      }

      if (this._config.customScript) {
        const customScript = this._config.customScript;

        // Check the generation file if it has the proper run() method
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const generator = isTypescriptFile(customScript)
          ? await importTypescriptModule(customScript)
          : // eslint-disable-next-line @typescript-eslint/no-require-imports
            await require(customScript);

        if (!generator) {
          throw Error(intlMsg.lib_codeGenerator_wrongGenFile());
        }

        const { generateBinding } = generator as {
          generateBinding: GenerateBindingFn;
        };
        if (!generateBinding) {
          throw Error(intlMsg.lib_codeGenerator_nogenerateBindingMethod());
        }

        const output = await generateBinding({
          projectName: await project.getName(),
          modules: [
            {
              name: "custom",
              typeInfo,
              schema: this._schema || "",
              config: config || {},
              outputDirAbs: this._config.outputDir,
            },
          ],
          bindLanguage,
        });

        for (const module of output.modules) {
          writeDirectorySync(
            this._config.outputDir,
            module.output,
            (templatePath: string) =>
              this._generateTemplate(templatePath, typeInfo, spinner)
          );
        }
      } else {
        const output = bindSchema({
          projectName: await project.getName(),
          modules: [
            {
              name: "combined",
              typeInfo: composed.combined?.typeInfo as TypeInfo,
              schema: composed.combined?.schema as string,
              config,
              outputDirAbs: this._config.outputDir,
            },
          ],
          bindLanguage,
        });

        for (const module of output.modules) {
          writeDirectorySync(this._config.outputDir, module.output);
        }
      }
    };

    if (project.quiet) {
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
  }

  private _resetDir(dir: string) {
    if (fs.existsSync(dir)) {
      rimraf.sync(dir);
    }

    fs.mkdirSync(dir, { recursive: true });
  }

  private _generateTemplate(
    templatePath: string,
    config: unknown,
    spinner?: Ora
  ): string {
    const { project } = this._config;

    if (!project.quiet && spinner) {
      const stepMessage = intlMsg.lib_codeGenerator_genTemplateStep({
        path: `${templatePath}`,
      });
      step(spinner, stepMessage);
    }

    if (this._config.customScript) {
      // Update template path when the generation file is given
      templatePath = path.join(
        path.dirname(this._config.customScript),
        templatePath
      );
    }

    const template = readFileSync(templatePath);
    const types =
      typeof config === "object" && config !== null ? config : { config };
    let content = Mustache.render(template.toString(), {
      ...types,
      schema: this._schema,
      ...this._config.mustacheView,
    });

    content = `// ${intlMsg.lib_codeGenerator_templateNoModify()}

${content}
`;

    return content;
  }
}
