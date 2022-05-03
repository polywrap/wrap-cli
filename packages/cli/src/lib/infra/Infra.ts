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

type Package = Exclude<InfraManifest["packages"], undefined>[number];
type NamedPackage = Package & { name: string };
type Registry = keyof typeof dependencyFetcherClassMap;

export class Infra {
  private _dockerComposePath: string;
  private _initData: InitData | undefined;

  constructor(private _config: InfraConfig) {
    this._dockerComposePath = path.join(
      _config.project.getCachePath("infra"),
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

    const cacheDir = project.getCachePath("infra");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Get the infra manifest
    const manifest = await project.getInfraManifest();

    // Check for unrecognized infra packages
    this._sanitizePackages(manifest, packagesToUse);

    // Install infra packages
    await this._installPackages(project, manifest, packagesToUse);

    // generate base docker compose
    await this._generateBaseDockerCompose();

    // generate base composed command

    const packagePaths = await this.getCorrectedDockerComposePaths();
    const command = await this._generateBaseComposedCommand(packagePaths);

    this._initData = {
      baseCommand: command,
      correctedDockerComposePaths: packagePaths,
    };
  }

  private _sanitizePackages(
    manifest: InfraManifest,
    packagesToUse?: string[]
  ): void {
    if (manifest.packages && packagesToUse) {
      const manifestPackageNames = Object.keys(manifest.packages);
      const unrecognizedPackages: string[] = [];
      packagesToUse.forEach((p: string) => {
        if (!manifestPackageNames.includes(p)) {
          unrecognizedPackages.push(p);
        }
      });

      if (unrecognizedPackages.length) {
        throw new Error(
          intlMsg.lib_infra_unrecognizedPackage({
            packages: unrecognizedPackages.join(", "),
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

  private async _generateBaseDockerCompose(): Promise<void> {
    const { project } = this._config;
    const manifest = await project.getInfraManifest();
    const fileContent = YAML.dump(manifest.dockerCompose);

    fs.writeFileSync(this._dockerComposePath, fileContent);
  }

  private async getCorrectedDockerComposePaths(): Promise<string[]> {
    const { project, packagesToUse } = this._config;
    const manifest = await project.getInfraManifest();

    const packages = this._getFilteredPackages(manifest, packagesToUse);

    const defaultPath = "./docker-compose.web3api.yml";

    return packages.map((p) => {
      const dockerComposePath =
        this._isLocalPackage(p) || !p.dockerComposePath
          ? defaultPath
          : path.join(p.dockerComposePath, "..", defaultPath);

      return path.join(
        project.getCachePath("infra"),
        "node_modules",
        p.name,
        dockerComposePath
      );
    });
  }

  // Compose package.json under .w3 folder and install deps
  private async _installPackages(
    project: Web3ApiProject,
    manifest: InfraManifest,
    packagesToUse?: string[]
  ): Promise<void> {
    // Get full list of packages needed
    const packages = this._getFilteredPackages(manifest, packagesToUse);

    if (!packages || !packages.length) {
      return;
    }

    const classifiedPackages = packages.reduce((prev, current) => {
      const registry = this._isLocalPackage(current)
        ? "file"
        : (current.registry as Registry);

      if (prev[registry]) {
        prev[registry].push(current);
      } else {
        prev[registry] = [current];
      }

      return prev;
    }, {} as Record<Registry, NamedPackage[]>);

    for await (const [registry, packages] of Object.entries(
      classifiedPackages
    )) {
      const dependencyFetcher = new dependencyFetcherClassMap[
        registry as Registry
      ]({
        project,
        installationDirectory: project.getCachePath("infra"),
      });

      const mappedInfraPackages = packages.map((p) => {
        if (this._isLocalPackage(p)) {
          return {
            name: p.name,
            versionOrPath: p.path,
          };
        }

        return {
          name: p.package,
          versionOrPath: p.version,
        };
      });

      await dependencyFetcher.installPackages(mappedInfraPackages);

      packages.forEach((p) => {
        const defaultPath = "./docker-compose.yml";

        const packageDir = path.join(
          dependencyFetcher.getPackageDir(p.name),
          this._isLocalPackage(p) || !p.dockerComposePath
            ? defaultPath
            : p.dockerComposePath
        );

        // Adjust package's docker-compose's build option if it exists

        if (!fs.existsSync(packageDir)) {
          throw new Error(
            `Couldn't find docker-compose.yml file for package "${p.name}" at path '${packageDir}'`
          );
        }

        const composeFileWithCorrectPaths = correctBuildContextPathsFromCompose(
          packageDir
        );

        // Write new docker-compose manifests with corrected build path and 'web3api' prefix
        const newComposeFile = YAML.dump(composeFileWithCorrectPaths);
        const correctedFilePath = path.join(
          packageDir,
          "..",
          "docker-compose.web3api.yml"
        );
        fs.writeFileSync(correctedFilePath, newComposeFile);
      });
    }
  }

  private _getFilteredPackages(
    manifest: InfraManifest,
    packagesToUse?: string[]
  ): NamedPackage[] {
    if (!packagesToUse || !packagesToUse.length) {
      return Object.entries(manifest.packages).map(([name, value]) => ({
        name,
        ...value,
      }));
    }

    return Object.entries(manifest.packages)
      .filter(([name]) => packagesToUse.includes(name))
      .map(([name, value]) => ({ name, ...value }));
  }

  private _isLocalPackage(object: unknown): object is { path: string } {
    return Object.prototype.hasOwnProperty.call(object, "path");
  }
}
