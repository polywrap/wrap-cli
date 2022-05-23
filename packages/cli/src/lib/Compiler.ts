/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  Web3ApiProject,
  SchemaComposer,
  withSpinner,
  outputManifest,
  outputMetadata,
  generateDockerfile,
  generateDockerImageName,
  createBuildImage,
  copyArtifactsFromBuildImage,
  intlMsg,
  resetDir,
} from "./";

import {
  InvokableModules,
  Web3ApiManifest,
  BuildManifest,
  MetaManifest,
} from "@web3api/core-js";
import { WasmWeb3Api } from "@web3api/client-js";
import { W3Imports } from "@web3api/client-js/build/wasm/types";
import { AsyncWasmInstance } from "@web3api/asyncify-js";
import { ComposerOutput } from "@web3api/schema-compose";
import { writeFileSync, writeDirectorySync } from "@web3api/os-js";
import * as gluegun from "gluegun";
import fs from "fs";
import path from "path";

type ModulesToBuild = Record<InvokableModules, boolean>;

interface CompilerState {
  web3ApiManifest: Web3ApiManifest;
  composerOutput: ComposerOutput;
  modulesToBuild: ModulesToBuild;
}

export interface CompilerConfig {
  outputDir: string;
  project: Web3ApiProject;
  schemaComposer: SchemaComposer;
}

export class Compiler {
  constructor(private _config: CompilerConfig) {}

  public async codegen(): Promise<boolean> {
    const { project } = this._config;

    const run = async (): Promise<void> => {
      const state = await this._getCompilerState();

      if (!(await this._isInterface())) {
        // Generate the bindings
        await this._generateCode(state);
      }
    };

    if (project.quiet) {
      try {
        await run();
        return true;
      } catch (e) {
        gluegun.print.error(e);
        return false;
      }
    } else {
      try {
        await withSpinner(
          intlMsg.lib_compiler_codegenText(),
          intlMsg.lib_compiler_codegenError(),
          intlMsg.lib_compiler_codegenWarning(),
          async () => {
            return run();
          }
        );
        return true;
      } catch (e) {
        gluegun.print.error(e);
        return false;
      }
    }
  }

  public async compile(): Promise<boolean> {
    const { project } = this._config;

    const run = async (): Promise<void> => {
      const state = await this._getCompilerState();

      // Init & clean output directory
      resetDir(this._config.outputDir);

      await this._outputComposedSchema(state);

      let buildManifest: BuildManifest | undefined = undefined;

      if (!(await this._isInterface())) {
        // Generate the bindings
        await this._generateCode(state);

        // Compile the API
        buildManifest = await this._buildModules(state);
      }

      // Output all metadata if present
      const metaManifest = await this._outputMetadata();

      await this._outputManifests(
        state.web3ApiManifest,
        buildManifest,
        metaManifest
      );
    };

    if (project.quiet) {
      try {
        await run();
        return true;
      } catch (e) {
        gluegun.print.error(e);
        return false;
      }
    } else {
      try {
        await withSpinner(
          intlMsg.lib_compiler_compileText(),
          intlMsg.lib_compiler_compileError(),
          intlMsg.lib_compiler_compileWarning(),
          async () => {
            return run();
          }
        );
        return true;
      } catch (e) {
        gluegun.print.error(e);
        return false;
      }
    }
  }

  public reset(): void {
    this._config.project.reset();
    this._config.schemaComposer.reset();
  }

  private async _getCompilerState(): Promise<CompilerState> {
    const { project } = this._config;

    // Get the Web3ApiManifest
    const web3ApiManifest = await project.getManifest();

    // Determine what modules to build
    const modulesToBuild = this._getModulesToBuild(web3ApiManifest);

    // Compose the schema
    const composerOutput = await this._composeSchema();

    const state: CompilerState = {
      web3ApiManifest: Object.assign({}, web3ApiManifest),
      composerOutput,
      modulesToBuild,
    };

    this._validateState(state);

    return state;
  }

  private async _isInterface(): Promise<boolean> {
    const state = await this._getCompilerState();
    return state.web3ApiManifest.language === "interface";
  }

  private async _composeSchema(): Promise<ComposerOutput> {
    const { schemaComposer } = this._config;

    // Get the fully composed schema
    const composerOutput = await schemaComposer.getComposedSchemas();

    if (!composerOutput.combined) {
      throw Error(intlMsg.lib_compiler_failedSchemaReturn());
    }

    return composerOutput;
  }

  private async _generateCode(state: CompilerState): Promise<string[]> {
    const { composerOutput } = state;
    const { project } = this._config;

    // Generate the bindings
    const output = await project.generateSchemaBindings(composerOutput);

    // Output the bindings
    const filesWritten: string[] = [];

    for (const module of output.modules) {
      filesWritten.push(
        ...writeDirectorySync(module.outputDirAbs, module.output)
      );
    }

    if (output.common) {
      filesWritten.push(
        ...writeDirectorySync(output.common.outputDirAbs, output.common.output)
      );
    }

    return filesWritten;
  }

