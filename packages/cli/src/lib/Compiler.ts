/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";
import { SchemaComposer } from "./SchemaComposer";
import { step, withSpinner, outputManifest } from "./helpers";
import { intlMsg } from "./intl";

import { TypeInfo } from "@web3api/schema-parse";
import {
  bindSchema,
  writeDirectory,
  BindModuleOptions,
} from "@web3api/schema-bind";
import { writeFileSync } from "@web3api/os-js";
import path from "path";
import fs, { readFileSync } from "fs";
import * as gluegun from "gluegun";
import { Ora } from "ora";
import * as asc from "assemblyscript/cli/asc";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");

export interface CompilerConfig {
  outputDir: string;
  project: Project;
  schemaComposer: SchemaComposer;
}

export class Compiler {
  constructor(private _config: CompilerConfig) {}

  public async compile(verbose?: boolean): Promise<boolean> {
    try {
      // Compile the API
      await this._compileWeb3Api(verbose);

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

  private async _compileWeb3Api(verbose?: boolean) {
    const { outputDir, project, schemaComposer } = this._config;

    const run = async (spinner?: Ora): Promise<void> => {
      // Init & clean build directory
      this._cleanDir(this._config.outputDir);

      const manifest = await project.getManifest();
      // Get the fully composed schema
      const composed = await schemaComposer.getComposedSchemas();

      if (!composed.combined) {
        const failedSchemaMessage = intlMsg.lib_compiler_failedSchemaReturn();
        throw Error(`compileWeb3Api: ${failedSchemaMessage}`);
      }

      const buildModules = async () => {
        const buildQuery = !!manifest.query;
        const buildMutation = !!manifest.mutation;

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
          await this._compileWasmModule(
            queryManifest.query.module.file,
            "query",
            outputDir,
            spinner,
            verbose
          );
          queryManifest.query.module.file = `./query.wasm`;
          queryManifest.query.schema.file = "./schema.graphql";
        }

        if (buildMutation) {
          const mutationManifest = manifest as Required<typeof manifest>;
          await this._compileWasmModule(
            mutationManifest.mutation.module.file,
            "mutation",
            outputDir,
            spinner,
            verbose
          );
          mutationManifest.mutation.module.file = `./mutation.wasm`;
          mutationManifest.mutation.schema.file = "./schema.graphql";
        }
      };

      await buildModules();

      // Output the schema & manifest files
      writeFileSync(
        `${outputDir}/schema.graphql`,
        composed.combined.schema as string,
        "utf-8"
      );
      await outputManifest(manifest, `${outputDir}/web3api.yaml`);
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

  private async _compileWasmModule(
    modulePath: string,
    moduleName: string,
    outputDir: string,
    spinner?: Ora,
    verbose?: boolean
  ) {
    const { project } = this._config;

    if (!project.quiet && spinner) {
      step(
        spinner,
        `${intlMsg.lib_compiler_step()}:`,
        `${modulePath} => ` + path.normalize(`${outputDir}/${moduleName}.wasm`)
      );
    }

    const moduleAbsolute = path.join(project.manifestDir, modulePath);
    const baseDir = path.dirname(moduleAbsolute);
    const libsDirs = [];

    for (
      let dir: string | undefined = path.resolve(baseDir);
      // Terminate after the root dir or when we have found node_modules
      dir !== undefined;
      // Continue with the parent directory, terminate after the root dir
      dir = path.dirname(dir) === dir ? undefined : path.dirname(dir)
    ) {
      if (fs.existsSync(path.join(dir, "node_modules"))) {
        libsDirs.push(path.join(dir, "node_modules"));
      }
    }

    if (libsDirs.length === 0) {
      const noNodeModules = intlMsg.lib_compiler_noNodeModules({
        folder: `\`node_modules\``,
      });
      throw Error(noNodeModules);
    }

    const args = [
      path.join(baseDir, "w3/entry.ts"),
      "--path",
      libsDirs.join(","),
      "--outFile",
      `${outputDir}/${moduleName}.wasm`,
      "--use",
      `abort=${path
        .relative(process.cwd(), path.join(baseDir, "w3/entry/w3Abort"))
        .replace(/\\/g, "/")}`,
      "--optimize",
      "--debug",
      "--importMemory",
      "--runtime",
      "stub",
    ];

    // compile the module into the output directory
    await asc.main(
      args,
      {
        stdout: !verbose ? undefined : process.stdout,
        stderr: process.stderr,
      },
      (e: Error | null) => {
        if (e != null) {
          throw e;
        }
        return 0;
      }
    );

    const wasmSource = readFileSync(`${outputDir}/${moduleName}.wasm`);
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
      throw Error(intlMsg.lib_compiler_noInit());
    }

    if (!instance.exports._w3_invoke) {
      throw Error(intlMsg.lib_compiler_noInvoke());
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
