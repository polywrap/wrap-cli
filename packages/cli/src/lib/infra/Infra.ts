import {
  intlMsg,
  dependencyFetcherClassMap,
  correctBuildContextPathsFromCompose,
  ensureDockerDaemonRunning,
  DockerCompose,
  CacheDirectory,
  Logger,
} from "../";

import { InfraManifest } from "@polywrap/polywrap-manifest-types-js";
import path from "path";
import fs, { lstatSync, readdirSync } from "fs";
import YAML from "yaml";
import { copySync } from "fs-extra";

export interface InfraConfig {
  rootDir: string;
  defaultInfraModulesPath: string;
  logger: Logger;
  infraManifest?: InfraManifest;
  modulesToUse?: string[];
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
  private _cache: CacheDirectory;
  private _baseDockerComposePath: string;
  private _fetchedModulesData: ModuleWithPath[] | undefined;
  private _defaultModuleComposePaths = [
    "./docker-compose.yml",
    "./docker-compose.yaml",
  ];

  private _dockerCompose = new DockerCompose(this._config.logger);
  private _defaultDockerOptions: ReturnType<
    typeof DockerCompose.getDefaultConfig
  >;

  public static cacheLayout = {
    root: "infra/",
    modulesDir: "modules",
  };

  constructor(protected _config: InfraConfig) {
    this._cache = new CacheDirectory({
      rootDir: _config.rootDir,
      subDir: Infra.cacheLayout.root,
    });

    // If user did not specify a base compose, generate a default one
    this._baseDockerComposePath = path.join(
      this.getCacheModulesPath(),
      "base-docker-compose.yml"
    );

    this._generateBaseDockerCompose(this._baseDockerComposePath);

    this._defaultDockerOptions = DockerCompose.getDefaultConfig(
      this._baseDockerComposePath,
      this._config.logger,
      this._config.infraManifest
    );
  }

  public async up(): Promise<void> {
    await ensureDockerDaemonRunning(this._config.logger);

    const modulesWithPaths = await this._fetchModules();

    await this._dockerCompose.commands.upAll({
      ...this._defaultDockerOptions,
      config: modulesWithPaths.map((m) => m.path),
      commandOptions: ["--build"],
    });
  }

  public async down(): Promise<void> {
    await ensureDockerDaemonRunning(this._config.logger);

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

    return await this._dockerCompose.commands.config({
      ...this._defaultDockerOptions,
      config: modulesWithPaths.map((m) => m.path),
    });
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

  public getCacheModulesPath(): string {
    return this._cache.getCachePath(Infra.cacheLayout.modulesDir);
  }

  public getFilteredModules(): NamedModule[] {
    const {
      modulesToUse,
      defaultInfraModulesPath,
      infraManifest,
    } = this._config;

    const manifestModules: NamedModule[] = Object.entries(
      infraManifest?.modules ?? {}
    ).map(([name, value]) => {
      if (value === "default") {
        return {
          name,
          path: this._fetchPathForDefaultModule(name),
        };
      }
      return {
        name,
        ...value,
      };
    });

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
    this._cache.writeCacheFile(
      path.relative(this._cache.getCacheDir(), absPath),
      data,
      options
    );
  }

  private _generateBaseDockerCompose(composePath: string): void {
    const fileContent = YAML.stringify(DEFAULT_BASE_COMPOSE, null, 2);

    this._writeFileToCacheFromAbsPath(composePath, fileContent);
  }

  // Compose package.json under .polywrap folder and install deps
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
        cache: this._cache,
        installationDirectory: installationDir,
        name: registry,
        logger: this._config.logger,
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
          : this._tryResolveComposeFile(
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

    const modules = this.getFilteredModules();

    if (!modules.length) {
      throw new Error("No modules to fetch");
    }

    const remoteModules = modules.filter(
      (m): m is NamedRemoteModule => !this._isLocalModule(m)
    );
    const localModules = modules.filter((m): m is NamedLocalModule =>
      this._isLocalModule(m)
    );
    const installationDir = this.getCacheModulesPath();

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

      // Write new docker-compose manifests with corrected build path and 'polywrap' prefix
      const newComposeFile = YAML.stringify(
        composeFileWithCorrectPaths,
        null,
        2
      );
      this._writeFileToCacheFromAbsPath(m.path, newComposeFile);
    });

    return modulesWithComposePaths;
  }

  private async _fetchLocalModules(
    modules: NamedLocalModule[]
  ): Promise<ModuleWithPath[]> {
    const modulesWithComposePaths: ModuleWithPath[] = [];
    const basePath = path.join(this.getCacheModulesPath(), "local");

    for (const module of modules) {
      const isFile = lstatSync(module.path).isFile();
      const modulePath = path.join(
        basePath,
        isFile ? module.path : module.name
      );
      copySync(module.path, modulePath);
      const composePath = this._tryResolveComposeFile(
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

  private _fetchPathForDefaultModule(module: string): string {
    const defaultModules = readdirSync(this._config.defaultInfraModulesPath);
    const defaultModulePath = defaultModules.find(
      (defaultModules) => defaultModules === module
    );
    if (!defaultModulePath) {
      throw new Error(
        `Module ${module} not found as default\nDefault Modules available: ${defaultModules
          .map((m) => `\n- ${m}`)
          .join("")}`
      );
    }
    return path.join(this._config.defaultInfraModulesPath, defaultModulePath);
  }

  private _tryResolveComposeFile(
    moduleDir: string,
    pathsToTry: string[],
    triedPaths: string[] = []
  ): string {
    if (!pathsToTry.length) {
      throw new Error(
        `Could not resolve docker compose file. Tried paths: ${triedPaths}`
      );
    }

    const pathToTry = lstatSync(moduleDir).isFile()
      ? moduleDir
      : path.join(moduleDir, pathsToTry[0]);

    if (fs.existsSync(pathToTry)) {
      return pathToTry;
    }

    return this._tryResolveComposeFile(moduleDir, pathsToTry.slice(1), [
      ...triedPaths,
      pathToTry,
    ]);
  }
}