  private async _buildModules(state: CompilerState): Promise<BuildManifest> {
    const { outputDir } = this._config;
    const { web3ApiManifest, modulesToBuild } = state;

    if (await this._isInterface()) {
      throw Error(intlMsg.lib_compiler_cannotBuildInterfaceModules());
    }

    // Build the sources
    const dockerImageId = await this._buildSourcesInDocker();

    // Validate the Wasm modules
    await Promise.all(
      Object.keys(modulesToBuild)
        .filter((module: InvokableModules) => modulesToBuild[module])
        .map((module: InvokableModules) =>
          this._validateWasmModule(module, outputDir)
        )
    );

    // Update the Web3ApiManifest
    if (modulesToBuild.query && web3ApiManifest.modules.query) {
      web3ApiManifest.modules.query = {
        module: "./query.wasm",
        schema: "./schema.graphql",
      };
    }

    if (modulesToBuild.mutation && web3ApiManifest.modules.mutation) {
      web3ApiManifest.modules.mutation = {
        module: "./mutation.wasm",
        schema: "./schema.graphql",
      };
    }

    web3ApiManifest.build = "./web3api.build.json";

    // Create the BuildManifest
    const buildManifest: BuildManifest = {
      format: "0.0.1-prealpha.3",
      __type: "BuildManifest",
      docker: {
        buildImageId: dockerImageId,
      },
    };

    return buildManifest;
  }

