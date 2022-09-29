import { ProjectConfig, Project } from ".";
import {
  PluginManifestLanguage,
  pluginManifestLanguages,
  isPluginManifestLanguage,
  pluginManifestLanguageToBindLanguage,
} from "./manifests";
import { resetDir } from "../system";
import { loadCodegenManifest, loadPluginManifest } from "../manifest";
import { defaultCodegenDir } from "../option-defaults";

import {
  CodegenManifest,
  PluginManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { bindSchema, BindOutput, BindOptions } from "@polywrap/schema-bind";
import { WrapAbi } from "@polywrap/schema-parse";
import path from "path";

export interface PluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
  codegenManifestPath?: string;
}

export class PluginProject extends Project<PluginManifest> {
  private _pluginManifest: PluginManifest | undefined;
  private _codegenManifest: CodegenManifest | undefined;

  public static cacheLayout = {
    root: "plugin",
  };

  constructor(protected _config: PluginProjectConfig) {
    super(_config, {
      rootDir: _config.rootDir,
      subDir: PluginProject.cacheLayout.root,
    });
  }

  /// Project Base Methods

  public reset(): void {
    this._pluginManifest = undefined;
    this._cache.resetCache();
  }

  public async validate(): Promise<void> {
    const manifest = await this.getManifest();

    // Validate language
    Project.validateManifestLanguage(
      manifest.project.type,
      pluginManifestLanguages,
      isPluginManifestLanguage
    );
  }

  /// Manifest (polywrap.plugin.yaml)

  public async getName(): Promise<string> {
    return (await this.getManifest()).project.name;
  }

  public async getManifest(): Promise<PluginManifest> {
    if (!this._pluginManifest) {
      this._pluginManifest = await loadPluginManifest(
        this.getManifestPath(),
        this.quiet
      );
    }

    return Promise.resolve(this._pluginManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this._config.pluginManifestPath);
  }

  public getManifestPath(): string {
    return this._config.pluginManifestPath;
  }

  public async getManifestLanguage(): Promise<PluginManifestLanguage> {
    const language = (await this.getManifest()).project.type;

    Project.validateManifestLanguage(
      language,
      pluginManifestLanguages,
      isPluginManifestLanguage
    );

    return language as PluginManifestLanguage;
  }

  /// Schema

  public async getSchemaNamedPath(): Promise<string> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    return path.join(dir, manifest.source.schema);
  }

  public async getImportAbis(): Promise<
    PluginManifest["source"]["import_abis"]
  > {
    const manifest = await this.getManifest();
    return manifest.source.import_abis || [];
  }

  public async generateSchemaBindings(
    abi: WrapAbi,
    codegenDirAbs?: string
  ): Promise<BindOutput> {
    const manifest = await this.getManifest();
    const codegenManifest = await this.getCodegenManifest();
    const moduleDirectory = this._getGenerationDirectory(
      codegenDirAbs,
      codegenManifest
    );

    // Clean the code generation
    resetDir(moduleDirectory);
    const bindLanguage = pluginManifestLanguageToBindLanguage(
      await this.getManifestLanguage()
    );

    const options: BindOptions = {
      projectName: manifest.project.name,
      abi,
      outputDirAbs: moduleDirectory,
      bindLanguage,
    };

    return bindSchema(options);
  }

  /// Polywrap Codegen Manifest (polywrap.build.yaml)

  public async getCodegenManifestPath(): Promise<string | undefined> {
    const pluginManifest = await this.getManifest();

    // If a custom codegen manifest path is configured
    if (this._config.codegenManifestPath) {
      return this._config.codegenManifestPath;
    }
    // If the project manifest specifies a custom codegen manifest
    else if (pluginManifest.extensions?.codegen) {
      this._config.codegenManifestPath = path.join(
        this.getManifestDir(),
        pluginManifest.extensions.codegen
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
        this._codegenManifest = await loadCodegenManifest(
          manifestPath,
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
    const generationSubPath: string = path.relative(
      this.getManifestDir(),
      codegenDirAbs ?? codegenManifest?.codegenDir ?? defaultCodegenDir
    );
    return path.join(this.getManifestDir(), generationSubPath);
  }
}
