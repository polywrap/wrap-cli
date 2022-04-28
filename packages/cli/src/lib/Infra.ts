import { Web3ApiProject } from "./project";
import { correctBuildContextPathsFromCompose } from "./helpers";
import { intlMsg } from "./intl";
import { runCommand } from "./helpers/command";
import { NodePackageManager } from "./InfraPackageManager";

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

    return await runCommand(`${baseCommand} up -d --build`, quiet);
    // run docker command up -d --build
    // getCorrectedDockerComposePaths
    // print vars?
    //
  }

  public async down(): Promise<void> {
    const { quiet } = this._config;
    const { baseCommand } = await this.getInitData();

    return await runCommand(`${baseCommand} down`, quiet);
  }

  public async config(): Promise<void> {
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
      const manifestPackageNames = manifest.packages.map((p) => p.name);
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

    if (manifest.packages && !this._initData) {
      throw new Error("Infra packages have not been installed");
    }

    const packages = this._getFilteredPackages(manifest, packagesToUse);

    const defaultPath = "./docker-compose.web3api.yml";

    return packages.map((p) => {
      const dockerComposePath = p.dockerComposePath
        ? path.join(p.dockerComposePath, "..", defaultPath)
        : defaultPath;

      return path.join(
        project.getCachePath("infra"),
        "node_modules",
        p.package,
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

    const packageManager = new NodePackageManager({
      project,
      installationDirectory: project.getCachePath("infra"),
    });

    await packageManager.installPackages(packages);

    packages.forEach((p) => {
      const defaultPath = "./docker-compose.yml";

      const packageDir = path.join(
        packageManager.getPackageDir(p.package),
        p.dockerComposePath || defaultPath
      );

      // Adjust package's docker-compose's build option if it exists

      if (!fs.existsSync(packageDir)) {
        throw new Error(
          `Couldn't find docker-compose.yml file for package "${p.package}" at path '${packageDir}'`
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

  private _getFilteredPackages(
    manifest: InfraManifest,
    packagesToUse?: string[]
  ): Package[] {
    if (!manifest.packages) {
      return [];
    }

    if (!packagesToUse || !packagesToUse.length) {
      return manifest.packages;
    }

    return manifest.packages.filter((p) => packagesToUse.includes(p.name));
  }
}
