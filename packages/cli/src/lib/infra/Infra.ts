import { Web3ApiProject } from "../project";
import { intlMsg } from "../intl";
import { dependencyFetcherClassMap } from "./fetchers";
import { correctBuildContextPathsFromCompose } from "../helpers/docker";
import { DockerCompose } from "./dockerCompose";

import { InfraManifest } from "@web3api/core-js";
import path from "path";
import fs, { readdirSync } from "fs";
import YAML from "js-yaml";

export interface InfraConfig {
  project: Web3ApiProject;
  defaultInfraModulesPath: string;
  infraManifest?: InfraManifest;
  modulesToUse?: string[];
  quiet?: boolean;
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
  private _fetchedModulesData: ModuleWithPath[] | undefined;
  private _defaultModuleComposePaths = [
    "./docker-compose.yml",
    "./docker-compose.yaml",
  ];

  private _config: InfraConfig;
  private _dockerCompose = new DockerCompose();
  private _defaultDockerOptions: ReturnType<
    typeof DockerCompose.getDefaultConfig
  >;

  constructor(config: InfraConfig) {
    this._config = config;

    // If user did not specify a base compose, generate a default one
    this._baseDockerComposePath = path.join(
      config.project.getInfraCacheModulesPath(),
      "base-docker-compose.yml"
    );

    this._generateBaseDockerCompose(this._baseDockerComposePath);

    this._defaultDockerOptions = DockerCompose.getDefaultConfig(
      this._baseDockerComposePath,
      this._config.quiet ?? true,
      this._config.infraManifest
    );
  }

  public async up(): Promise<void> {
    const modulesWithPaths = await this._fetchModules();

    await this._dockerCompose.commands.upAll({
      ...this._defaultDockerOptions,
      config: modulesWithPaths.map((m) => m.path),
      commandOptions: ["--build"],
    });
  }

  public async down(): Promise<void> {
    const modulesWithPaths = await this._fetchModules();

    await this._dockerCompose.commands.down({
      ...this._defaultDockerOptions,
      config: modulesWithPaths.map((m) => m.path),
      commandOptions: ["--remove-orphans"],
    });
  }

  public async config(): Promise<
    ReturnType<DockerCompose["commands"]["config"]>
  > {
    const modulesWithPaths = await this._fetchModules();

    const s = await this._dockerCompose.commands.config({
      ...this._defaultDockerOptions,
      config: modulesWithPaths.map((m) => m.path),
    });

    return s;
  }

  public async getVars(): Promise<string[]> {
    const modulesWithComposePaths = await this._fetchModules();

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
    const {
      modulesToUse,
      defaultInfraModulesPath,
      infraManifest,
    } = this._config;

    const manifestModules = Object.entries(infraManifest?.modules ?? {}).map(
      ([name, value]) => ({
        name,
        ...value,
      })
    );

    if (!modulesToUse || !modulesToUse.length) {
      return manifestModules;
    }

    const modulesInManifestNames = manifestModules.map((m) => m.name);

    const defaultInfraModules = readdirSync(defaultInfraModulesPath).map(
      (moduleName) => ({
        name: moduleName,
        path: path.join(defaultInfraModulesPath, moduleName),
      })
    );

    const manifestAndDefaultModules = defaultInfraModules.reduce(
      (prev, current) => {
        // If a module in the manifest has the same name as a default one,
        // the manifest one takes precedence
        if (!modulesInManifestNames.includes(current.name)) {
          return [...prev, current];
        }

        return prev;
      },
      manifestModules
    );

    const manifestAndDefaultModulesNames = manifestAndDefaultModules.map(
      (m) => m.name
    );

    const unrecognizedModules = modulesToUse.reduce((prev, current) => {
      if (!manifestAndDefaultModulesNames.includes(current)) {
        return [...prev, current];
      }

      return prev;
    }, []);

    if (unrecognizedModules.length) {
      throw new Error(
        intlMsg.lib_infra_unrecognizedModule({
          modules: unrecognizedModules.join(", "),
          defaultModules: defaultInfraModules.map((m) => m.name).join(", "),
        })
      );
    }

    return manifestAndDefaultModules.filter((m) =>
      modulesToUse.includes(m.name)
    );
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

  private _generateBaseDockerCompose(composePath: string): void {
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

  private async _fetchModules(): Promise<ModuleWithPath[]> {
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

    return modulesWithComposePaths;
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
