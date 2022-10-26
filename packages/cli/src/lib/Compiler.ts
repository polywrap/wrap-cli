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
  logActivity,
} from "./";
import { BuildStrategy } from "./build-strategies/BuildStrategy";

import { WasmWrapper, WrapImports } from "@polywrap/wasm-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { normalizePath } from "@polywrap/os-js";
import fs from "fs";
import path from "path";

export interface CompilerConfig {
  outputDir: string;
  project: PolywrapProject;
  buildStrategy: BuildStrategy;
  schemaComposer: SchemaComposer;
}

export class Compiler {
  constructor(private _config: CompilerConfig) {}

  public async compile(): Promise<boolean> {
    const { project } = this._config;

    const run = async (): Promise<void> => {
      // Init & clean output directory
      resetDir(this._config.outputDir);

      // Output: wrap.info
      await this._outputWrapManifest();

      if (!(await this._isInterface())) {
        // Compile the Wrapper
        await this._buildModules();
      }

      // Output Polywrap Metadata
      await this._outputPolywrapMetadata();
    };

    try {
      await logActivity(
        project.logger,
        intlMsg.lib_compiler_compileText(),
        intlMsg.lib_compiler_compileError(),
        intlMsg.lib_compiler_compileWarning(),
        async () => {
          return run();
        }
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  private async _isInterface(): Promise<boolean> {
    const { project } = this._config;
    const manifest = await project.getManifest();
    return manifest.project.type === "interface";
  }

  private async _buildModules(): Promise<void> {
    const { outputDir } = this._config;

    if (await this._isInterface()) {
      throw Error(intlMsg.lib_compiler_cannotBuildInterfaceModules());
    }

    // Build the sources
    await this._config.buildStrategy.build();

    // Validate the Wasm module
    await this._validateWasmModule(outputDir);
  }

  private async _outputWrapManifest(): Promise<unknown> {
    const { outputDir, project, schemaComposer } = this._config;
    const manifestPath = `${outputDir}/wrap.info`;
    const run = async () => {
      const manifest = await project.getManifest();

      const type = (await this._isInterface()) ? "interface" : "wasm";
      const abi = await schemaComposer.getComposedAbis();
      await generateWrapFile(
        abi,
        manifest.project.name,
        type,
        manifestPath,
        project.logger
      );
    };

    const displayManifestPath = displayPath(manifestPath);
    return await logActivity(
      project.logger,
      intlMsg.lib_helpers_wrap_manifest_outputText({
        path: normalizePath(displayManifestPath),
      }),
      intlMsg.lib_helpers_wrap_manifest_outputError({
        path: normalizePath(displayManifestPath),
      }),
      intlMsg.lib_helpers_wrap_manifest_outputWarning({
        path: normalizePath(displayManifestPath),
      }),
      (): Promise<unknown> => {
        return Promise.resolve(run());
      }
    );
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
      project.logger
    );

    await outputManifest(
      builtMetaManifest,
      path.join(outputDir, "polywrap.meta.json"),
      project.logger
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
