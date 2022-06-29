/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  PolywrapManifest,
  MetaManifest,
  PolywrapProject,
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

import { msgpackEncode, WrapManifest } from "@polywrap/core-js";
import { WasmWrapper } from "@polywrap/client-js";
import { WrapImports } from "@polywrap/client-js/build/wasm/types";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { ComposerOutput } from "@polywrap/schema-compose";
import { writeFileSync, writeDirectorySync } from "@polywrap/os-js";
import * as gluegun from "gluegun";
import fs from "fs";
import path from "path";

interface CompilerState {
  polywrapManifest: PolywrapManifest;
  composerOutput: ComposerOutput;
  compilerOverrides?: CompilerOverrides;
}

export interface CompilerOverrides {
  validateManifest: (manifest: PolywrapManifest) => void;
  generationSubPath: string;
}

export interface CompilerConfig {
  outputDir: string;
  project: PolywrapProject;
  schemaComposer: SchemaComposer;
}

export class Compiler {
  private _state: CompilerState | undefined;

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

      await this._outputInfo(state);

      if (!(await this._isInterface())) {
        // Generate the bindings
        await this._generateCode(state);

        // Compile the Wrapper
        await this._buildModules();
      }

      // Output all metadata if present
      const metaManifest = await this._outputMetadata();

