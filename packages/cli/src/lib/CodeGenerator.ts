import { SchemaComposer } from "./SchemaComposer";
import { Project } from "./project";
import { step, withSpinner, isTypescriptFile, loadTsNode } from "./helpers";
import { intlMsg } from "./intl";

import { TypeInfo } from "@web3api/schema-parse";
import {
  OutputDirectory,
  writeDirectory,
  bindSchema,
} from "@web3api/schema-bind";
import path from "path";
import fs, { readFileSync } from "fs";
import * as gluegun from "gluegun";
import { Ora } from "ora";
import Mustache from "mustache";

export interface CustomScriptConfig {
  typeInfo: TypeInfo;
  generate: (templatePath: string, config: unknown) => string;
}

export { OutputDirectory };

export type CustomScriptRunFn = (
  output: OutputDirectory,
  config: CustomScriptConfig
) => void;

export interface CodeGeneratorConfig {
  outputDir: string;
  project: Project;
  schemaComposer: SchemaComposer;
  customScript?: string;
}

export class CodeGenerator {
  private _schema: string | undefined = "";

  constructor(private _config: CodeGeneratorConfig) {}

  public async generate(): Promise<boolean> {
    try {
      // Compile the API
      await this._generateCode();

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  private async _generateCode() {
    const { schemaComposer, project } = this._config;

    const run = async (spinner?: Ora) => {
      // Make sure that the output dir exists, if not create a new one
      if (!fs.existsSync(this._config.outputDir)) {
        fs.mkdirSync(this._config.outputDir);
      }

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
        const output: OutputDirectory = {
          entries: [],
        };

        if (isTypescriptFile(this._config.customScript)) {
          loadTsNode();
        }

        // Check the generation file if it has the proper run() method
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
        const generator = await require(this._config.customScript);
        if (!generator) {
          throw Error(intlMsg.lib_codeGenerator_wrongGenFile());
        }

        const { run } = generator as { run: CustomScriptRunFn };
        if (!run) {
          throw Error(intlMsg.lib_codeGenerator_noRunMethod());
        }

        await run(output, {
          typeInfo,
          generate: (templatePath: string, config: unknown) =>
            this._generateTemplate(templatePath, config, spinner),
        });

        writeDirectory(this._config.outputDir, output, (templatePath: string) =>
          this._generateTemplate(templatePath, typeInfo, spinner)
        );
      } else {
        const content = bindSchema({
          combined: {
            typeInfo: composed.combined?.typeInfo as TypeInfo,
            schema: composed.combined?.schema as string,
            outputDirAbs: "",
          },
          language: await project.getLanguage(),
        });

        writeDirectory(
          this._config.outputDir,
          content.combined as OutputDirectory
        );
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
    });

    content = `// ${intlMsg.lib_codeGenerator_templateNoModify()}

${content}
`;

    return content;
  }
}
