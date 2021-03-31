/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";
import { SchemaComposer } from "./SchemaComposer";
import { withSpinner, outputManifest } from "./helpers";
import { BuildVars, parseManifest } from "./helpers/build-manifest";
import { buildImage, copyFromImageToHost } from "./helpers/docker";
import { intlMsg } from "./intl";

import { readdirSync, readFileSync } from "fs";
import { bindSchema, writeDirectory } from "@web3api/schema-bind";
import path from "path";
import fs from "fs";
import * as gluegun from "gluegun";
import { Manifest } from "@web3api/core-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");

export interface CompilerConfig {
  outputDir: string;
  project: Project;
  schemaComposer: SchemaComposer;
}

export type ModuleName = "mutation" | "query";

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

    const files = readdirSync(process.cwd(), { withFileTypes: true }).filter(
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

  private async _validateExports(moduleName: ModuleName, outputDir: string) {
    const wasmSource = readFileSync(path.join(outputDir, `${moduleName}.wasm`));
    const mod = await WebAssembly.compile(wasmSource);
    console.log("MODULE", mod);
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

  private async _buildSourcesInDocker(
    {
      outputImageName,
      tempDir,
      outputDir,
      dockerfile,
      ignorePaths,
      args,
    }: BuildVars,
    quiet = true
  ) {
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
        source: outputDir, //build folder inside docker
        destination: path.join(process.cwd(), outputDir),
      },
      quiet
    );
  }

  private _determineModulesToBuild(manifest: Manifest): ModuleName[] {
    const manifestMutation = manifest.mutation;
    const manifestQuery = manifest.query;
    const modulesToBuild: ModuleName[] = [];

    if (manifestMutation) {
      modulesToBuild.push("mutation");
    }

    if (manifestQuery) {
      modulesToBuild.push("query");
    }

    return modulesToBuild;
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

      const generateModuleCode = async (moduleName: ModuleName) => {
        const module = manifest[moduleName];

        if (!module) {
          return;
        }

        if (!composed[moduleName]) {
          const missingSchemaMessage = intlMsg.lib_compiler_missingDefinition({
            name: `"${moduleName}"`,
          });
          throw Error(missingSchemaMessage);
        }

        // Generate code next to the module entry point file
        this._generateCode(module.module.file, composed[moduleName] as string);

        module.module.file = `./${moduleName}.wasm`;
        module.schema.file = "./schema.graphql";
      };

      const modulesToBuild = this._determineModulesToBuild(manifest);

      if (modulesToBuild.length === 0) {
        throw new Error("No modules to build declared");
      }

      await Promise.all(
        modulesToBuild.map((module) => generateModuleCode(module))
      );

      const buildVars = parseManifest(modulesToBuild);
      // Output the schema & manifest files
      const schemaPath = `${outputDir}/schema.graphql`;
      fs.writeFileSync(schemaPath, composed.combined, "utf-8");

      const manifestPath = `${outputDir}/web3api.yaml`;
      await outputManifest(manifest, manifestPath);

      // Build sources
      await this._buildSourcesInDocker(buildVars, project.quiet);

      // Validate exports
      await Promise.all(
        modulesToBuild.map((module) => this._validateExports(module, outputDir))
      );
    };

    if (project.quiet) {
      return run();
    } else {
      return await withSpinner(
        intlMsg.lib_compiler_compileText(),
        intlMsg.lib_compiler_compileError(),
        intlMsg.lib_compiler_compileWarning(),
        async (spinner) => {
          return run(spinner);
        }
      );
    }
  }

  private _generateCode(entryPoint: string, schema: string): string[] {
    const { project } = this._config;

    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : this._appendPath(project.manifestPath, entryPoint);
    const directory = `${path.dirname(absolute)}/w3`;

    // Clean the code generation
    this._cleanDir(directory);

    // Generate the bindings
    const output = bindSchema("wasm-as", schema);

    // Output the bindings
    return writeDirectory(directory, output);
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
