/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  displayPath,
  generateWrapFile,
  intlMsg,
  outputManifest,
  outputMetadata,
  PolywrapProject,
  resetDir,
  SchemaComposer,
  withSpinner,
} from "./";
import {
  DockerBuildStrategy,
  SourceBuildStrategy,
} from "./source-builders/SourceBuilder";

import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import { WasmWrapper, WrapImports } from "@polywrap/client-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { normalizePath, writeDirectorySync } from "@polywrap/os-js";
import * as gluegun from "gluegun";
import fs from "fs";
import path from "path";
import { WrapAbi } from "@polywrap/schema-parse";

interface CompilerState {
  abi: WrapAbi;
  compilerOverrides?: CompilerOverrides;
}

export interface CompilerOverrides {
  validateManifest: (manifest: PolywrapManifest) => void;
  generationSubPath: string;
}

export interface CompilerConfig {
  outputDir: string;
  project: PolywrapProject;
  sourceBuildStrategy: SourceBuildStrategy;
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

      // Output: wrap.info
      await this._outputWrapManifest(state);

      if (!(await this._isInterface())) {
        // Generate the bindings
        await this._generateCode(state);

        // Compile the Wrapper
        await this._buildModules();
      }

      // Output Polywrap Metadata
      await this._outputPolywrapMetadata();
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

    // Compose the ABI
    const abi = await this._composeAbi();

    let compilerOverrides: CompilerOverrides | undefined;

    // Allow the build-image to validate the manifest & override functionality
    if (this._config.sourceBuildStrategy instanceof DockerBuildStrategy) {
      const buildImageDir = `${__dirname}/defaults/build-images/${polywrapManifest.project.type}`;
      const buildImageEntryFile = path.join(buildImageDir, "index.ts");

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
    }

    const state: CompilerState = {
      abi,
      compilerOverrides,
    };

    await this._validateState(state);

    this._state = state;
    return this._state;
  }

  private async _isInterface(): Promise<boolean> {
    const { project } = this._config;
    const manifest = await project.getManifest();
    return manifest.project.type === "interface";
  }

  private async _composeAbi(): Promise<WrapAbi> {
    const { schemaComposer } = this._config;

    // Get the fully composed schema
    const abi = await schemaComposer.getComposedAbis();

    if (!abi) {
      throw Error(intlMsg.lib_compiler_failedAbiReturn());
    }

    return abi;
  }

  private async _generateCode(state: CompilerState): Promise<string[]> {
    const { abi, compilerOverrides } = state;
    const { project } = this._config;

    // Generate the bindings
    const binding = await project.generateSchemaBindings(
      abi,
      compilerOverrides?.generationSubPath
    );

    // Output the bindings
    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }

  private async _buildModules(): Promise<void> {
    const { outputDir, project } = this._config;

    if (await this._isInterface()) {
      throw Error(intlMsg.lib_compiler_cannotBuildInterfaceModules());
    }

    // Build the sources
    await this._config.sourceBuildStrategy.build({ outputDir, project });

    // Validate the Wasm module
    await this._validateWasmModule(outputDir);
  }

  private async _outputWrapManifest(
    state: CompilerState,
    quiet = false
  ): Promise<unknown> {
    const { outputDir, project } = this._config;
    let manifestPath = `${outputDir}/wrap.info`;
    const run = async () => {
      if (!state.abi) {
        throw Error(intlMsg.lib_wrap_abi_not_found());
      }

      const manifest = await project.getManifest();

      const type = (await this._isInterface()) ? "interface" : "wasm";
      await generateWrapFile(
        state.abi,
        manifest.project.name,
        type,
        manifestPath
      );
    };

    if (quiet) {
      return await run();
    } else {
      manifestPath = displayPath(manifestPath);
      return await withSpinner(
        intlMsg.lib_helpers_wrap_manifest_outputText({
          path: normalizePath(manifestPath),
        }),
        intlMsg.lib_helpers_wrap_manifest_outputError({
          path: normalizePath(manifestPath),
        }),
        intlMsg.lib_helpers_wrap_manifest_outputWarning({
          path: normalizePath(manifestPath),
        }),
        (_spinner): Promise<unknown> => {
          return Promise.resolve(run());
        }
      );
    }
  }

  private async _outputPolywrapMetadata(): Promise<void> {
    const { outputDir, project } = this._config;

    const projectMetaManifest = await project.getMetaManifest();

    if (!projectMetaManifest) {
      return undefined;
    }

    const builtMetaManifest = await outputMetadata(
      projectMetaManifest,
      outputDir,
      project.getManifestDir(),
      project.quiet
    );

    await outputManifest(
      builtMetaManifest,
      path.join(outputDir, "polywrap.meta.json"),
      project.quiet
    );
  }

  private async _validateState(state: CompilerState): Promise<void> {
    const { abi } = state;
    const { project } = this._config;

    if (!abi) {
      throw Error(intlMsg.lib_compiler_missingAbi());
    }

    const manifest = await project.getManifest();

    if (manifest.project.type !== "interface" && !manifest.source.module) {
      const missingModuleMessage = intlMsg.lib_compiler_missingModule();
      throw Error(missingModuleMessage);
    }

    if (manifest.project.type === "interface" && manifest.source.module) {
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
