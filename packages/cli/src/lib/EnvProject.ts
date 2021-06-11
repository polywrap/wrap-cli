import { loadWeb3ApiManifest, loadEnvManifest } from "./helpers";
import { runCommand } from "./helpers/command";

import { Web3ApiManifest, EnvManifest } from "@web3api/core-js";
import path from "path";
import fs from "fs";
import YAML from "js-yaml";
import rimraf from "rimraf";
import copyfiles from "copyfiles";

export interface ProjectConfig {
  web3apiManifestPath: string;
  modulesToUse: string[];
  envManifestPath?: string;
  quiet?: boolean;
}

const BASE_PACKAGE_JSON = {
  name: "@web3api/w3-env",
  version: "1.0.0",
  private: true,
  dependencies: {},
};

type Module = Exclude<EnvManifest["modules"], undefined>[number];

export class EnvProject {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _envManifest: EnvManifest | undefined;
  private _defaultEnvManifestCached = false;
  private _modulesInstalled = false;

  constructor(private _config: ProjectConfig) {}

  get quiet(): boolean {
    return !!this._config.quiet;
  }

  public reset(): void {
    this._web3apiManifest = undefined;
    this._envManifest = undefined;
    this._defaultEnvManifestCached = false;
  }

  public async getManifestPaths(absolute = false): Promise<string[]> {
    const web3apiManifestPath = this.getWeb3ApiManifestPath();
    const root = path.dirname(web3apiManifestPath);

    return [
      absolute ? web3apiManifestPath : path.relative(root, web3apiManifestPath),
      absolute
        ? await this.getEnvManifestPath()
        : path.relative(root, await this.getEnvManifestPath()),
    ];
  }

  /// Web3API Manifest (web3api.yaml)

  public getWeb3ApiManifestPath(): string {
    return this._config.web3apiManifestPath;
  }

  public getWeb3ApiManifestDir(): string {
    return path.dirname(this.getWeb3ApiManifestPath());
  }

  public async getWeb3ApiManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
      this._web3apiManifest = await loadWeb3ApiManifest(
        this.getWeb3ApiManifestPath(),
        this.quiet
      );
    }

    return Promise.resolve(this._web3apiManifest);
  }

  /// Web3API Env Manifest (web3api.env.yaml)

  public async getEnvManifestPath(): Promise<string> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If a custom env manifest path is configured
    if (this._config.envManifestPath) {
      return this._config.envManifestPath;
    }

    // If the web3api.yaml manifest specifies a custom env manifest
    else if (web3apiManifest.env) {
      this._config.envManifestPath = path.join(
        this.getWeb3ApiManifestDir(),
        web3apiManifest.env
      );

      return this._config.envManifestPath;
    } else {
      await this.cacheDefaultEnvManifestFiles();

      // Return the cached manifest
      this._config.envManifestPath = path.join(
        this.getCachePath("env"),
        "web3api.env.yaml"
      );
      return this._config.envManifestPath;
    }
    // Use a default env manifest for the provided language
  }

  public async getEnvManifestDir(): Promise<string> {
    return path.dirname(await this.getEnvManifestPath());
  }

  public async getEnvManifest(): Promise<EnvManifest> {
    if (!this._envManifest) {
      this._envManifest = await loadEnvManifest(
        await this.getEnvManifestPath(),
        this.quiet
      );
    }

    return this._envManifest;
  }

  public async cacheDefaultEnvManifestFiles(): Promise<void> {
    if (this._defaultEnvManifestCached) {
      return;
    }

    // Update the cache
    this.removeCacheDir("env");
    await this.copyFilesIntoCache("env/", `${__dirname}/env/default/*`);

    this._defaultEnvManifestCached = true;
  }

  /// Cache (.w3 folder)

  public getCacheDir(): string {
    return path.join(this.getWeb3ApiManifestDir(), ".w3");
  }

  public readCacheFile(file: string): string | undefined {
    const filePath = path.join(this.getCacheDir(), file);

    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    return fs.readFileSync(filePath, "utf-8");
  }

  public removeCacheDir(subfolder: string): void {
    const folderPath = path.join(this.getCacheDir(), subfolder);
    rimraf.sync(folderPath);
  }

  public getCachePath(subpath: string): string {
    return path.join(this.getCacheDir(), subpath);
  }

  public async copyFilesIntoCache(
    destSubfolder: string,
    sourceFolder: string
  ): Promise<void> {
    const dest = this.getCachePath(destSubfolder);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    await new Promise((resolve, reject) => {
      copyfiles([sourceFolder, dest], { up: true }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  public getFilteredModules = async (): Promise<Module[]> => {
    const manifest = await this.getEnvManifest();

    if (!manifest.modules) {
      return [];
    }

    if (!this._config.modulesToUse || !this._config.modulesToUse.length) {
      return manifest.modules;
    }

    return manifest.modules.filter((module) =>
      this._config.modulesToUse.includes(module.name)
    );
  };

  public async installModules(): Promise<void> {
    //Compose package.json under .w3 folder and install deps

    const modules = await this.getFilteredModules();

    console.log("MODS: ", modules);
    console.log(this._modulesInstalled);

    if (!modules || !modules.length) {
      return;
    }

    const packageJSON = {
      ...BASE_PACKAGE_JSON,
      dependencies: modules.reduce((acc, current) => {
        acc[current.module] = current.version;
        return acc;
      }, {} as Record<string, string>),
    };

    fs.writeFileSync(
      path.join(this.getCachePath("env"), "package.json"),
      JSON.stringify(packageJSON)
    );

    await runCommand(`cd ${this.getCachePath("env")} && npm i`);

    this._modulesInstalled = true;
  }

  public async generateBaseDockerCompose(): Promise<void> {
    const manifest = await this.getEnvManifest();
    const fileContent = YAML.dump(manifest.dockerCompose);

    fs.writeFileSync(
      path.join(this.getCachePath("env"), "docker-compose.yml"),
      fileContent
    );
  }

  public async getDockerComposePaths(): Promise<string[]> {
    if (!this._modulesInstalled) {
      throw new Error("Env modules have not been installed");
    }

    const modules = await this.getFilteredModules();

    const defaultPath = "./docker-compose.yml";

    return modules.map((module) => {
      const dockerComposePath = module.dockerComposePath || defaultPath;

      return path.join(
        this.getCachePath("env"),
        "node_modules",
        module.module,
        dockerComposePath
      );
    });
  }

  public async generateBaseComposedCommand(): Promise<string> {
    const baseComposePath = path.join(
      this.getCachePath("env"),
      "docker-compose.yml"
    );
    const manifest = await this.getEnvManifest();
    const env = manifest.env || {};
    const modulePaths = await this.getDockerComposePaths();
    const envKeys = Object.keys(env);

    return `${envKeys
      .map(
        (key, i) =>
          `export ${key}=${env[key]} ${i < envKeys.length ? "&& " : ""}`
      )
      .join("")} docker-compose -f ${baseComposePath} ${modulePaths
      .map((path) => ` -f ${path}`)
      .join("")}`;
  }
}
