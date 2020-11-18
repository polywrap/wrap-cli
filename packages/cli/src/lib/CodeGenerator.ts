import { Web3API } from "./Web3API";
import { Manifest } from "./Manifest";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";

import fs from "fs";

const fsExtra = require("fs-extra");
const toolbox = require("gluegun/toolbox");

export interface CodeGeneratorConfig {
  manifestPath: string;
  outputDir: string;
  language: string;
}

export class CodeGenerator {
  constructor(private _config: CodeGeneratorConfig) { }

  public async generate(): Promise<boolean> {
    try {
      // Load the API
      const api = await this._loadWeb3API();

      // Init & clean output directory
      const { outputDir } = this._config;

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // TODO: check for files in this directory, if they exist ask to delete them
      // fsExtra.emptyDirSync(outputDir);

      // Compose the schema
      // TODO:
      // - take all schemas
      // - pass them to the schema-composer
      // - - aggregate all schemas
      // - - add all missing scalar declarations
      // - - validation?

      // Generate the schema bindings
      // TODO: give composite schema to language bindings (use map)

      return true;
    } catch (e) {
      toolbox.print.error(e);
      return false;
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
}