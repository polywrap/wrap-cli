import path from "path";
import { Web3API } from "./Web3API";
import { displayPath } from "./helpers/path";

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
  }

  public async compile(): Promise<boolean> {
    try {
      const api = await this._loadWeb3API();
      const compiledApi = await this.compileWeb3API(api);
      const localApi = await this.writeWeb3APIToOutputDirectory(compiledApi);

      if (this._ipfs !== undefined) {
        const ipfsHash = await this.uploadWeb3APIToIPFS(localApi)
        this.completed(ipfsHash)
        return ipfsHash
      } else {
        this.completed(path.join(this._config.outputDir, 'web3api.yaml'))
        return true
      }
    } catch (e) {
      toolbox.print.error(e)
      return false
    }
    // TODO:
    // open manifest
    // validate manifest (everything exists)
    // validate schemas
    // create build directory & clear it
    // build mutations
    // build schema
    // build subgraph
  }

  private async _loadWeb3API(quiet: boolean = false): Manifest {
    if (quiet) {
      return Web3API.load(this._config.manifestPath);
    } else {
      const manifestPath = displayPath(this._config.manifestPath);

      return await withSpinner(
        `Load web3api from ${manifestPath}`,
        `Failed to load web3api from ${manifestPath}`,
        `Warnings loading web3api from ${manifestPath}`,
        async spinner => {
          return Web3API.load(this._config.manifestPath)
        },
      )
    }
  }
}
