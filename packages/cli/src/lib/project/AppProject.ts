import { Project, ProjectConfig } from ".";
import {
  AppManifestLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  appManifestLanguageToBindLanguage,
} from "./manifests";
import { loadAppManifest, loadCodegenManifest } from "../manifest";
import { defaultCodegenDir } from "../option-defaults";

import {
  AppManifest,
  CodegenManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { bindSchema, BindOutput } from "@polywrap/schema-bind";
import path from "path";
import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export interface AppProjectConfig extends ProjectConfig {
  appManifestPath: string;
  codegenManifestPath?: string;
}

export class AppProject extends Project<AppManifest> {
  private _appManifest: AppManifest | undefined;
  private _codegenManifest: CodegenManifest | undefined;

  public static cacheLayout = {
    root: "app",
  };

  constructor(protected _config: AppProjectConfig) {
    super(_config, {
      rootDir: _config.rootDir,
      subDir: AppProject.cacheLayout.root,
    });
  }

  /// Project Based Methods

  public reset(): void {
    this._appManifest = undefined;
    this._cache.resetCache();
  }

  public async validate(): Promise<void> {
    const manifest = await this.getManifest();

    // Validate language
    Project.validateManifestLanguage(
      manifest.project.type,
      appManifestLanguages,
      isAppManifestLanguage
    );
  }

  /// Manifest (polywrap.app.yaml)

  public async getName(): Promise<string> {
    return (await this.getManifest()).project.name;
  }

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

  public async getManifestLanguage(): Promise<AppManifestLanguage> {
    const language = (await this.getManifest()).project.type;

    Project.validateManifestLanguage(
      language,
      appManifestLanguages,
      isAppManifestLanguage
    );

    return language as AppManifestLanguage;
  }

  /// Schema
  public async getSchemaNamedPath(): Promise<string> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    return path.join(dir, manifest.source.schema);
  }

  public async getImportAbis(): Promise<AppManifest["source"]["import_abis"]> {
    const manifest = await this.getManifest();
    return manifest.source.import_abis || [];
  }

  public async generateSchemaBindings(
    abi: WrapAbi,
    codegenDirAbs?: string
  ): Promise<BindOutput> {
    const codegenManifest = await this.getCodegenManifest();
    const codegenDirectory = this._getGenerationDirectory(
      codegenDirAbs,
      codegenManifest
    );

    return bindSchema({
      projectName: await this.getName(),
      abi,
      outputDirAbs: codegenDirectory,
      bindLanguage: appManifestLanguageToBindLanguage(
        await this.getManifestLanguage()
      ),
      config: codegenManifest?.config,
    });
  }

  /// Polywrap Codegen Manifest (polywrap.codegen.yaml)

  public async getCodegenManifestPath(): Promise<string | undefined> {
    const appManifest = await this.getManifest();

    // If a custom codegen manifest path is configured
    if (this._config.codegenManifestPath) {
      return this._config.codegenManifestPath;
    }
    // If the project manifest specifies a custom codegen manifest
    else if (appManifest.extensions?.codegen) {
      this._config.codegenManifestPath = path.join(
        this.getManifestDir(),
        appManifest.extensions.codegen
      );
      return this._config.codegenManifestPath;
    }
    // No codegen manifest found
    else {
      return undefined;
    }
  }

  public async getCodegenManifestDir(): Promise<string | undefined> {
    const manifestPath = await this.getCodegenManifestPath();

    if (manifestPath) {
      return path.dirname(manifestPath);
    } else {
      return undefined;
    }
  }

  public async getCodegenManifest(): Promise<CodegenManifest | undefined> {
    if (!this._codegenManifest) {
      const manifestPath = await this.getCodegenManifestPath();

      if (manifestPath) {
        const language = await this.getManifestLanguage();
        const extensionDir = `${__dirname}/../defaults/codegen-config/${language}`;
        this._codegenManifest = await loadCodegenManifest(
          manifestPath,
          extensionDir,
          this.quiet
        );
      }
    }
    return this._codegenManifest;
  }

  /// Private Helpers

  private _getGenerationDirectory(
    codegenDirAbs?: string,
    codegenManifest?: CodegenManifest
  ): string {
    return path.join(
      this.getManifestDir(),
      codegenDirAbs ?? codegenManifest?.codegenDir ?? defaultCodegenDir
    );
  }
}
