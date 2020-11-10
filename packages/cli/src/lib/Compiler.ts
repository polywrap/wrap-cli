import { Manifest } from "@web3api/client-js";
import * as asc from "assemblyscript/cli/asc";

import { Web3API } from "./Web3API";
import { runGraphCLI } from "./cli/graph-cli";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";

import fs from "fs";
import path from "path";
import YAML from "js-yaml";

const fsExtra = require("fs-extra");
const spawn = require("spawn-command");
const toolbox = require("gluegun/toolbox");

export interface ICompilerConfig {
  manifestPath: string;
  outputDir: string;
  outputFormat: string;
}

export class Compiler {
  private _manifestDir: string;

  constructor(private _config: ICompilerConfig) {
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

  private async _compileWeb3API(manifest: Manifest, quiet?: boolean, verbose?: boolean) {
    const run = async (spinner?: any) => {
      const { mutation, query, subgraph } = manifest;
      const { outputDir, manifestPath } = this._config;

      const appendPath = (root: string, subPath: string) => {
        return path.join(path.dirname(root), subPath)
      }

      let schema = "";
      const loadSchema = (schemaPath: string) => {
        schema += `${fs.readFileSync(
          path.isAbsolute(schemaPath) ?
            schemaPath :
            appendPath(manifestPath, schemaPath),
          "utf-8"
        )}\n`;
      }

      if (mutation) {
        loadSchema(mutation.schema.file);
        await this._compileWASMModule(
          mutation.module.file,
          'mutation',
          outputDir,
          spinner,
          quiet,
          verbose
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
          spinner,
          quiet,
          verbose
        );
        query.module.file = './query.wasm';
        query.schema.file = './schema.graphql';
      }

      if (subgraph) {
        const subgraphFile = appendPath(manifestPath, subgraph.file);
        const str: any = fs.readFileSync(
          subgraphFile, "utf-8"
        );
        //const subgraphManifest: any = YAML.safeLoad(str);
        // TODO: hack to get around not having the subgraph types defined
        /*loadSchema(
          appendPath(subgraphFile, subgraphManifest.schema.file)
        );*/
        const cid = await this._compileSubgraph(
          subgraphFile,
          `${outputDir}/subgraph`,
          spinner
        );

        subgraph.id = cid;
        subgraph.file = `./subgraph/subgraph.yaml`;
      }

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
    let w3Wasm = '';

    for (
      let dir: string | undefined = path.resolve(baseDir);
      // Terminate after the root dir or when we have found node_modules
      dir !== undefined;
      // Continue with the parent directory, terminate after the root dir
      dir = path.dirname(dir) === dir ? undefined : path.dirname(dir)
    ) {
      if (fs.existsSync(path.join(dir, 'node_modules'))) {
        libsDirs.push(path.join(dir, 'node_modules'));
        if (fs.existsSync(path.join(dir, 'node_modules/@web3api/wasm-ts'))) {
          w3Wasm = path.resolve(dir, 'node_modules/@web3api/wasm-ts/assembly/index.ts');
        }
      }
    }

    if (libsDirs.length === 0) {
      throw Error(
        `could not locate \`node_modules\` in parent directories of subgraph manifest`,
      )
    }

    const args = [
      w3Wasm,
      moduleAbsolute,
      "--baseDir",
      baseDir,
      "--lib",
      libsDirs.join(','),
      "--outFile",
      `${outputDir}/${moduleName}.wasm`,
      "--optimize",
      "--debug",
      "--runtime",
      "full"
    ];

    // compile the module into the output directory
    await asc.main(
      args,
      {
        stdout: !verbose ? undefined : process.stdout,
        stderr: process.stderr
      },
      (e: Error | null) => {
        if (e != null) {
          throw e;
        }
        return 0;
      }
    );
  }

  // TODO: break out into "compiler modules"
  private async _compileSubgraph(
    subgraphPath: string,
    outputDir: string,
    spinner?: any,
    quiet?: boolean,
    verbose?: boolean
  ): Promise<string> {

    step(
      spinner,
      "Compiling Subgraph...",
      `${subgraphPath} => ${outputDir}/subgraph.yaml`
    );

    const args = [
      "build",
      subgraphPath,
      "--output-dir",
      outputDir,
      // TODO: remove this hack, calculate ourselves?
      "--ipfs",
      "http://localhost:5001"
    ];

    const [exitCode, stdout, stderr] = await runGraphCLI(args);

    if (verbose || exitCode !== 0 || stderr) {
      console.log(exitCode);
      console.log(stdout);
      console.error(stderr);
    }

    const extractCID = /Build completed: (([A-Z]|[a-z]|[0-9])*)/;
    const result = stdout.match(extractCID);
    return result && result.length ? result[1] : "";
  }
}
