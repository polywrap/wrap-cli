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
  withSpinner,
} from "./";
import { SourceBuildStrategy } from "./source-builders/SourceBuilder";

import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import { WasmWrapper, WrapImports } from "@polywrap/client-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { normalizePath, writeDirectorySync } from "@polywrap/os-js";
import * as gluegun from "gluegun";
import fs from "fs";
import path from "path";
import { Abi } from "@polywrap/schema-parse";

export interface CompilerOverrides {
  validateManifest: (manifest: PolywrapManifest) => void;
  generationSubPath: string;
}

export interface CompilerConfig {
  outputDir: string;
  project: PolywrapProject;
  sourceBuildStrategy: SourceBuildStrategy;
  abi: Abi;
  compilerOverrides?: CompilerOverrides;
}

export class Compiler {
  constructor(private _config: CompilerConfig) {}

  public async codegen(): Promise<boolean> {
    const { project } = this._config;

    const run = async (): Promise<void> => {
      if (!(await this._isInterface())) {
        // Generate the bindings
        await this._generateCode();
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
      // Init & clean output directory
      resetDir(this._config.outputDir);

      // Output: wrap.info
      await this._outputWrapManifest();

      if (!(await this._isInterface())) {
        // Generate the bindings
        await this._generateCode();

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

  private async _isInterface(): Promise<boolean> {
    const { project } = this._config;
    const manifest = await project.getManifest();
    return manifest.project.type === "interface";
  }

  private async _generateCode(): Promise<string[]> {
    const { project, abi, compilerOverrides } = this._config;

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

  private async _outputWrapManifest(quiet = false): Promise<unknown> {
    const { outputDir, project, abi } = this._config;
    let manifestPath = `${outputDir}/wrap.info`;
    const run = async () => {
      const manifest = await project.getManifest();

      const type = (await this._isInterface()) ? "interface" : "wasm";
      await generateWrapFile(abi, manifest.project.name, type, manifestPath);
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
