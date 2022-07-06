import {
  step,
  withSpinner,
  isTypescriptFile,
  importTypescriptModule,
  polywrapManifestLanguages,
  isPolywrapManifestLanguage,
  polywrapManifestLanguageToBindLanguage,
  pluginManifestLanguages,
  isPluginManifestLanguage,
  pluginManifestLanguageToBindLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  appManifestLanguageToBindLanguage,
  Project,
  AnyProjectManifest,
  SchemaComposer,
  intlMsg,
  resetDir,
} from "./";

import { BindLanguage, GenerateBindingFn } from "@polywrap/schema-bind";
import { writeDirectorySync } from "@polywrap/os-js";
import path from "path";
import { readFileSync } from "fs";
import * as gluegun from "gluegun";
import { Ora } from "ora";
import Mustache from "mustache";

export interface CodeGeneratorConfig {
  codegenDirAbs: string;
  project: Project<AnyProjectManifest>;
  schemaComposer: SchemaComposer;
  customScript?: string;
  mustacheView?: Record<string, unknown>;
}

export class CodeGenerator {
  private _schema: string | undefined = "";

  constructor(private _config: CodeGeneratorConfig) {}

  public async generate(): Promise<boolean> {
    try {
      // Compile the Wrapper
      await this._generateCode();

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  private async _generateCode() {
    const { schemaComposer, project, codegenDirAbs } = this._config;

    const run = async (spinner?: Ora) => {
      const language = await project.getManifestLanguage();
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

      // Get the fully composed schema
      const composed = await schemaComposer.getComposedSchemas();

      if (!composed) {
        throw Error(intlMsg.lib_codeGenerator_noComposedSchema());
      }

      const abi = composed.abi;
      this._schema = composed.schema;

      if (!abi) {
        throw Error(intlMsg.lib_codeGenerator_abiMissing());
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

        const binding = await generateBinding({
          projectName: await project.getName(),
          abi,
          schema: this._schema || "",
          outputDirAbs: codegenDirAbs,
          bindLanguage,
        });

        resetDir(codegenDirAbs);
        writeDirectorySync(
          codegenDirAbs,
          binding.output,
          (templatePath: string) =>
            this._generateTemplate(templatePath, abi, spinner)
        );
      } else {
        const binding = await project.generateSchemaBindings(
          composed,
          path.relative(project.getManifestDir(), codegenDirAbs)
        );

        // Output the bindings
        resetDir(binding.outputDirAbs);
        writeDirectorySync(binding.outputDirAbs, binding.output);
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
