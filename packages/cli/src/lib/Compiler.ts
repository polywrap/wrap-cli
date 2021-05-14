/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";
import { SchemaComposer } from "./SchemaComposer";
import { BuildVars, parseManifest } from "./helpers/build-manifest";
import { buildImage, copyFromImageToHost } from "./helpers/docker";
import { withSpinner, outputManifest } from "./helpers";
import { intlMsg } from "./intl";

import {
  InvokableModules,
  Manifest
} from "@web3api/core-js";
import {
  bindSchema,
  writeDirectory,
  BindModuleOptions,
} from "@web3api/schema-bind";
import { TypeInfo } from "@web3api/schema-parse";

import path from "path";
import fs, { readFileSync } from "fs";
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

  public clearCache(): void {
    this._config.project.clearCache();
    this._config.schemaComposer.clearCache();
  }

  private async _compileWeb3Api() {
    const { outputDir, project, schemaComposer } = this._config;

    const run = async (): Promise<void> => {
      // Init & clean build directory
      this._cleanDir(this._config.outputDir);

      const manifest = await project.getManifest();
      // Get the fully composed schema
      const composed = await schemaComposer.getComposedSchemas();

      if (!composed.combined) {
        const failedSchemaMessage = intlMsg.lib_compiler_failedSchemaReturn();
        throw Error(`compileWeb3Api: ${failedSchemaMessage}`);
      }

      const generateAndBuildModules = async (modulesToBuild: InvokableModules[]) => {
        const buildQuery = modulesToBuild.indexOf("query") > -1;
        const buildMutation = modulesToBuild.indexOf("mutation") > -1;

        const throwMissingSchema = (moduleName: string) => {
          const missingSchemaMessage = intlMsg.lib_compiler_missingDefinition({
            name: `"${moduleName}"`,
          });
          throw Error(missingSchemaMessage);
        };

        if (buildQuery && !composed.query) {
          throwMissingSchema("query");
        }

        if (buildMutation && !composed.mutation) {
          throwMissingSchema("mutation");
        }

        const queryDirectory = manifest.query
          ? this._getGenerationDirectory(manifest.query.module.file)
          : undefined;
        const mutationDirectory = manifest.mutation
          ? this._getGenerationDirectory(manifest.mutation.module.file)
          : undefined;

        if (
          queryDirectory &&
          mutationDirectory &&
          queryDirectory === mutationDirectory
        ) {
          throw Error(
            `compileWeb3Api: Duplicate code generation folder found "${queryDirectory}".` +
              `Please ensure each module file is located in a unique directory.`
          );
        }

        if (buildQuery && !composed.query?.schema) {
          throw Error(`compileWeb3Api: Missing schema for the module "query"`);
        }

        if (buildMutation && !composed.mutation?.schema) {
          throw Error(
            `compileWeb3Api: Missing schema for the module "mutation"`
          );
        }

        this._generateCode(
          buildQuery
            ? {
                typeInfo: composed.query?.typeInfo as TypeInfo,
                outputDirAbs: queryDirectory as string,
              }
            : undefined,
          buildMutation
            ? {
                typeInfo: composed.mutation?.typeInfo as TypeInfo,
                outputDirAbs: mutationDirectory as string,
              }
            : undefined
        );

        if (buildQuery) {
          const queryManifest = manifest as Required<typeof manifest>;
          queryManifest.query.module.file = `./query.wasm`;
          queryManifest.query.schema.file = "./schema.graphql";
        }

        if (buildMutation) {
          const mutationManifest = manifest as Required<typeof manifest>;
          mutationManifest.mutation.module.file = `./mutation.wasm`;
          mutationManifest.mutation.schema.file = "./schema.graphql";
        }

        // Parse and build manifest, and format the BuildVars
        const buildVars = parseManifest(modulesToBuild);

        // Build the sources
        await this._buildSourcesInDocker(buildVars, outputDir, project.quiet);

        // Validate the WASM exports
        await Promise.all(
          modulesToBuild.map(
            (module) => this._validateExports(module, outputDir)
          )
        );
      };

      const modulesToBuild = this._determineModulesToBuild(manifest);

      if (modulesToBuild.length === 0) {
        throw new Error("No modules to build declared");
      }

      // Output the schema & manifest files
      fs.writeFileSync(
        `${outputDir}/schema.graphql`,
        composed.combined.schema,
        "utf-8"
      );
      await outputManifest(manifest, `${outputDir}/web3api.yaml`);

      // Generate the schema bindings and output the built WASM modules
      await generateAndBuildModules(modulesToBuild);
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

  private _getGenerationDirectory(entryPoint: string): string {
    const { project } = this._config;

    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : this._appendPath(project.manifestPath, entryPoint);
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

  private async _buildSourcesInDocker(
    buildVars: BuildVars,
    outputDir: string,
    quiet = true
  ) {
    const {
      outputImageName,
      tempDir,
      buildDir,
      dockerfile,
      ignorePaths,
      args,
    } = buildVars;

    this._copySources({
      dockerfilePath: dockerfile,
      ignorePaths,
      tempDirPath: tempDir,
    });

    await buildImage(
      {
        tempDir,
        outputImageName,
        args,
      },
      quiet
    );

    await copyFromImageToHost(
      {
        tempDir,
        imageName: outputImageName,
        source: buildDir,
        destination: outputDir,
      },
      quiet
    );
  }

  private _copySources({
    dockerfilePath,
    tempDirPath,
    ignorePaths,
  }: {
    ignorePaths: string[];
    dockerfilePath: string;
    tempDirPath: string;
  }) {
    fsExtra.removeSync(tempDirPath);
    fsExtra.copySync(dockerfilePath, path.join(tempDirPath, "Dockerfile"));

    const files = fs.readdirSync(process.cwd(), { withFileTypes: true }).filter(
      (file) => file.name !== ".w3"
    );
    const fullIgnorePaths = ignorePaths.map((ignorePath) =>
      path.join(process.cwd(), ignorePath)
    );

    files.forEach((file) => {
      fsExtra.copySync(
        path.join(process.cwd(), file.name),
        path.join(tempDirPath, file.name),
        {
          overwrite: false,
          filter: (pathString: string) => !fullIgnorePaths.includes(pathString),
        }
      );
    });
  }

  private async _validateExports(moduleName: InvokableModules, buildDir: string) {
    const wasmSource = readFileSync(path.join(buildDir, `${moduleName}.wasm`));
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
      throw Error(`_w3_init_ is not exported from built ${moduleName} module`);
    }

    if (!instance.exports._w3_invoke) {
      throw Error(
        `No _w3_invoke is not exported from built ${moduleName} module`
      );
    }
  }

  private _determineModulesToBuild(manifest: Manifest): InvokableModules[] {
    const manifestMutation = manifest.mutation;
    const manifestQuery = manifest.query;
    const modulesToBuild: InvokableModules[] = [];

    if (manifestMutation) {
      modulesToBuild.push("mutation");
    }

    if (manifestQuery) {
      modulesToBuild.push("query");
    }

    return modulesToBuild;
  }

  private _appendPath(root: string, subPath: string) {
    return path.join(path.dirname(root), subPath);
  }

  private _cleanDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fsExtra.emptyDirSync(dir);
  }
}
