import { loadManifest } from "./helpers";

import { Manifest } from "@web3api/core-js";
import path from "path";

export interface ProjectConfig {
  manifestPath: string;
  quiet?: boolean;
}

export class Project {
  private _manifest: Manifest | undefined;

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

  async getManifest(): Promise<Manifest> {
    if (!this._manifest) {
      this._manifest = await loadManifest(this.manifestPath, this.quiet);
    }

    return Promise.resolve(this._manifest);
  }
}
