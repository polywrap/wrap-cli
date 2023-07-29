import { intlMsg } from "../intl";
import { AnyProjectManifest, Project } from "../project";
import { isTypescriptFile, importTypescriptModule, resetDir } from "../system";
import { SchemaComposer } from "../SchemaComposer";
import { CodeGenerator } from "./CodeGenerator";

import { writeDirectorySync } from "@polywrap/os-js";
import {
  BindLanguage,
  bindLanguageToWrapInfoType,
  GenerateBindingFn,
} from "@polywrap/schema-bind";
import { readFileSync } from "fs-extra";
import Mustache from "mustache";
import path from "path";
import { latestWrapManifestVersion } from "@polywrap/wrap-manifest-types-js";

export class ScriptCodegenerator extends CodeGenerator {
  private readonly _script: string;
  private readonly _mustacheView: Record<string, unknown> | undefined;
  private readonly _omitHeader: boolean;
  private readonly _schema: string | undefined = "";

  constructor(config: {
    project: Project<AnyProjectManifest>;
    schemaComposer: SchemaComposer;
    codegenDirAbs?: string;
    script: string;
    mustacheView: Record<string, unknown> | undefined;
    omitHeader: boolean;
    schema?: string;
  }) {
    super({
      project: config.project,
      schemaComposer: config.schemaComposer,
      codegenDirAbs: config.codegenDirAbs,
    });

    this._script = config.script;
    this._mustacheView = config.mustacheView;
    this._omitHeader = config.omitHeader;

    if (config.schema) {
      this._schema = config.schema;
    }
  }

  protected async runCodegen(bindLanguage: BindLanguage): Promise<string[]> {
    const generator = isTypescriptFile(this._script)
      ? await importTypescriptModule(this._script)
      : // eslint-disable-next-line @typescript-eslint/no-require-imports
        await require(this._script);

    if (!generator) {
      throw Error(intlMsg.lib_codeGenerator_wrongGenFile());
    }

    const { generateBinding } = generator as {
      generateBinding: GenerateBindingFn;
    };
    if (!generateBinding) {
      throw Error(intlMsg.lib_codeGenerator_nogenerateBindingMethod());
    }

    const outputDirAbs = await this._config.project.getGenerationDirectory(
      this._config.codegenDirAbs
    );

    const binding = await generateBinding({
      bindLanguage,
      wrapInfo: {
        version: latestWrapManifestVersion,
        name: await this._config.project.getName(),
        type: bindLanguageToWrapInfoType(bindLanguage),
        abi: await this._config.schemaComposer.getComposedAbis(),
      },
      config: this._mustacheView,
      outputDirAbs,
    });

    resetDir(outputDirAbs);
    return writeDirectorySync(
      outputDirAbs,
      binding.output,
      (templatePath: string) => this._generateTemplate(templatePath, {})
    );
  }

  private _generateTemplate(templatePath: string, config: unknown): string {
    const logger = this._config.project.logger;

    logger.info(
      intlMsg.lib_codeGenerator_genTemplateStep({
        path: `${templatePath}`,
      })
    );

    if (this._script) {
      // Update template path when the generation file is given
      templatePath = path.join(path.dirname(this._script), templatePath);
    }

    const template = readFileSync(templatePath);
    const types =
      typeof config === "object" && config !== null ? config : { config };
    let content = Mustache.render(template.toString(), {
      ...types,
      schema: this._schema,
      ...this._mustacheView,
    });

    if (this._omitHeader) {
      return content;
    }

    content = `// ${intlMsg.lib_codeGenerator_templateNoModify()}

${content}
`;

    return content;
  }
}
