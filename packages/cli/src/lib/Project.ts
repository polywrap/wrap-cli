import { loadWeb3ApiManifest } from "./helpers";

import { Web3ApiManifest } from "@web3api/core-js";
import path from "path";

export interface ProjectConfig {
  manifestPath: string;
  quiet?: boolean;
}

export class Project {
  private _manifest: Web3ApiManifest | undefined;

  constructor(private _config: ProjectConfig) {}

  get manifestPath(): string {
    return this._config.manifestPath;
  }

  get manifestDir(): string {
    return path.dirname(this.manifestPath);
  }

  get quiet(): boolean {
    return !!this._config.quiet;
  }

  public async getManifest(): Promise<Web3ApiManifest> {
    if (!this._manifest) {
      this._manifest = await loadWeb3ApiManifest(this.manifestPath, this.quiet);
    }

    return Promise.resolve(this._manifest);
  }

  public clearCache(): void {
    this._manifest = undefined;
  }
}
