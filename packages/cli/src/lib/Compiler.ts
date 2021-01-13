/* eslint-disable @typescript-eslint/no-explicit-any */
import { Web3APIManifest } from "./Web3APIManifest";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";

import fs from "fs";
import path from "path";
import * as asc from "assemblyscript/cli/asc";
import { Manifest, Uri, resolveUri, Web3ApiClient } from "@web3api/client-js";
import { bindSchema } from "@web3api/schema-bind";
import { composeSchema } from "@web3api/schema-compose";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const toolbox = require("gluegun/toolbox");

export interface CompilerConfig {
  manifestPath: string;
  outputDir: string;
  testEnv?: boolean;
}

export class Compiler {
  private _manifestDir: string;

  constructor(private _config: CompilerConfig) {
    this._manifestDir = path.dirname(_config.manifestPath);
  }

  public async compile(): Promise<boolean> {
    try {
      // Load the manifest
      const manifest = await this._loadManifest();

      // Compile the API
      await this._compileWeb3API(manifest);

      return true;
    } catch (e) {
      toolbox.print.error(e);
      return false;
    }
  }

  private async _loadManifest(quiet = false): Promise<Manifest> {
    const run = () => {
      return Web3APIManifest.load(this._config.manifestPath);
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
      const { mutation, query } = manifest;
      const { outputDir, manifestPath } = this._config;

      // Init & clean build directory
      this._cleanDir(this._config.outputDir);

      // Load & compose the schemas
      const querySchemaPath = query?.schema.file;
      const mutationSchemaPath = mutation?.schema.file;

      const composed = composeSchema({
        schemas: {
          query: querySchemaPath ? {
            schema: this._loadSchemaFile(querySchemaPath),
            absolutePath: querySchemaPath
          } : undefined,
          mutation: mutationSchemaPath ? {
            schema: this._loadSchemaFile(mutationSchemaPath),
            absolutePath: mutationSchemaPath
          } : undefined
        },
        resolvers: {
          external: (uri: string) => {
            return this._tryFetchSchema(
              uri,
              manifest,
              !!this._config.testEnv
            );
          },
          local: (path: string) => {
            return Promise.resolve(this._loadSchemaFile(path));
          }
        }
      });

      if (mutation) {
        await this._compileWasmModule(
          mutation.module.file,
          "mutation",
          outputDir,
          spinner,
          quiet,
          verbose
        );
        mutation.module.file = "./mutation.wasm";
      }

      if (query) {
        await this._compileWasmModule(
          query.module.file,
          "query",
          outputDir,
          spinner,
          quiet,
          verbose
        );
        query.module.file = "./query.wasm";
        query.schema.file = "./schema.graphql";
      }

      fs.writeFileSync(`${outputDir}/schema.graphql`, schema, "utf-8");

      Web3APIManifest.dump(manifest, `${outputDir}/web3api.yaml`);
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
    let w3Wasm = "";

    for (
      let dir: string | undefined = path.resolve(baseDir);
      // Terminate after the root dir or when we have found node_modules
      dir !== undefined;
      // Continue with the parent directory, terminate after the root dir
      dir = path.dirname(dir) === dir ? undefined : path.dirname(dir)
    ) {
      if (fs.existsSync(path.join(dir, "node_modules"))) {
        libsDirs.push(path.join(dir, "node_modules"));
        if (fs.existsSync(path.join(dir, "node_modules/@web3api/wasm-as"))) {
          w3Wasm = path.resolve(
            dir,
            "node_modules/@web3api/wasm-as/assembly/index.ts"
          );
        }
      }
    }

    if (libsDirs.length === 0) {
      throw Error(
        `could not locate \`node_modules\` in parent directories of web3api manifest`
      );
    }

    const args = [
      w3Wasm,
      moduleAbsolute,
      "--baseDir",
      baseDir,
      "--lib",
      libsDirs.join(","),
      "--outFile",
      `${outputDir}/${moduleName}.wasm`,
      "--optimize",
      "--debug",
      "--runtime",
      "full",
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
  }

  private _loadSchemaFile(schemaPath: string) {
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : this._appendPath(
            this._config.manifestPath,
            schemaPath
          ),
      "utf-8"
    )
  }

  private async _tryFetchSchema(
    uri: string,
    manifest: Manifest,
    testEnv: boolean
  ): Promise<string> {
    // Check to see if we have any import redirects that match
    if (manifest.import_redirects) {
      for (const redirect of manifest.import_redirects) {
        const redirectUri = new Uri(redirect.uri);
        const uriParsed = new Uri(uri);

        if (Uri.equals(redirectUri, uriParsed)) {
          return this._loadSchemaFile(redirect.schema);
        }
      }
    }

    // Try to fetch from test env if it exists
    if (this._config.testEnv) {
      const client = new Web3ApiClient({
        redirects: 
      })
    }
    // TODO: fetch from test-net, fetch from mainnet
    // TODO: need an easy way of configuring a testnet client (for dapps too)
    // TODO: pass in the client to the compiler from the command? Client[testnet, mainnet]?
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
