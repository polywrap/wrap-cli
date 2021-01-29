/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Web3ApiManifest } from "./Web3ApiManifest";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";
import { SchemaComposer } from "./SchemaComposer";

import fs, { readFileSync } from "fs";
import path from "path";
import * as asc from "assemblyscript/cli/asc";
import { Manifest } from "@web3api/client-js";
import { bindSchema, writeDirectory } from "@web3api/schema-bind";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const toolbox = require("gluegun/toolbox");

export interface BuildConfig {
  manifestPath: string;
  outputDir: string;
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export class Compiler {
  private _manifestDir: string;
  private _schemaComposer: SchemaComposer;

  constructor(private _config: BuildConfig) {
    this._manifestDir = path.dirname(_config.manifestPath);
    this._schemaComposer = new SchemaComposer(_config);
  }

  public async compile(quiet?: boolean, verbose?: boolean): Promise<boolean> {
    try {
      // Load the manifest
      const manifest = await this._schemaComposer.loadManifest();

      // Compile the API
      await this._compileWeb3API(manifest, quiet, verbose);

      return true;
    } catch (e) {
      toolbox.print.error(e);
      return false;
    }
  }

  private async _loadManifest(quiet = false): Promise<Manifest> {
    const run = () => {
      return Web3ApiManifest.load(this._config.manifestPath);
    };

    if (quiet) {
      return run();
    } else {
      const manifestPath = displayPath(this._config.manifestPath);

      return await withSpinner(
        `Load web3api from ${manifestPath}`,
        `Failed to load web3api from ${manifestPath}`,
        `Warnings loading web3api from ${manifestPath}`,
        async (_spinner) => {
          return run();
        }
      );
    }
  }

  private async _compileWeb3API(
    manifest: Manifest,
    quiet?: boolean,
    verbose?: boolean
  ) {
    const run = async (spinner?: any) => {
      const { outputDir } = this._config;

      // Init & clean build directory
      this._cleanDir(this._config.outputDir);

      // Load & compose the schemas
      const composed = await this._schemaComposer.composeSchemas(manifest);

      const buildModule = async (moduleName: "mutation" | "query") => {
        const module = manifest[moduleName];

        if (!module) {
          return;
        }

        if (!composed[moduleName]) {
          throw Error(
            `Missing schema definition for the module "${moduleName}"`
          );
        }

        // Generate code next to the module entry point file
        this._generateCode(module.module.file, composed[moduleName] as string);

        await this._compileWasmModule(
          module.module.file,
          moduleName,
          outputDir,
          spinner,
          quiet,
          verbose
        );
        module.module.file = `./${moduleName}.wasm`;
        module.schema.file = "./schema.graphql";
      };

      await buildModule("mutation");
      await buildModule("query");

      // Output the schema & manifest files
      fs.writeFileSync(
        `${outputDir}/schema.graphql`,
        composed.combined,
        "utf-8"
      );
      Web3ApiManifest.dump(manifest, `${outputDir}/web3api.yaml`);
    };

    if (quiet) {
      return run();
    } else {
      return await withSpinner(
        "Compile Web3API",
        "Failed to compile Web3API",
        "Warnings while compiling Web3API",
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
    spinner?: any,
    quiet?: boolean,
    verbose?: boolean
  ) {
    if (!quiet) {
      step(
        spinner,
        "Compiling WASM module:",
        `${modulePath} => ${outputDir}/${moduleName}.wasm`
      );
    }

    const moduleAbsolute = path.join(this._manifestDir, modulePath);
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
      throw Error(
        `could not locate \`node_modules\` in parent directories of web3api manifest`
      );
    }

    const args = [
      path.join(baseDir, "w3/entry.ts"),
      "--path",
      libsDirs.join(","),
      "--outFile",
      `${outputDir}/${moduleName}.wasm`,
      "--optimize",
      "--debug",
      "--importMemory",
      "--runtime",
      "none",
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
        abort: (msg: string, file: string, line: number, column: number) => {
          console.error(`Abort: ${msg}\n${file}\n[${line},${column}]`);
        },
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
      },
    });

    if (!instance.exports._w3_init) {
      throw Error(
        "WASM module is missing the _w3_init export. This should never happen..."
      );
    }

    if (!instance.exports._w3_invoke) {
      throw Error(
        "WASM module is missing the _w3_invoke export. This should never happen..."
      );
    }
  }

  private _generateCode(entryPoint: string, schema: string): string[] {
    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : this._appendPath(this._config.manifestPath, entryPoint);
    const directory = `${path.dirname(absolute)}/w3`;
    this._cleanDir(directory);
    const output = bindSchema("wasm-as", schema);
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
