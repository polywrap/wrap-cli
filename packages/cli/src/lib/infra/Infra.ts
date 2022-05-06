import { Web3ApiProject } from "../project";
import { intlMsg } from "../intl";
import { dependencyFetcherClassMap } from "./fetchers";
import { runCommand } from "../system";
import { correctBuildContextPathsFromCompose } from "../helpers/docker";

import { InfraManifest } from "@web3api/core-js";
import path from "path";
import fs from "fs";
import YAML from "js-yaml";

export interface InfraConfig {
  project: Web3ApiProject;
  packagesToUse?: string[];
  quiet?: boolean;
}

interface InitData {
  baseCommand: string;
  correctedDockerComposePaths: string[];
}

type Module = Exclude<InfraManifest["modules"], undefined>[number];
type NamedModule = Module & { name: string };
type NamedRemoteModule = Extract<NamedModule, { registry: string }>;
type NamedLocalModule = Extract<NamedModule, { path: string }>;
type Registry = keyof typeof dependencyFetcherClassMap;

export class Infra {
  private _dockerComposePath: string;
  private _initData: InitData | undefined;
  private _defaultModuleComposePaths = [
    "./docker-compose.yml",
    "./docker-compose.yaml",
  ];

  constructor(private _config: InfraConfig) {
    this._dockerComposePath = path.join(
      _config.project.getInfraCacheModulesPath(),
      "docker-compose.yml"
    );
  }

  public async up(): Promise<void> {
    const { quiet } = this._config;
    const { baseCommand } = await this.getInitData();

    await runCommand(`${baseCommand} up -d --build`, quiet);
  }

  public async down(): Promise<void> {
    const { quiet } = this._config;
    const { baseCommand } = await this.getInitData();

    await runCommand(`${baseCommand} down`, quiet);
  }

  public async config(): Promise<{
    stdout: string;
    stderr: string;
  }> {
    const { quiet } = this._config;
    const { baseCommand } = await this.getInitData();

    return await runCommand(`${baseCommand} config`, quiet);
  }

  public async getVars(): Promise<string[]> {
    const { correctedDockerComposePaths } = await this.getInitData();

    const envVarRegex = /\${([^}]+)}/gm;

    const envVars = correctedDockerComposePaths.reduce((acc, current) => {
      const rawManifest = fs.readFileSync(current, "utf-8");
      const matches = rawManifest.match(envVarRegex) || [];

      return [
        ...acc,
        ...matches.map((match) => {
          if (match.startsWith("$")) {
            if (match.startsWith("${")) {
              return match.slice(2, match.length - 1);
            }

            return match.slice(1);
          }

          return match;
        }),
      ];
    }, [] as string[]);

