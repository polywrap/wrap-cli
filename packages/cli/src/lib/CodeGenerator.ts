import { SchemaComposer } from "./SchemaComposer";
import { Project } from "./Project";
import { step, withSpinner } from "./helpers";
import { intlMsg } from "./intl";

import { OutputDirectory, writeDirectory } from "@web3api/schema-bind";
import path from "path";
import fs, { readFileSync } from "fs";
import * as gluegun from "gluegun";
import { Ora } from "ora";
import Mustache from "mustache";

export interface CodeGeneratorConfig {
  outputDir: string;
  generationFile: string;
  project: Project;
  schemaComposer: SchemaComposer;
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

      // Check the generation file if it has the proper run() method
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
      const generator = await require(this._config.generationFile);
      if (!generator) {
        throw Error(intlMsg.lib_codeGenerator_wrongGenFile());
      }

      const { run } = generator;
      if (!run) {
        throw Error(intlMsg.lib_codeGenerator_noRunMethod());
      }

      const output: OutputDirectory = {
        entries: [],
      };

      await run(output, {
        typeInfo,
        generate: (templatePath: string, config: unknown) =>
          this._generateTemplate(templatePath, config, spinner),
      });

      writeDirectory(this._config.outputDir, output, (templatePath: string) =>
        this._generateTemplate(templatePath, typeInfo, spinner)
      );
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

    templatePath = path.join(
      path.dirname(this._config.generationFile),
      templatePath
    );

    const template = readFileSync(templatePath);
    const types =
      typeof config === "object" && config !== null ? config : { config };
    let content = Mustache.render(template.toString(), {
      ...types,
      schema: this._schema,
      unionTypeTrim: this.unionTypeTrim,
      typeFormatFilter: this.typeFormatFilter,
    });

    content = `// ${intlMsg.lib_codeGenerator_templateNoModify()}

${content}
`;

    return content;
  }

  private unionTypeTrim() {
    return (text: string, render: (text: string) => string): string => {
      const rendered: string = render(text);
      if (rendered.endsWith(" | ")) {
        return rendered.substring(0, rendered.length - 3);
      } else if (rendered.startsWith(" | ")) {
        return rendered.substring(3);
      }
      return rendered;
    };
  }

  private typeFormatFilter() {
    return (text: string, render: (text: string) => string): string => {
      const rendered: string = render(text);
      if (rendered.startsWith("[")) {
        return rendered.substring(1, rendered.length - 1) + "[]";
      }
      return rendered;
    };
  }
}
