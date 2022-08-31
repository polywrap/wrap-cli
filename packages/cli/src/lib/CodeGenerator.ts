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
import { Abi } from "@polywrap/wrap-manifest-types-js";

export interface CodeGeneratorConfig {
  project: Project<AnyProjectManifest>;
  abi: Abi;
}

interface GenerationWithScriptArgs {
  codegenDirAbs: string;
  script: string;
  mustacheView?: Record<string, unknown>;
  omitHeader?: boolean;
}

export class CodeGenerator {
  private _schema: string | undefined = "";

  constructor(private _config: CodeGeneratorConfig) {}

  static async getGenerationSubpath(
    project: Project<AnyProjectManifest>
  ): Promise<string | undefined> {
    const manifest = await project.getManifest();
    const manifestLanguage = await project.getManifestLanguage();

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

  public async generateFromScript({
    script: customScript,
    codegenDirAbs,
    mustacheView,
  }: GenerationWithScriptArgs): Promise<boolean> {
    const { project, abi } = this._config;

    return this._wrapInRun(
      async (bindLanguage: BindLanguage, spinner?: Ora) => {
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
          outputDirAbs: codegenDirAbs,
          bindLanguage,
          config: mustacheView,
        });

        resetDir(codegenDirAbs);
        writeDirectorySync(
          codegenDirAbs,
          binding.output,
          (templatePath: string) =>
            this._generateTemplate(
              templatePath,
              abi,
              {
                script: customScript,
                codegenDirAbs,
                mustacheView,
              },
              spinner
            )
        );
      }
    );
  }

  public async generate(codegenDirAbs?: string): Promise<boolean> {
    const { project, abi } = this._config;

    try {
      return this._wrapInRun(async () => {
        const binding = await project.generateSchemaBindings(
          abi,
          codegenDirAbs
            ? path.relative(project.getManifestDir(), codegenDirAbs)
            : undefined
        );

        // Output the bindings
        resetDir(binding.outputDirAbs);
        writeDirectorySync(binding.outputDirAbs, binding.output);
      });
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  private async _wrapInRun(
    codegenFunc: (bindLanguage: BindLanguage, spinner?: Ora) => Promise<void>
  ) {
    try {
      const { project } = this._config;

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

        await codegenFunc(bindLanguage, spinner);
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

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  private _generateTemplate(
    templatePath: string,
    config: unknown,
    {
      script: customScript,
      mustacheView,
      omitHeader,
    }: GenerationWithScriptArgs,
    spinner?: Ora
  ): string {
    const { project } = this._config;

    if (!project.quiet && spinner) {
      const stepMessage = intlMsg.lib_codeGenerator_genTemplateStep({
        path: `${templatePath}`,
      });
      step(spinner, stepMessage);
    }

    if (customScript) {
      // Update template path when the generation file is given
      templatePath = path.join(path.dirname(customScript), templatePath);
    }

    const template = readFileSync(templatePath);
    const types =
      typeof config === "object" && config !== null ? config : { config };
    let content = Mustache.render(template.toString(), {
      ...types,
      schema: this._schema,
      ...mustacheView,
    });

    if (omitHeader) {
      return content;
    }

    content = `// ${intlMsg.lib_codeGenerator_templateNoModify()}

${content}
`;

    return content;
  }
}