    return Array.from(new Set(envVars));
    // return `${variables.map((variable) => `\n- ${variable}`).join("")}`;
  }

  private async getInitData(): Promise<InitData> {
    if (!this._initData) {
      await this._init();
    }

    return this._initData as InitData;
  }

  private async _init() {
    const { project, packagesToUse } = this._config;

    // Get the infra manifest
    const manifest = await project.getInfraManifest();

    // Check for unrecognized infra modules
    this._sanitizeModules(manifest, packagesToUse);

    // Fetch infra modules
    const packagePaths = await this._fetchModules(manifest, packagesToUse);

    // generate base docker compose
    await this._generateBaseDockerCompose();

    // generate base composed command
    const command = await this._generateBaseComposedCommand(packagePaths);

    this._initData = {
      baseCommand: command,
      correctedDockerComposePaths: packagePaths,
    };
  }

  private _sanitizeModules(
    manifest: InfraManifest,
    modulesToUse?: string[]
  ): void {
    if (modulesToUse) {
      const manifestModuleNames = Object.keys(manifest.modules);
      const unrecognizedModules: string[] = [];
      modulesToUse.forEach((p: string) => {
        if (!manifestModuleNames.includes(p)) {
          unrecognizedModules.push(p);
        }
      });

      if (unrecognizedModules.length) {
        throw new Error(
          intlMsg.lib_infra_unrecognizedModule({
            modules: unrecognizedModules.join(", "),
          })
        );
      }
    }
  }

  private async _generateBaseComposedCommand(
    correctedDockerComposePaths: string[]
  ): Promise<string> {
    const { project } = this._config;
    const manifest = await project.getInfraManifest();
    const env = manifest.env || {};
    const envKeys = Object.keys(env);

    return `${envKeys
      .map(
        (key, i) =>
          `export ${key}=${env[key]} ${i < envKeys.length ? "&& " : ""}`
      )
      .join("")} docker-compose -f ${
      this._dockerComposePath
    } ${correctedDockerComposePaths.map((path) => ` -f ${path}`).join("")}`;
  }

  private _writeFileToCacheFromAbsPath(
    absPath: string,
    data: unknown,
    options?: fs.WriteFileOptions
  ) {
    this._config.project.writeCacheFile(
      path.relative(this._config.project.getCacheDir(), absPath),
      data,
      options
    );
  }

  private async _generateBaseDockerCompose(): Promise<void> {
    const { project } = this._config;
    const manifest = await project.getInfraManifest();
    const fileContent = YAML.dump(manifest.dockerCompose);

    this._writeFileToCacheFromAbsPath(this._dockerComposePath, fileContent);
  }

  // Compose package.json under .w3 folder and install deps
  private async _fetchRemoteModules(
    modules: NamedRemoteModule[],
    installationDir: string
  ): Promise<string[]> {
    const classifiedModules = modules.reduce((prev, current) => {
      const registry = current.registry as Registry;

      if (prev[registry]) {
        prev[registry].push(current);
      } else {
        prev[registry] = [current];
      }

      return prev;
    }, {} as Record<Registry, NamedRemoteModule[]>);

    const dockerComposePaths: string[] = [];

    for await (const [registry, modules] of Object.entries(classifiedModules)) {
      const dependencyFetcher = new dependencyFetcherClassMap[
        registry as Registry
      ]({
        project: this._config.project,
        installationDirectory: installationDir,
        name: registry,
      });

      const mappedInfraModules = modules.map((p) => ({
        name: p.package,
        versionOrPath: p.version,
      }));

      await dependencyFetcher.installPackages(mappedInfraModules);

      const paths = modules.map((m) => {
        const packageDir = dependencyFetcher.getPackageDir(m.package);
        return m.dockerComposePath
          ? path.join(packageDir, m.dockerComposePath)
          : this.tryResolveComposeFile(
              packageDir,
              this._defaultModuleComposePaths
            );
      });

      dockerComposePaths.push(...paths);
    }

    return dockerComposePaths;
  }

  private async _fetchModules(
    manifest: InfraManifest,
    modulesToUse?: string[]
  ): Promise<string[]> {
    const modules = this._getFilteredModules(manifest, modulesToUse);
    const remoteModules = modules.filter(
      (m): m is NamedRemoteModule => !this._isLocalModule(m)
    );
    const localModules = modules.filter((m): m is NamedLocalModule =>
      this._isLocalModule(m)
    );
    const installationDir = this._config.project.getInfraCacheModulesPath();

    const remoteComposePaths = await this._fetchRemoteModules(
      remoteModules,
      installationDir
    );
    const localComposePaths = await this._fetchLocalModules(
      localModules,
      installationDir
    );

    const composePaths = [...remoteComposePaths, ...localComposePaths];

    composePaths.forEach((composePath) => {
      // Adjust package's docker-compose's build option if it exists
      const composeFileWithCorrectPaths = correctBuildContextPathsFromCompose(
        composePath
      );

      // Write new docker-compose manifests with corrected build path and 'web3api' prefix
      const newComposeFile = YAML.dump(composeFileWithCorrectPaths);
      this._writeFileToCacheFromAbsPath(composePath, newComposeFile);
    });

    return composePaths;
  }

  private async _fetchLocalModules(
    modules: NamedLocalModule[],
    _: string
  ): Promise<string[]> {
    const dockerComposePaths: string[] = [];
    const basePath = path.join(
      this._config.project.getInfraCacheModulesPath(),
      "local"
    );

    for await (const module of modules) {
      const modulePath = path.join(basePath, module.name);

      await this._config.project.copyIntoCache(
        path.relative(this._config.project.getCacheDir(), modulePath),
        path.join(module.path, "*"),
        { up: true }
      );

      dockerComposePaths.push(
        this.tryResolveComposeFile(modulePath, this._defaultModuleComposePaths)
      );
    }

    return dockerComposePaths;
  }

  private _getFilteredModules(
    manifest: InfraManifest,
    packagesToUse?: string[]
  ): NamedModule[] {
    if (!packagesToUse || !packagesToUse.length) {
      return Object.entries(manifest.modules).map(([name, value]) => ({
        name,
        ...value,
      }));
    }

    return Object.entries(manifest.modules)
      .filter(([name]) => packagesToUse.includes(name))
      .map(([name, value]) => ({ name, ...value }));
  }

  private _isLocalModule(object: unknown): object is { path: string } {
    return Object.prototype.hasOwnProperty.call(object, "path");
  }

  private tryResolveComposeFile(
    moduleDir: string,
    pathsToTry: string[],
    triedPaths: string[] = []
  ): string {
    if (!pathsToTry.length) {
      throw new Error(
        `Could not resolve docker compose file. Tried paths: ${triedPaths}`
      );
    }

    const pathToTry = path.join(moduleDir, pathsToTry[0]);

    if (fs.existsSync(pathToTry)) {
      return pathToTry;
    }

    return this.tryResolveComposeFile(moduleDir, pathsToTry.slice(1), [
      ...triedPaths,
      pathToTry,
    ]);
  }
}
