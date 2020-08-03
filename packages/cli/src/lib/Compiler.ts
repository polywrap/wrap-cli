import { Web3API } from "./Web3API";
import { Manifest } from "./Manifest";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";

import fs from "fs";
import path from "path";
import * as asc from "assemblyscript/cli/asc";

const fsExtra = require("fs-extra");
const IPFSClient = require("ipfs-http-client");
const toolbox = require("gluegun/toolbox");

export interface ICompilerConfig {
  manifestPath: string;
  ipfs?: string;
  outputDir: string;
  outputFormat: string;
}

export class Compiler {
  // @ts-ignore
  private _ipfs: IPFSClient | undefined;

  private _manifestDir: string;

  constructor(private _config: ICompilerConfig) {
    if (_config.ipfs) {
      let url;
      try {
        url = new URL(_config.ipfs);
      } catch (e) {
        throw Error(`IPFS URL Malformed: ${_config.ipfs}\n${e}`)
      }

      this._ipfs = new IPFSClient(_config.ipfs);
    }

    this._manifestDir = path.dirname(_config.manifestPath);
  }

  public async compile(): Promise<boolean> {
    try {
      // Load the API
      const api = await this._loadWeb3API();

      // Init & clean build directory
      const { outputDir } = this._config;

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      fsExtra.emptyDirSync(outputDir);

      // Compile the API
      await this._compileWeb3API(api);

      // TODO:
      /*if (this._ipfs !== undefined) {
        const ipfsHash = await this.uploadWeb3APIToIPFS(this._config.outputDir)
        this.completed(ipfsHash)
        return ipfsHash
      } else {
        this.completed(path.join(this._config.outputDir, 'web3api.yaml'))
        return true
      }*/;
      return true;
    } catch (e) {
      toolbox.print.error(e)
      return false
    }
  }

  private async _loadWeb3API(quiet: boolean = false): Promise<Manifest> {
    const run = () => {
      return Web3API.load(this._config.manifestPath);
    }

    if (quiet) {
      return run();
    } else {
      const manifestPath = displayPath(this._config.manifestPath);

      return await withSpinner(
        `Load web3api from ${manifestPath}`,
        `Failed to load web3api from ${manifestPath}`,
        `Warnings loading web3api from ${manifestPath}`,
        async spinner => {
          return run();
        },
      )
    }
  }

  private async _compileWeb3API(manifest: Manifest, quiet: boolean = false) {
    const run = async (spinner?: any) => {
      const { mutation, query, subgraph } = manifest;
      const { outputDir } = this._config;

      let schema = "";
      const loadSchema = (schemaPath: string) => {
        schema += `${fs.readFileSync(schemaPath, "utf-8")}\n`;
      }

      if (mutation) {
        loadSchema(mutation.schema.file);
        await this._compileWASMModule(
          mutation.module.file,
          'mutation',
          outputDir,
          spinner
        );
        mutation.module.file = './mutation.wasm';
        mutation.schema.file = './schema.graphql';
      }

      if (query) {
        loadSchema(query.schema.file);
        await this._compileWASMModule(
          query.module.file,
          'query',
          outputDir,
          spinner
        );
        query.module.file = './query.wasm';
        query.schema.file = './schema.graphql';
      }

      // TODO:
      /*if (subgraph) {
        const subgraphManifest = loadSubgraph(subgraph.file);
        loadSchema(subgraphManifest.schema);
        buildSubgraph(
          subgraphManifest, `${outputDir}/subgraph`, spinner
        );
      }*/

      fs.writeFileSync(
        `${outputDir}/schema.graphql`, schema, "utf-8"
      );

      Web3API.dump(manifest, `${outputDir}/web3api.yaml`);

      // TODO: add validation
      // - WASM modules
      // - WASM exports <> GraphQL Schema
      // - Schemas
      // - Subgraph
    }

    if (quiet) {
      return run();
    } else {
      return await withSpinner(
        'Compile Web3API',
        'Failed to compile Web3API',
        'Warnings while compiling Web3API',
        async spinner => {
          return run(spinner);
        }
      )
    }
  }

  private async _compileWASMModule(
    modulePath: string,
    moduleName: string,
    outputDir: string,
    spinner?: any
  ) {

    step(
      spinner,
      "Compiling WASM module:",
      `${modulePath} => ${outputDir}/${moduleName}.wasm`
    );

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
      if (fs.existsSync(path.join(dir, 'node_modules'))) {
        libsDirs.push(path.join(dir, 'node_modules'));
      }
    }

    if (libsDirs.length === 0) {
      throw Error(
        `could not locate \`node_modules\` in parent directories of subgraph manifest`,
      )
    }

    const args = [
      moduleAbsolute,
      "--baseDir",
      baseDir,
      "--lib",
      libsDirs.join(','),
      "--outFile",
      `${outputDir}/${moduleName}.wasm`,
      "--optimize",
      "--debug"
    ];

    // compile the module into the output directory
    await asc.main(
      args,
      {
        stdout: process.stdout,
        stderr: process.stdout
      },
      (e: Error | null) => {
        if (e != null) {
          throw e;
        }
        return 0;
      }
    );
  }
}
