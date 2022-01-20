import { SchemaComposer } from "./SchemaComposer";
import { Project } from "./project";
import {
  step,
  withSpinner,
  isTypescriptFile,
  loadTsNode,
  manifestLanguageToBindLanguage,
} from "./helpers";
import { intlMsg } from "./intl";

import { InvokableModules, TypeInfo } from "@web3api/schema-parse";
import {
  OutputDirectory,
  writeDirectory,
  bindSchema,
} from "@web3api/schema-bind";
import path from "path";
import fs, { readFileSync, existsSync, mkdirSync } from "fs";
import * as gluegun from "gluegun";
import { Ora } from "ora";
import Mustache from "mustache";
import { ComposerOutput } from "@web3api/schema-compose";
import { Manifest, PluginManifest, Web3ApiManifest } from "@web3api/core-js";
import rimraf from "rimraf";

type ModulesToBuild = Record<InvokableModules, boolean>;

export interface CustomScriptConfig {
  typeInfo: TypeInfo;
  generate: (templatePath: string, config: unknown) => string;
}

export { OutputDirectory };

export type CustomScriptRunFn = (
  output: OutputDirectory,
  config: CustomScriptConfig
) => void;

export interface CodeGeneratorState {
  manifest: PluginManifest | Web3ApiManifest;
  composerOutput: ComposerOutput;
  modulesToBuild: ModulesToBuild;
}

export interface CodeGeneratorConfig {
  outputDir: string;
  project: Project;
  schemaComposer: SchemaComposer;
  customScript?: string;
}

export class CodeGenerator {
  private _schema: string | undefined = "";

  constructor(private _config: CodeGeneratorConfig, private print?: any) {}

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

    this.print.debug("generating code");

    const run = async (spinner?: Ora) => {
      const bindLanguage = manifestLanguageToBindLanguage(
        await project.getManifestLanguage()
      );

      // Make sure that the output dir exists, if not create a new one
      if (!fs.existsSync(this._config.outputDir)) {
        fs.mkdirSync(this._config.outputDir);
      }

      // Get the fully composed schema
      const composed = await schemaComposer.getComposedSchemas(this.print);

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
        const { project } = this._config;

        // Get the Web3ApiManifest
        const manifest = await project.getManifest<PluginManifest>();
        const modulesToBuild = this._getModulesToBuild(manifest);
        const entrypoint = manifest.entrypoint;

        const queryModule = manifest.modules.query?.module as string;
        const queryDirectory = manifest.modules.query
          ? this._getGenerationDirectory(entrypoint, queryModule)
          : undefined;
        const mutationModule = manifest.modules.mutation?.module as string;
        const mutationDirectory = manifest.modules.mutation
          ? this._getGenerationDirectory(entrypoint, mutationModule)
          : undefined;

        this.print.debug("queryDirectory: " + queryDirectory);
        this.print.debug("mutationDirectory: " + mutationDirectory);

        this.print.debug("binding schema");

        // Clean the code generation
        if (queryDirectory) {
          this._resetDir(queryDirectory);
        }

        if (mutationDirectory) {
          this._resetDir(mutationDirectory);
        }

        const content = bindSchema({
          query: modulesToBuild.query
            ? {
                typeInfo: composed.query?.typeInfo as TypeInfo,
                schema: composed.combined?.schema as string,
                outputDirAbs: queryDirectory as string,
              }
            : undefined,
          mutation: modulesToBuild.mutation
            ? {
                typeInfo: composed.mutation?.typeInfo as TypeInfo,
                schema: composed.combined?.schema as string,
                outputDirAbs: mutationDirectory as string,
              }
            : undefined,
          bindLanguage,
        });

        this.print.debug("write dir");

        // Output the bindings
        const filesWritten: string[] = [];

        if (content.query && queryDirectory) {
          filesWritten.push(
            ...writeDirectory(queryDirectory, content.query as OutputDirectory)
          );
        }

        if (content.mutation && mutationDirectory) {
          filesWritten.push(
            ...writeDirectory(
              mutationDirectory,
              content.mutation as OutputDirectory
            )
          );
        }

        // return filesWritten;
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

  private _getModulesToBuild(manifest: Manifest): ModulesToBuild {
    const manifestMutation = manifest.modules.mutation;
    const manifestQuery = manifest.modules.query;
    const modulesToBuild: ModulesToBuild = {
      mutation: false,
      query: false,
    };

    if (manifestMutation) {
      modulesToBuild.mutation = true;
    }

    if (manifestQuery) {
      modulesToBuild.query = true;
    }

    return modulesToBuild;
  }

  private _getGenerationDirectory(
    entrypoint: string,
    modulePath: string
  ): string {
    const { project } = this._config;

    const absolute = path.isAbsolute(entrypoint)
      ? entrypoint
      : path.join(project.getRootDir(), entrypoint, modulePath);

    const genDir = `${path.dirname(absolute)}/w3`;

    if (!existsSync(genDir)) {
      mkdirSync(genDir);
    }
    return genDir;
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

  private _resetDir(dir: string) {
    if (fs.existsSync(dir)) {
      rimraf.sync(dir);
    }

    fs.mkdirSync(dir, { recursive: true });
  }
}
