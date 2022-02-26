import { Project, ProjectConfig } from "./Project";
import { ManifestLanguage, loadAppManifest } from "../helpers";
import { intlMsg } from "../intl";

import { AppManifest, Uri } from "@web3api/core-js";
import path from "path";
import fs from "fs";

const cacheLayout = {
  root: "app"
};

export interface AppProjectConfig extends ProjectConfig {
  appManifestPath: string;
}

export class AppProject extends Project<AppManifest> {
  private _appManifest: AppManifest | undefined;

  constructor(protected _config: AppProjectConfig) {
    super(_config, cacheLayout.root);
  }

  /// Project Based Methods

  public reset(): void {
    this._appManifest = undefined;
    this.resetCache();
  }

  public async validate(): Promise<void> {
    const manifest = await this.getManifest();

    // Validate language
    Project.validateManifestLanguage(
      manifest.language,
      ["app/"]
    );

    // Validate import URIs
    const validateImportUri = (uri: string, isPlugin?: boolean): void => {
      let result: Uri;
      try {
        result = new Uri(uri);
      } catch (e) {
        // check if the uri is a filepath without a fs/ prefix
        const uriPath = path.join(this.getManifestDir(), uri);
        if (!fs.existsSync(uriPath)) {
          throw e;
        }
        result = new Uri(`w3://fs/${uriPath}`);
      }

      // plugins must use a filepath uri
      if (result.authority !== "fs" && isPlugin) {
        throw Error(
          `${intlMsg.lib_project_app_uri_support()}\n` +
          `w3://fs/./node_modules/myPlugin/\n` +
          `fs/./node_modules/myPlugin/\n` +
          `./node_modules/myPlugin/\n\n` +
          `${intlMsg.lib_project_invalid_uri()}: ${uri}`
        );
      }
    };

    const imports = manifest.imports || [];

    for (const imp of imports) {
      validateImportUri(imp.uri, imp.isPlugin);
    }
  }

  /// Manifest (web3api.app.yaml)

  public async getManifest(): Promise<AppManifest> {
    if (!this._appManifest) {
      this._appManifest = await loadAppManifest(
        this.getManifestPath(),
        this.quiet
      );
    }

    return Promise.resolve(this._appManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this._config.appManifestPath);
  }

  public getManifestPath(): string {
    return this._config.appManifestPath;
  }

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getManifest()).language;

    Project.validateManifestLanguage(
      language,
      ["app/"]
    );

    // TODO: Web3ApiManifestLanguage, PluginManifestLanguage, AppManifestLanguage
    return language as ManifestLanguage;
  }
}
