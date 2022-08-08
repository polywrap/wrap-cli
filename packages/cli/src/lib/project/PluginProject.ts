import { ProjectConfig, Project, PolywrapProject } from ".";
import {
  loadPluginManifest,
  PluginManifestLanguage,
  pluginManifestLanguages,
  isPluginManifestLanguage,
  pluginManifestLanguageToBindLanguage,
  loadDeployManifest,
  loadDeployManifestExt,
} from "./manifests";
import { resetDir } from "../system";
import { Deployable } from "./Deployable";
import { Deployer } from "../deploy";

import {
  DeployManifest,
  PluginManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema } from "jsonschema";
import { bindSchema, BindOutput, BindOptions } from "@polywrap/schema-bind";
import { ComposerOutput } from "@polywrap/schema-compose";
import { Abi } from "@polywrap/schema-parse";
import path from "path";

export interface PluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
  deployManifestPath?: string;
}

export class PluginProject
  extends Project<PluginManifest>
  implements Deployable {
  private _pluginManifest: PluginManifest | undefined;
  private _deployManifest: DeployManifest | undefined;
  private _defaultDeployModulesCached = false;

  public static cacheLayout = {
    root: "plugin",
    deployDir: "deploy/",
    deployModulesDir: "deploy/modules/",
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
      manifest.language,
      pluginManifestLanguages,
      isPluginManifestLanguage
    );
  }

  /// Manifest (polywrap.plugin.yaml)

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

  public async getSchemaNamedPath(): Promise<string> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    return path.join(dir, manifest.schema);
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
    const module = manifest.module as string;
    const moduleDirectory = this._getGenerationDirectory(
      module,
      generationSubPath
    );

    // Clean the code generation
    resetDir(moduleDirectory);
    const bindLanguage = pluginManifestLanguageToBindLanguage(
      await this.getManifestLanguage()
    );

    const options: BindOptions = {
      projectName: manifest.name,
      abi: composerOutput.abi as Abi,
      schema: composerOutput.schema as string,
      outputDirAbs: moduleDirectory,
      bindLanguage,
    };

    return bindSchema(options);
  }

  /// Deployable

  /// Polywrap Deploy Manifest (polywrap.deploy.yaml)

  public async getDeployManifestPath(): Promise<string | undefined> {
    const polywrapManifest = await this.getManifest();

    // If a custom deploy manifest path is configured
    if (this._config.deployManifestPath) {
      return this._config.deployManifestPath;
    }
    // If the polywrap.yaml manifest specifies a custom deploy manifest
    else if (polywrapManifest.deploy) {
      this._config.deployManifestPath = path.join(
        this.getManifestDir(),
        polywrapManifest.deploy
      );
      return this._config.deployManifestPath;
    }
    // No deploy manifest found
    else {
      return undefined;
    }
  }

  public async getDeployManifestDir(): Promise<string | undefined> {
    const manifestPath = await this.getDeployManifestPath();

    if (manifestPath) {
      return path.dirname(manifestPath);
    } else {
      return undefined;
    }
  }

  public async getDeployManifest(): Promise<DeployManifest | undefined> {
    if (!this._deployManifest) {
      const manifestPath = await this.getDeployManifestPath();

      if (manifestPath) {
        this._deployManifest = await loadDeployManifest(
          manifestPath,
          this.quiet
        );
      }
    }
    return this._deployManifest;
  }

  public async getDeployModule(
    moduleName: string
  ): Promise<{ deployer: Deployer; manifestExt: JsonSchema | undefined }> {
    if (!this._defaultDeployModulesCached) {
      throw new Error("Deploy modules have not been cached");
    }

    const cachePath = this._cache.getCachePath(
      `${PolywrapProject.cacheLayout.deployModulesDir}/${moduleName}`
    );

    const manifestExtPath = path.join(cachePath, "polywrap.deploy.ext.json");

    const manifestExt = await loadDeployManifestExt(manifestExtPath);

    return {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      deployer: require(cachePath).default as Deployer,
      manifestExt,
    };
  }

  public async cacheDeployModules(modules: string[]): Promise<void> {
    if (this._defaultDeployModulesCached) {
      return;
    }

    this._cache.removeCacheDir(PolywrapProject.cacheLayout.deployModulesDir);

    for await (const deployModule of modules) {
      await this._cache.copyIntoCache(
        `${PolywrapProject.cacheLayout.deployModulesDir}/${deployModule}`,
        `${__dirname}/../defaults/deploy-modules/${deployModule}/*`,
        { up: true }
      );
    }

    this._defaultDeployModulesCached = true;
  }

  private _getGenerationDirectory(
    entryPoint: string,
    generationSubPath = "wrap"
  ): string {
    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : path.join(this.getManifestDir(), entryPoint);
    return path.join(path.dirname(absolute), generationSubPath);
  }
}