  private _getModulesToBuild(manifest: Web3ApiManifest): ModulesToBuild {
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

  private async _buildSourcesInDocker(): Promise<string> {
    const { project, outputDir } = this._config;
    const buildManifestDir = await project.getBuildManifestDir();
    const buildManifest = await project.getBuildManifest();
    const imageName =
      buildManifest?.docker?.name ||
      generateDockerImageName(await project.getBuildUuid());
    let dockerfile = buildManifest?.docker?.dockerfile
      ? path.join(buildManifestDir, buildManifest?.docker?.dockerfile)
      : path.join(buildManifestDir, "Dockerfile");

    await project.cacheBuildManifestLinkedPackages();

    // If the dockerfile path isn't provided, generate it
    if (!buildManifest?.docker?.dockerfile) {
      // Make sure the default template is in the cached .w3/web3api/build/env folder
      await project.cacheDefaultBuildManifestFiles();

      dockerfile = generateDockerfile(
        project.getCachePath("build/env/Dockerfile.mustache"),
        buildManifest.config || {}
      );
    }

    const dockerBuildxConfig = buildManifest?.docker?.buildx;
    const useBuildx = dockerBuildxConfig ? true : false;

    let cacheDir: string | undefined;
    let buildxOutput: string | undefined;
    let removeBuilder = false;

    if (dockerBuildxConfig && typeof dockerBuildxConfig !== "boolean") {
      const cache = dockerBuildxConfig.cache;

      if (cache == true) {
        cacheDir = project.getCachePath("build/cache");
      } else if (cache) {
        if (!path.isAbsolute(cache)) {
          cacheDir = path.join(project.getManifestDir(), cache);
        } else {
          cacheDir = cache;
        }
      }

      const output = dockerBuildxConfig.output;

      if (output === true) {
        buildxOutput = "docker";
      } else if (typeof output === "string") {
        buildxOutput = output;
      }

      removeBuilder = dockerBuildxConfig.removeBuilder ? true : false;
    }

    const removeImage = buildManifest?.docker?.removeImage ? true : false;

    // If the dockerfile path contains ".mustache", generate
    if (dockerfile.indexOf(".mustache") > -1) {
      dockerfile = generateDockerfile(dockerfile, buildManifest.config || {});
    }

    // Construct the build image
    const dockerImageId = await createBuildImage(
      project.getManifestDir(),
      imageName,
      dockerfile,
      cacheDir,
      buildxOutput,
      useBuildx,
      project.quiet
    );

    // Determine what build artifacts to expext
    const web3apiManifest = await project.getManifest();
    const web3apiArtifacts = [];

    if (web3apiManifest.modules.mutation) {
      web3apiArtifacts.push("mutation.wasm");
    }
    if (web3apiManifest.modules.query) {
      web3apiArtifacts.push("query.wasm");
    }

    await copyArtifactsFromBuildImage(
      outputDir,
      web3apiArtifacts,
      imageName,
      removeBuilder,
      removeImage,
      useBuildx,
      project.quiet
    );

    return dockerImageId;
  }

  private async _outputComposedSchema(state: CompilerState): Promise<void> {
    const { outputDir } = this._config;

    writeFileSync(
      `${outputDir}/schema.graphql`,
      state.composerOutput.combined.schema,
      "utf-8"
    );

    // Update the Web3ApiManifest schema paths
    if (state.modulesToBuild.query && state.web3ApiManifest.modules.query) {
      state.web3ApiManifest.modules.query = {
        schema: "./schema.graphql",
        module: state.web3ApiManifest.modules.query.module,
      };
    }

    if (
      state.modulesToBuild.mutation &&
      state.web3ApiManifest.modules.mutation
    ) {
      state.web3ApiManifest.modules.mutation = {
        schema: "./schema.graphql",
        module: state.web3ApiManifest.modules.mutation.module,
      };
    }
  }

  private async _outputManifests(
    web3ApiManifest: Web3ApiManifest,
    buildManifest?: BuildManifest,
    metaManifest?: MetaManifest
  ): Promise<void> {
    const { outputDir, project } = this._config;

    await outputManifest(
      web3ApiManifest,
      path.join(outputDir, "web3api.json"),
      project.quiet
    );

    if (buildManifest) {
      await outputManifest(
        buildManifest,
        path.join(outputDir, "web3api.build.json"),
        project.quiet
      );
    }

    if (metaManifest) {
      await outputManifest(
        metaManifest,
        path.join(outputDir, "web3api.meta.json"),
        project.quiet
      );
    }
  }

  private async _outputMetadata(): Promise<MetaManifest | undefined> {
    const { outputDir, project } = this._config;
    const metaManifest = await project.getMetaManifest();

    if (!metaManifest) {
      return undefined;
    }

    return await outputMetadata(
      metaManifest,
      outputDir,
      project.getManifestDir(),
      project.quiet
    );
  }

  private _validateState(state: CompilerState) {
    const { composerOutput, modulesToBuild, web3ApiManifest } = state;

    const throwMissingSchema = (moduleName: string) => {
      const missingSchemaMessage = intlMsg.lib_compiler_missingSchema({
        name: `"${moduleName}"`,
      });
      throw Error(missingSchemaMessage);
    };

    if (
      modulesToBuild.query &&
      (!composerOutput.query || !composerOutput.query.schema)
    ) {
      throwMissingSchema("query");
    }

    if (
      modulesToBuild.mutation &&
      (!composerOutput.mutation || !composerOutput.mutation.schema)
    ) {
      throwMissingSchema("mutation");
    }

    const throwMissingModule = (moduleName: string) => {
      const missingModuleMessage = intlMsg.lib_compiler_missingModule({
        name: `"${moduleName}"`,
      });
      throw Error(missingModuleMessage);
    };

    if (
      modulesToBuild.query &&
      web3ApiManifest.language !== "interface" &&
      !web3ApiManifest.modules.query?.module
    ) {
      throwMissingModule("query");
    }

    if (
      modulesToBuild.mutation &&
      web3ApiManifest.language !== "interface" &&
      !web3ApiManifest.modules.mutation?.module
    ) {
      throwMissingModule("mutation");
    }

    const throwNoInterfaceModule = (moduleName: string) => {
      const noInterfaceModule = intlMsg.lib_compiler_noInterfaceModule({
        name: `"${moduleName}"`,
      });
      throw Error(noInterfaceModule);
    };

    if (
      web3ApiManifest.language === "interface" &&
      web3ApiManifest.modules.query?.module
    ) {
      throwNoInterfaceModule("query");
    }

    if (
      web3ApiManifest.language === "interface" &&
      web3ApiManifest.modules.mutation?.module
    ) {
      throwNoInterfaceModule("mutation");
    }
  }

  private async _validateWasmModule(
    moduleName: InvokableModules,
    buildDir: string
  ): Promise<void> {
    const modulePath = path.join(buildDir, `${moduleName}.wasm`);
    const wasmSource = fs.readFileSync(modulePath);
    const w3Imports: Record<keyof W3Imports, () => void> = {
      __w3_subinvoke: () => {},
      __w3_subinvoke_result_len: () => {},
      __w3_subinvoke_result: () => {},
      __w3_subinvoke_error_len: () => {},
      __w3_subinvoke_error: () => {},
      __w3_subinvokeImplementation: () => {},
      __w3_subinvokeImplementation_result_len: () => {},
      __w3_subinvokeImplementation_result: () => {},
      __w3_subinvokeImplementation_error_len: () => {},
      __w3_subinvokeImplementation_error: () => {},
      __w3_invoke_args: () => {},
      __w3_invoke_result: () => {},
      __w3_invoke_error: () => {},
      __w3_getImplementations: () => {},
      __w3_getImplementations_result_len: () => {},
      __w3_getImplementations_result: () => {},
      __w3_abort: () => {},
      __w3_debug_log: () => {},
      __w3_load_env: () => {},
      __w3_sanitize_env_args: () => {},
      __w3_sanitize_env_result: () => {},
    };

    try {
      const memory = AsyncWasmInstance.createMemory({ module: wasmSource });
      await AsyncWasmInstance.createInstance({
        module: wasmSource,
        imports: {
          env: {
            memory,
          },
          w3: w3Imports,
        },
        requiredExports: WasmWeb3Api.requiredExports,
      });
    } catch (error) {
      throw Error(
        intlMsg.lib_compiler_invalid_module({
          modulePath,
          moduleName,
          error,
        })
      );
    }
  }
}
