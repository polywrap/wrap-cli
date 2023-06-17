/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  displayPath,
  generateWrapFile,
  intlMsg,
  PolywrapProject,
  PluginProject,
  resetDir,
  SchemaComposer,
  logActivity,
  loadDocsManifest,
} from "./";
import { BuildStrategy } from "./build-strategies/BuildStrategy";

import { WasmWrapper, WrapImports } from "@polywrap/wasm-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { normalizePath } from "@polywrap/os-js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { DocsManifest } from "@polywrap/polywrap-manifest-types-js";

export interface CompilerConfig {
  outputDir: string;
  project: PolywrapProject | PluginProject;
  buildStrategy?: BuildStrategy;
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

      if (await this._isWasm()) {
        // Build & Output: wasm.wrap
        await this._buildModules();

        // Copy: Resources folder
        await this._copyResourcesFolder();

        // Output docs if any

        await this._maybeAssembleDocsDir();
      }
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

  private async _isWasm(): Promise<boolean> {
    const { project } = this._config;
    const manifest = await project.getManifest();
    return manifest.project.type.startsWith("wasm/");
  }

  private async _buildModules(): Promise<void> {
    const { outputDir, project } = this._config;

    if (!this._config.buildStrategy) {
      throw Error(intlMsg.lib_compiler_missingBuildStrategy());
    }

    if (!(await this._isWasm())) {
      const manifest = await project.getManifest();
      throw Error(
        intlMsg.lib_compiler_cannotBuildModule({
          project: manifest.project.type,
        })
      );
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

      const type = manifest.project.type.split("/")[0];
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

  private async _copyResourcesFolder(): Promise<void> {
    const { outputDir, project } = this._config;

    const projectManifest = await (project as PolywrapProject).getManifest();

    if (!projectManifest || !projectManifest.resources) {
      return Promise.resolve();
    }

    const logger = project.logger;

    const folder = projectManifest.resources;
    const folderPath = path.resolve(projectManifest.resources);

    await logActivity(
      logger,
      intlMsg.lib_compiler_copyResourcesFolderText({ folder }),
      intlMsg.lib_compiler_copyResourcesFolderError({ folder }),
      intlMsg.lib_compiler_copyResourcesFolderWarning({ folder }),
      async () => {
        if (!fs.existsSync(folderPath)) {
          throw Error(`Resource can't be found.`);
        }

        await fse.copy(folderPath, outputDir, { recursive: true });
      }
    );
  }

  private async _maybeAssembleDocsDir(): Promise<void> {
    const { project, outputDir } = this._config;

    const projectManifest = await (project as PolywrapProject).getManifest();

    if (projectManifest.extensions?.docs) {
      const docsManifest = await loadDocsManifest(
        projectManifest.extensions.docs,
        project.logger
      );
      const docsDir = path.join(outputDir, "docs");

      if (fse.existsSync(docsDir)) {
        await fse.rmdir(docsDir);
      }

      await fse.mkdir(docsDir);

      let outputLogoPath: string | undefined;

      // Copy logo
      if (docsManifest.logo) {
        const logoFileParsed = path.parse(docsManifest.logo);
        const logoOutputPath = path.join(docsDir, `logo${logoFileParsed.ext}`);

        await fse.copyFile(docsManifest.logo, logoOutputPath);

        outputLogoPath = path.relative(docsDir, logoOutputPath);
      }

      // Copy markdown pages

      let outputReadmePath: string | undefined;

      if (docsManifest.readme) {
        const readmesDir = path.join(docsDir, "pages");

        await fse.mkdir(readmesDir);

        const pageFileParsed = path.parse(docsManifest.readme);
        const pageOutputPath = path.join(readmesDir, pageFileParsed.base);

        await fse.copyFile(docsManifest.readme, pageOutputPath);
        outputReadmePath = path.relative(docsDir, pageOutputPath);
      }

      const outputDocsManifest: DocsManifest = {
        ...docsManifest,
        logo: outputLogoPath,
        readme: outputReadmePath,
        __type: "DocsManifest",
      };

      const cleanedDocsManifest = JSON.parse(
        JSON.stringify(outputDocsManifest)
      );
      delete cleanedDocsManifest.__type;

      await fse.writeFile(
        path.join(docsDir, "polywrap.docs.json"),
        JSON.stringify(cleanedDocsManifest)
      );
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
