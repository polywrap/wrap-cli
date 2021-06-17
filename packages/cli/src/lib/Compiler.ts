/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";
import { SchemaComposer } from "./SchemaComposer";
import {
  withSpinner,
  outputManifest,
  generateDockerfile,
  createBuildImage,
  copyArtifactsFromBuildImage,
} from "./helpers";
import { intlMsg } from "./intl";

import {
  InvokableModules,
  Web3ApiManifest,
  BuildManifest,
} from "@web3api/core-js";
import {
  bindSchema,
  writeDirectory,
  BindModuleOptions,
} from "@web3api/schema-bind";
import { TypeInfo } from "@web3api/schema-parse";
import { ComposerOutput } from "@web3api/schema-compose";
import { writeFileSync } from "@web3api/os-js";
import fs from "fs";
import path from "path";
import * as gluegun from "gluegun";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");

export interface CompilerConfig {
  outputDir: string;
  project: Project;
  schemaComposer: SchemaComposer;
}

export class Compiler {
  constructor(private _config: CompilerConfig) {}

  public async compile(): Promise<boolean> {
    try {
      // Compile the API
      await this._compileWeb3Api();

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  public reset(): void {
    this._config.project.reset();
    this._config.schemaComposer.reset();
  }

  private async _compileWeb3Api() {
    const { project, schemaComposer } = this._config;

    const run = async (): Promise<void> => {
      // Init & clean build directory
      this._cleanDir(this._config.outputDir);

      const web3apiManifest = await project.getWeb3ApiManifest();

      // Get the fully composed schema
      const composerOutput = await schemaComposer.getComposedSchemas();

      if (!composerOutput.combined) {
        throw Error(intlMsg.lib_compiler_failedSchemaReturn());
      }

      const modulesToBuild = this._determineModulesToBuild(web3apiManifest);

      if (modulesToBuild.length === 0) {
        throw new Error(intlMsg.lib_compiler_noModulesToBuild());
      }

      // Generate the schema bindings and output the built WASM modules
      await this._generateAndBuildModules(
        web3apiManifest,
        composerOutput,
        modulesToBuild
      );
    };

    if (project.quiet) {
      return run();
    } else {
      return await withSpinner(
        intlMsg.lib_compiler_compileText(),
        intlMsg.lib_compiler_compileError(),
        intlMsg.lib_compiler_compileWarning(),
        async () => {
          return run();
        }
      );
    }
  }

  private async _generateAndBuildModules(
    web3apiManifest: Web3ApiManifest,
    composerOutput: ComposerOutput,
    modulesToBuild: InvokableModules[]
  ) {
    const { outputDir, project } = this._config;
    const buildQuery = modulesToBuild.indexOf("query") > -1;
    const buildMutation = modulesToBuild.indexOf("mutation") > -1;

    const throwMissingSchema = (moduleName: string) => {
      const missingSchemaMessage = intlMsg.lib_compiler_missingDefinition({
        name: `"${moduleName}"`,
      });
      throw Error(missingSchemaMessage);
    };

    if (buildQuery && (!composerOutput.query || !composerOutput.query.schema)) {
      throwMissingSchema("query");
    }

    if (
      buildMutation &&
      (!composerOutput.mutation || !composerOutput.mutation.schema)
    ) {
      throwMissingSchema("mutation");
    }

    const queryDirectory = web3apiManifest.modules.query
      ? this._getGenerationDirectory(web3apiManifest.modules.query.module)
      : undefined;
    const mutationDirectory = web3apiManifest.modules.mutation
      ? this._getGenerationDirectory(web3apiManifest.modules.mutation.module)
      : undefined;

    if (
      queryDirectory &&
      mutationDirectory &&
      queryDirectory === mutationDirectory
    ) {
      throw Error(
        intlMsg.lib_compiler_dup_code_folder({ directory: queryDirectory })
      );
    }

    this._generateCode(
      buildQuery
        ? {
            typeInfo: composerOutput.query?.typeInfo as TypeInfo,
            outputDirAbs: queryDirectory as string,
          }
        : undefined,
      buildMutation
        ? {
            typeInfo: composerOutput.mutation?.typeInfo as TypeInfo,
            outputDirAbs: mutationDirectory as string,
          }
        : undefined
    );

    // Build the sources
    const dockerImageId = await this._buildSourcesInDocker();

    // Validate the WASM exports
    await Promise.all(
      modulesToBuild.map((module) => this._validateExports(module, outputDir))
    );

    // Output the schema & manifest files
    writeFileSync(
      `${outputDir}/schema.graphql`,
      composerOutput.combined.schema,
      "utf-8"
    );

    const outputWeb3ApiManifest = Object.assign({}, web3apiManifest);

    if (buildQuery) {
      const queryManifest = outputWeb3ApiManifest as Required<
        typeof outputWeb3ApiManifest
      >;
      queryManifest.modules.query = {
        module: "./query.wasm",
        schema: "./schema.graphql",
      };
    }

    if (buildMutation) {
      const mutationManifest = outputWeb3ApiManifest as Required<
        typeof outputWeb3ApiManifest
      >;
      mutationManifest.modules.mutation = {
        module: "./mutation.wasm",
        schema: "./schema.graphql",
      };
    }

    outputWeb3ApiManifest.build = "./web3api.build.json";

    await outputManifest(
      outputWeb3ApiManifest,
      `${outputDir}/web3api.json`,
      project.quiet
    );

    const outputBuildManifest: BuildManifest = {
      format: "0.0.1-prealpha.2",
      docker: {
        buildImageId: dockerImageId,
      },
    };

    await outputManifest(
      outputBuildManifest,
      `${outputDir}/web3api.build.json`,
      project.quiet
    );
  }

  private _getGenerationDirectory(entryPoint: string): string {
    const { project } = this._config;

    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : path.join(project.getWeb3ApiManifestDir(), entryPoint);
    return `${path.dirname(absolute)}/w3`;
  }

  private _generateCode(
    query?: BindModuleOptions,
    mutation?: BindModuleOptions
  ): string[] {
    // Clean the code generation
    if (query) {
      this._cleanDir(query.outputDirAbs);
    }

    if (mutation) {
      this._cleanDir(mutation.outputDirAbs);
    }

    // Generate the bindings
    const output = bindSchema({
      language: "wasm-as",
      query,
      mutation,
    });

    // Output the bindings
    const filesWritten: string[] = [];

    if (query && output.query) {
      filesWritten.push(...writeDirectory(query.outputDirAbs, output.query));
    }

    if (mutation && output.mutation) {
      filesWritten.push(
        ...writeDirectory(mutation.outputDirAbs, output.mutation)
      );
    }

    return filesWritten;
  }

  private async _buildSourcesInDocker(): Promise<string> {
    const { project, outputDir } = this._config;
    const buildManifestDir = await project.getBuildManifestDir();
    const buildManifest = await project.getBuildManifest();
    const imageName = buildManifest?.docker?.name || "web3api-build";
    let dockerfile = buildManifest?.docker?.dockerfile
      ? path.join(buildManifestDir, buildManifest?.docker?.dockerfile)
      : path.join(buildManifestDir, "Dockerfile");

    // If the dockerfile path isn't provided, generate it
    if (!buildManifest?.docker?.dockerfile) {
      // Make sure the default template is in the cached .w3/build/env folder
      await project.cacheDefaultBuildManifestFiles();
      dockerfile = generateDockerfile(
        project.getCachePath("build/env/Dockerfile.mustache"),
        buildManifest.config || {}
      );
    }

    // If the dockerfile path contains ".mustache", generate
    if (dockerfile.indexOf(".mustache") > -1) {
      dockerfile = generateDockerfile(dockerfile, buildManifest.config || {});
    }

    const dockerImageId = await createBuildImage(
      project.getWeb3ApiManifestDir(),
      imageName,
      dockerfile,
      project.quiet
    );

    await copyArtifactsFromBuildImage(
      outputDir,
      await project.getWeb3ApiArtifacts(),
      imageName,
      project.quiet
    );

    return dockerImageId;
  }

  private async _validateExports(
    moduleName: InvokableModules,
    buildDir: string
  ) {
    const wasmSource = fs.readFileSync(
      path.join(buildDir, `${moduleName}.wasm`)
    );
    const mod = await WebAssembly.compile(wasmSource);
    const memory = new WebAssembly.Memory({ initial: 1 });
    const instance = await WebAssembly.instantiate(mod, {
      env: {
        memory,
      },
      w3: {
        __w3_subinvoke: () => {},
        __w3_subinvoke_result_len: () => {},
        __w3_subinvoke_result: () => {},
        __w3_subinvoke_error_len: () => {},
        __w3_subinvoke_error: () => {},
        __w3_invoke_args: () => {},
        __w3_invoke_result: () => {},
        __w3_invoke_error: () => {},
        __w3_abort: () => {},
      },
    });

    if (!instance.exports._w3_init) {
      throw Error(intlMsg.lib_compiler_missing_export__w3_init({ moduleName }));
    }

    if (!instance.exports._w3_invoke) {
      throw Error(
        intlMsg.lib_compiler_missing_export__w3_invoke({ moduleName })
      );
    }
  }

  private _determineModulesToBuild(
    manifest: Web3ApiManifest
  ): InvokableModules[] {
    const manifestMutation = manifest.modules.mutation;
    const manifestQuery = manifest.modules.query;
    const modulesToBuild: InvokableModules[] = [];

    if (manifestMutation) {
      modulesToBuild.push("mutation");
    }

    if (manifestQuery) {
      modulesToBuild.push("query");
    }

    return modulesToBuild;
  }

  private _cleanDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fsExtra.emptyDirSync(dir);
  }
}
