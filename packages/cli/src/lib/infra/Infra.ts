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
  infraManifest: InfraManifest;
  modulesToUse?: string[];
  quiet?: boolean;
}

interface FetchedModulesData {
  baseCommand: string;
  modulesWithComposePaths: ModuleWithPath[];
}

interface ModuleWithPath {
  moduleName: string;
  path: string;
}

type Module = Exclude<InfraManifest["modules"], undefined>[number];
type NamedModule = Module & { name: string };
type NamedRemoteModule = Extract<NamedModule, { registry: string }>;
type NamedLocalModule = Extract<NamedModule, { path: string }>;
type Registry = keyof typeof dependencyFetcherClassMap;

const DEFAULT_BASE_COMPOSE = {
  version: "3",
};

export class Infra {
  private _baseDockerComposePath: string;
  private _fetchedModulesData: FetchedModulesData | undefined;
  private _defaultModuleComposePaths = [
    "./docker-compose.yml",
    "./docker-compose.yaml",
  ];
  private _config: InfraConfig;

  constructor(config: InfraConfig & { baseDockerComposePath?: string }) {
    this._config = config;

    if (config.baseDockerComposePath) {
      this._baseDockerComposePath = config.baseDockerComposePath;
    } else {
      // If user did not specify a base compose, generate a default one
      this._baseDockerComposePath = path.join(
        config.project.getInfraCacheModulesPath(),
        "docker-compose.yml"
      );

      this._generateDefaultBaseDockerCompose(this._baseDockerComposePath);
    }

    this._sanitizeModules();
  }

  public async up(): Promise<void> {
    const { quiet } = this._config;
    const { baseCommand } = await this._fetchModules();

    await runCommand(`${baseCommand} up -d --build`, quiet);
  }

  public async down(): Promise<void> {
    const { quiet } = this._config;
    const { baseCommand } = await this._fetchModules();

    await runCommand(`${baseCommand} down`, quiet);
  }

  public async config(): Promise<{
    stdout: string;
    stderr: string;
  }> {
    const { quiet } = this._config;
    const { baseCommand } = await this._fetchModules();

    return await runCommand(`${baseCommand} config`, quiet);
  }

  public async getVars(): Promise<string[]> {
    const { modulesWithComposePaths } = await this._fetchModules();

    const envVarRegex = /\${([^}]+)}/gm;

    const envVars = modulesWithComposePaths.reduce((acc, current) => {
      const rawManifest = fs.readFileSync(current.path, "utf-8");
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
  }

  public getFilteredModules(): NamedModule[] {
    const { modulesToUse, infraManifest } = this._config;

    if (!modulesToUse || !modulesToUse.length) {
      return Object.entries(infraManifest.modules).map(([name, value]) => ({
        name,
        ...value,
      }));
    }

    return Object.entries(infraManifest.modules)
      .filter(([name]) => modulesToUse.includes(name))
      .map(([name, value]) => ({ name, ...value }));
  }

  private _sanitizeModules(): void {
    const { modulesToUse, infraManifest } = this._config;

    if (modulesToUse) {
      const manifestModuleNames = Object.keys(infraManifest.modules);
      const unrecognizedModules: string[] = [];
      modulesToUse.forEach((p: string) => {
        if (!manifestModuleNames.includes(p)) {
          unrecognizedModules.push(p);
        }
      });

      console.log(unrecognizedModules);

      if (unrecognizedModules.length) {
        throw new Error(
          intlMsg.lib_infra_unrecognizedModule({
            modules: unrecognizedModules.join(", "),
          })
        );
      }
    }
  }

  private _generateBaseComposedCommand(
    modulesWithComposePaths: ModuleWithPath[]
  ): string {
    const { infraManifest } = this._config;
    const env = infraManifest.env || {};
    const envKeys = Object.keys(env);

    return `${envKeys
      .map(
        (key, i) =>
          `export ${key}=${env[key]} ${i < envKeys.length ? "&& " : ""}`
      )
      .join("")} docker-compose -f ${
      this._baseDockerComposePath
    } ${modulesWithComposePaths
      .map((module) => ` -f ${module.path}`)
      .join("")}`;
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

  private _generateDefaultBaseDockerCompose(composePath: string): void {
    const fileContent = YAML.dump(DEFAULT_BASE_COMPOSE);

    this._writeFileToCacheFromAbsPath(composePath, fileContent);
  }

  // Compose package.json under .w3 folder and install deps
  private async _fetchRemoteModules(
    modules: NamedRemoteModule[],
    installationDir: string
  ): Promise<ModuleWithPath[]> {
    const classifiedModules = modules.reduce((prev, current) => {
      const registry = current.registry as Registry;

      if (prev[registry]) {
        prev[registry].push(current);
      } else {
        prev[registry] = [current];
      }

      return prev;
    }, {} as Record<Registry, NamedRemoteModule[]>);

    const modulesWithComposePaths: ModuleWithPath[] = [];

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

      const modulesWithPaths = modules.map((m) => {
        const packageDir = dependencyFetcher.getPackageDir(m.package);
        const packagePath = m.dockerComposePath
          ? path.join(packageDir, m.dockerComposePath)
          : this.tryResolveComposeFile(
              packageDir,
              this._defaultModuleComposePaths
            );

        return { moduleName: m.name, path: packagePath };
      });

      modulesWithComposePaths.push(...modulesWithPaths);
    }

    return modulesWithComposePaths;
  }

  private async _fetchModules(): Promise<FetchedModulesData> {
    if (this._fetchedModulesData) {
      return this._fetchedModulesData;
    }

    const modules = await this.getFilteredModules();

    if (!modules.length) {
      throw new Error("No modules to fetch");
    }

    const remoteModules = modules.filter(
      (m): m is NamedRemoteModule => !this._isLocalModule(m)
    );
    const localModules = modules.filter((m): m is NamedLocalModule =>
      this._isLocalModule(m)
    );
    const installationDir = this._config.project.getInfraCacheModulesPath();

    const remoteModulesWithComposePaths = await this._fetchRemoteModules(
      remoteModules,
      installationDir
    );
    const localModulesWithComposePaths = await this._fetchLocalModules(
      localModules
    );

    const modulesWithComposePaths = [
      ...remoteModulesWithComposePaths,
      ...localModulesWithComposePaths,
    ];

    modulesWithComposePaths.forEach((m) => {
      // Adjust package's docker-compose's build option if it exists
      const composeFileWithCorrectPaths = correctBuildContextPathsFromCompose(
        m.path
      );

      // Write new docker-compose manifests with corrected build path and 'web3api' prefix
      const newComposeFile = YAML.dump(composeFileWithCorrectPaths);
      this._writeFileToCacheFromAbsPath(m.path, newComposeFile);
    });

    // generate base composed command
    const command = this._generateBaseComposedCommand(modulesWithComposePaths);

    this._fetchedModulesData = {
      baseCommand: command,
      modulesWithComposePaths,
    };

    return this._fetchedModulesData as FetchedModulesData;
  }

  private async _fetchLocalModules(
    modules: NamedLocalModule[]
  ): Promise<ModuleWithPath[]> {
    const modulesWithComposePaths: ModuleWithPath[] = [];
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

      const composePath = this.tryResolveComposeFile(
        modulePath,
        this._defaultModuleComposePaths
      );

      modulesWithComposePaths.push({
        moduleName: module.name,
        path: composePath,
      });
    }

    return modulesWithComposePaths;
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
