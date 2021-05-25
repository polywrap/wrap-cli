import { loadWeb3ApiManifest, loadBuildManifest } from "./helpers";

import { Web3ApiManifest, BuildManifest } from "@web3api/core-js";
import path from "path";
import fs from "fs";

export interface ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath: string;
  quiet?: boolean;
}

export class Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;

  constructor(private _config: ProjectConfig) {}

  get web3apiManifestPath(): string {
    return this._config.web3apiManifestPath;
  }

  get web3apiManifestDir(): string {
    return path.dirname(this.web3apiManifestPath);
  }

  get quiet(): boolean {
    return !!this._config.quiet;
  }

  public async getBuildManifestPath(): Promise<string> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If a custom build manifest path is configured
    if (this._config.buildManifestPath) {
      return this._config.buildManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom build manifest
    else if (web3apiManifest.build) {
      return `${this.web3apiManifestDir}/${web3apiManifest.build}`;
    }
    // Use a default build manifest for the provided language
    else {
      const language = web3apiManifest.language;
      const path = `${__dirname}/build-env/${language}/web3api.build.yaml`;

      if (!fs.existsSync(path)) {
        throw Error(`Unrecognized build language ${language}. No manifest found at ${path}.`);
      }

      return path;
    }
  }

  public async getBuildManifestDir(): Promise<string> {
    return path.dirname(await this.getBuildManifestPath());
  }

  public async getWeb3ApiManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
      this._web3apiManifest = await loadWeb3ApiManifest(
        this.web3apiManifestPath, this.quiet
      );
    }

    return Promise.resolve(this._web3apiManifest);
  }

  public async getBuildManifest(): Promise<BuildManifest> {
    if (!this._buildManifest) {
      this._buildManifest = await loadBuildManifest(
        await this.getBuildManifestPath(),
        this.quiet
      );
    }

    return Promise.resolve(this._buildManifest);
  }

  public clearCache(): void {
    this._web3apiManifest = undefined;
    this._buildManifest = undefined;
  }
}
