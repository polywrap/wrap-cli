/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Web3ApiManifest } from "./Web3ApiManifest";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";

import fs, { readFileSync } from "fs";
import path from "path";
import * as asc from "assemblyscript/cli/asc";
import { Manifest, Uri, Web3ApiClient, UriRedirect } from "@web3api/client-js";
import { bindSchema, writeDirectory } from "@web3api/schema-bind";
import { composeSchema, ComposerOutput } from "@web3api/schema-compose";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const toolbox = require("gluegun/toolbox");

export interface CompilerConfig {
  manifestPath: string;
  outputDir: string;
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export class Compiler {
  private _manifestDir: string;

  constructor(private _config: CompilerConfig) {
    this._manifestDir = path.dirname(_config.manifestPath);
  }

  public async compile(quiet?: boolean, verbose?: boolean): Promise<boolean> {
    try {
      // Load the manifest
      const manifest = await this._loadManifest();

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
      const composed = await this._composeSchemas(manifest);

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
      "--use",
      `abort=${path.relative(
        process.cwd(),
        path.join(baseDir, "w3/entry/w3Abort")
      )}`,
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

  private async _composeSchemas(manifest: Manifest): Promise<ComposerOutput> {
    const querySchemaPath = manifest.query?.schema.file;
    const mutationSchemaPath = manifest.mutation?.schema.file;

    return composeSchema({
      schemas: {
        query: querySchemaPath
          ? {
              schema: this._fetchLocalSchema(querySchemaPath),
              absolutePath: querySchemaPath,
            }
          : undefined,
        mutation: mutationSchemaPath
          ? {
              schema: this._fetchLocalSchema(mutationSchemaPath),
              absolutePath: mutationSchemaPath,
            }
          : undefined,
      },
      resolvers: {
        external: (uri: string) => this._fetchExternalSchema(uri, manifest),
        local: (path: string) => Promise.resolve(this._fetchLocalSchema(path)),
      },
    });
  }

  private async _fetchExternalSchema(
    uri: string,
    manifest: Manifest
  ): Promise<string> {
    // Check to see if we have any import redirects that match
    if (manifest.import_redirects) {
      for (const redirect of manifest.import_redirects) {
        const redirectUri = new Uri(redirect.uri);
        const uriParsed = new Uri(uri);

        if (Uri.equals(redirectUri, uriParsed)) {
          return this._fetchLocalSchema(redirect.schema);
        }
      }
    }

    const { ensAddress, ethProvider, ipfsProvider } = this._config;

    // If custom providers are supplied, try fetching the URI
    // with them added to the client first
    if (ensAddress || ethProvider || ipfsProvider) {
      const redirects: UriRedirect[] = [];

      if (ensAddress) {
        redirects.push({
          from: new Uri("w3://ens/ens.web3api.eth"),
          to: {
            factory: () => new EnsPlugin({ address: ensAddress }),
            manifest: EnsPlugin.manifest(),
          },
        });
      }

      if (ethProvider) {
        redirects.push({
          from: new Uri("w3://ens/ethereum.web3api.eth"),
          to: {
            factory: () => new EthereumPlugin({ provider: ethProvider }),
            manifest: EthereumPlugin.manifest(),
          },
        });
      }

      if (ipfsProvider) {
        redirects.push({
          from: new Uri("w3://ens/ipfs.web3api.eth"),
          to: {
            factory: () => new IpfsPlugin({ provider: ipfsProvider }),
            manifest: IpfsPlugin.manifest(),
          },
        });
      }

      try {
        const client = new Web3ApiClient({ redirects });
        const api = await client.loadWeb3Api(new Uri(uri));
        const schema = await api.getSchema(client);

        if (schema) {
          return schema;
        }
      } catch (e) {
        // Do nothing, try using the default client below
      }
    }

    // Try fetching the schema with a vanilla Web3API client
    const client = new Web3ApiClient();
    const api = await client.loadWeb3Api(new Uri(uri));
    return await api.getSchema(client);
  }

  private _fetchLocalSchema(schemaPath: string) {
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : this._appendPath(this._config.manifestPath, schemaPath),
      "utf-8"
    );
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
