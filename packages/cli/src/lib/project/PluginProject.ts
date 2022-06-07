import { ProjectConfig, Project } from ".";
import {
  loadPluginManifest,
  PluginManifestLanguage,
  pluginManifestLanguages,
  isPluginManifestLanguage,
  pluginManifestLanguageToBindLanguage,
  intlMsg,
  resetDir,
} from "..";

import { PluginManifest } from "@web3api/core-js";
import { getCommonPath } from "@web3api/os-js";
import { bindSchema, BindOutput, BindOptions } from "@web3api/schema-bind";
import { ComposerOutput } from "@web3api/schema-compose";
import { TypeInfo } from "@web3api/schema-parse";
import path from "path";

export interface PluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
}

export class PluginProject extends Project<PluginManifest> {
  private _pluginManifest: PluginManifest | undefined;

  public static cacheLayout = {
    root: "plugin",
  };

  constructor(protected _config: PluginProjectConfig) {
    super(_config, {
      rootDir: _config.rootDir,
      subDir: PluginProject.cacheLayout.root
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
      manifest.language,
      pluginManifestLanguages,
      isPluginManifestLanguage
    );
  }

  /// Manifest (web3api.plugin.yaml)

  public async getName(): Promise<string> {
    return (await this.getManifest()).name;
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
    const language = (await this.getManifest()).language;

    Project.validateManifestLanguage(
      language,
      pluginManifestLanguages,
      isPluginManifestLanguage
    );

    return language as PluginManifestLanguage;
  }

  /// Schema

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    const namedPaths: { [name: string]: string } = {};

    if (manifest.modules.mutation) {
      namedPaths["mutation"] = path.join(dir, manifest.modules.mutation.schema);
    }

    if (manifest.modules.query) {
      namedPaths["query"] = path.join(dir, manifest.modules.query.schema);
    }

    return namedPaths;
  }

  public async getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  > {
    const manifest = await this.getManifest();
    return manifest.import_redirects || [];
  }

  public async generateSchemaBindings(
    composerOutput: ComposerOutput,
    generationSubPath?: string
  ): Promise<BindOutput> {
    const manifest = await this.getManifest();
    const queryModule = manifest.modules.query?.module as string;
    const queryDirectory = manifest.modules.query
      ? this._getGenerationDirectory(queryModule, generationSubPath)
      : undefined;
    const mutationModule = manifest.modules.mutation?.module as string;
    const mutationDirectory = manifest.modules.mutation
      ? this._getGenerationDirectory(mutationModule, generationSubPath)
      : undefined;

    if (
      queryDirectory &&
      mutationDirectory &&
      queryDirectory === mutationDirectory
    ) {
      throw Error(
        intlMsg.lib_compiler_dup_code_folder({ directory: queryDirectory })
      );
    }

    // Clean the code generation
    if (queryDirectory) {
      resetDir(queryDirectory);
    }

    if (mutationDirectory) {
      resetDir(mutationDirectory);
    }

    const bindLanguage = pluginManifestLanguageToBindLanguage(
      await this.getManifestLanguage()
    );

    const options: BindOptions = {
      projectName: manifest.name,
      modules: [],
      bindLanguage,
    };

    if (manifest.modules.query) {
      options.modules.push({
        name: "query",
        typeInfo: composerOutput.query?.typeInfo as TypeInfo,
        schema: composerOutput.combined?.schema as string,
        outputDirAbs: queryDirectory as string,
      });
    }

    if (manifest.modules.mutation) {
      options.modules.push({
        name: "mutation",
        typeInfo: composerOutput.mutation?.typeInfo as TypeInfo,
        schema: composerOutput.combined?.schema as string,
        outputDirAbs: mutationDirectory as string,
      });
    }

    if (mutationDirectory && queryDirectory) {
      options.commonDirAbs = path.join(
        getCommonPath(queryDirectory, mutationDirectory),
        "w3"
      );
    } else if (mutationDirectory || queryDirectory) {
      options.commonDirAbs = path.resolve(
        path.join(mutationDirectory || queryDirectory || "", "../../w3")
      );
    }

    return bindSchema(options);
  }

  private _getGenerationDirectory(
    entryPoint: string,
    generationSubPath = "w3"
  ): string {
    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : path.join(this.getManifestDir(), entryPoint);
    return path.join(path.dirname(absolute), generationSubPath);
  }
}