      await this._outputManifests(metaManifest);
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
    this._state = undefined;
  }

  private async _getCompilerState(): Promise<CompilerState> {
    if (this._state) {
      return this._state;
    }

    const { project } = this._config;

    // Get the PolywrapManifest
    const polywrapManifest = await project.getManifest();

    // Compose the schema
    const composerOutput = await this._composeSchema();

    // Allow the build-image to validate the manifest & override functionality
    const buildImageDir = `${__dirname}/defaults/build-images/${polywrapManifest.language}`;
    const buildImageEntryFile = path.join(buildImageDir, "index.ts");
    let compilerOverrides: CompilerOverrides | undefined;

    if (fs.existsSync(buildImageEntryFile)) {
      const module = await import(buildImageDir);

      // Get any compiler overrides for the given build-image
      if (module.getCompilerOverrides) {
        compilerOverrides = module.getCompilerOverrides() as CompilerOverrides;
      }

      if (compilerOverrides) {
        // Validate the manifest for the given build-image
        if (compilerOverrides.validateManifest) {
          compilerOverrides.validateManifest(polywrapManifest);
        }
      }
    }

    const state: CompilerState = {
      polywrapManifest: Object.assign({}, polywrapManifest),
      composerOutput,
      compilerOverrides,
    };

    this._validateState(state);

    this._state = state;
    return this._state;
  }

  private async _isInterface(): Promise<boolean> {
    const state = await this._getCompilerState();
    return state.polywrapManifest.language === "interface";
  }

  private async _composeSchema(): Promise<ComposerOutput> {
    const { schemaComposer } = this._config;

    // Get the fully composed schema
    const composerOutput = await schemaComposer.getComposedSchemas();

    if (!composerOutput) {
      throw Error(intlMsg.lib_compiler_failedSchemaReturn());
    }

    return composerOutput;
  }

  private async _generateCode(state: CompilerState): Promise<string[]> {
    const { composerOutput, compilerOverrides } = state;
    const { project } = this._config;

    // Generate the bindings
    const binding = await project.generateSchemaBindings(
      composerOutput,
      compilerOverrides?.generationSubPath
    );

    // Output the bindings
    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }

  private async _buildModules(): Promise<void> {
    const { outputDir } = this._config;

    if (await this._isInterface()) {
      throw Error(intlMsg.lib_compiler_cannotBuildInterfaceModules());
    }

    // Build the sources
    await this._buildSourcesInDocker();

    // Validate the Wasm module
    await this._validateWasmModule(outputDir);
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
      // Make sure the default template is in the cached .polywrap/wasm/build/image folder
      await project.cacheDefaultBuildImage();

      dockerfile = generateDockerfile(
        project.getCachePath(
          path.join(
            PolywrapProject.cacheLayout.buildImageDir,
            "Dockerfile.mustache"
          )
        ),
        buildManifest.config || {}
      );
    }

    const dockerBuildxConfig = buildManifest?.docker?.buildx;
    const useBuildx = !!dockerBuildxConfig;

    let cacheDir: string | undefined;
    let removeBuilder = false;

    if (dockerBuildxConfig && typeof dockerBuildxConfig !== "boolean") {
      const cache = dockerBuildxConfig.cache;

      if (cache == true) {
        cacheDir = project.getCachePath(
          PolywrapProject.cacheLayout.buildImageCacheDir
        );
      } else if (cache) {
        if (!path.isAbsolute(cache)) {
          cacheDir = path.join(project.getManifestDir(), cache);
        } else {
          cacheDir = cache;
        }
      }

      removeBuilder = !!dockerBuildxConfig.removeBuilder;
    }

    const removeImage = !!buildManifest?.docker?.removeImage;

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
      useBuildx,
      project.quiet
    );

    await copyArtifactsFromBuildImage(
      outputDir,
      "wrap.wasm",
      imageName,
      removeBuilder,
      removeImage,
      useBuildx,
      project.quiet
    );

    return dockerImageId;
  }

  private async _outputInfo(state: CompilerState): Promise<void> {
    const { outputDir } = this._config;

    const info: WrapManifest = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      abi: state.composerOutput.abi as unknown,
      name: state.polywrapManifest.name,
      type: state.polywrapManifest.module ? "wasm" : "interface",
      version: "0.0.1",
      __type: "WrapManifest",
    };

    writeFileSync(`${outputDir}/wrap.info`, msgpackEncode(info));
  }

  private async _outputManifests(metaManifest?: MetaManifest): Promise<void> {
    const { outputDir, project } = this._config;

    if (metaManifest) {
      await outputManifest(
        metaManifest,
        path.join(outputDir, "polywrap.meta.json"),
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
    const { composerOutput, polywrapManifest } = state;

    if (!composerOutput.schema) {
      const missingSchemaMessage = intlMsg.lib_compiler_missingSchema();
      throw Error(missingSchemaMessage);
    }

    if (polywrapManifest.language !== "interface" && !polywrapManifest.module) {
      const missingModuleMessage = intlMsg.lib_compiler_missingModule();
      throw Error(missingModuleMessage);
    }

    if (polywrapManifest.language === "interface" && polywrapManifest.module) {
      const noInterfaceModule = intlMsg.lib_compiler_noInterfaceModule();
      throw Error(noInterfaceModule);
    }
  }

  private async _validateWasmModule(buildDir: string): Promise<void> {
    const modulePath = path.join(buildDir, `wrap.wasm`);
    const wasmSource = fs.readFileSync(modulePath);
    const wrapImports: Record<keyof WrapImports, () => void> = {
      __wrap_subinvoke: () => {},
      __wrap_subinvoke_result_len: () => {},
      __wrap_subinvoke_result: () => {},
      __wrap_subinvoke_error_len: () => {},
      __wrap_subinvoke_error: () => {},
      __wrap_subinvokeImplementation: () => {},
      __wrap_subinvokeImplementation_result_len: () => {},
      __wrap_subinvokeImplementation_result: () => {},
      __wrap_subinvokeImplementation_error_len: () => {},
      __wrap_subinvokeImplementation_error: () => {},
      __wrap_invoke_args: () => {},
      __wrap_invoke_result: () => {},
      __wrap_invoke_error: () => {},
      __wrap_getImplementations: () => {},
      __wrap_getImplementations_result_len: () => {},
      __wrap_getImplementations_result: () => {},
      __wrap_abort: () => {},
      __wrap_debug_log: () => {},
      __wrap_load_env: () => {},
      __wrap_sanitize_env_args: () => {},
      __wrap_sanitize_env_result: () => {},
    };

    try {
      const memory = AsyncWasmInstance.createMemory({ module: wasmSource });
      await AsyncWasmInstance.createInstance({
        module: wasmSource,
        imports: {
          env: {
            memory,
          },
          wrap: wrapImports,
        },
        requiredExports: WasmWrapper.requiredExports,
      });
    } catch (error) {
      throw Error(
        intlMsg.lib_compiler_invalid_module({
          modulePath,
          error,
        })
      );
    }
  }
}
