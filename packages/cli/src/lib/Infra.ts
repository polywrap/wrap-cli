import { Web3ApiProject } from "./project";
import {
  correctBuildContextPathsFromCompose,
} from "./helpers";
import { runCommand } from "./helpers/command";

import { InfraManifest } from "@web3api/core-js";
import path from "path";
import fs from "fs";
import YAML from "js-yaml";

export interface InfraConfig {
  project: Web3ApiProject;
  packagesToUse: string[];
  quiet?: boolean;
}

const BASE_PACKAGE_JSON = {
  name: "@web3api/w3-infra",
  version: "1.0.0",
  private: true,
  dependencies: {},
};

type Package = Exclude<InfraManifest["packages"], undefined>[number];

export class Infra {
  private _packagesInstalled = false;

  constructor(private _config: InfraConfig) {}

  public  async getFilteredPackages(): Promise<Package[]> {
    const manifest = await this._getManifest();

    if (!manifest.packages) {
      return [];
    }

    if (!this._config.packagesToUse || !this._config.packagesToUse.length) {
      return manifest.packages;
    }

    return manifest.packages.filter((p) =>
      this._config.packagesToUse.includes(p.name)
    );
  };

  public async installPackages(): Promise<void> {
    // Compose package.json under .w3 folder and install deps

    const { project } = this._config;

    if (!fs.existsSync(project.getCachePath("infra/packages"))) {
      fs.mkdirSync(project.getCachePath("infra/packages"), { recursive: true });
    }

    const packages = await this.getFilteredPackages();

    if (!packages || !packages.length) {
      return;
    }

    const packageJSON = {
      ...BASE_PACKAGE_JSON,
      dependencies: packages.reduce((acc, current) => {
        acc[current.package] = current.version;
        return acc;
      }, {} as Record<string, string>),
    };

    fs.writeFileSync(
      path.join(project.getCachePath("infra"), "package.json"),
      JSON.stringify(packageJSON)
    );

    await runCommand(`cd ${project.getCachePath("infra")} && npm i`);

    packages.forEach((p) => {
      const defaultPath = "./docker-compose.yml";

      const packageDir = path.join(
        project.getCachePath("infra"),
        "node_modules",
        p.package,
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

      //Write new docker-compose manifests with corrected build path and 'web3api' prefix
      const newComposeFile = YAML.dump(composeFileWithCorrectPaths);
      const correctedFilePath = path.join(
        packageDir,
        "..",
        "docker-compose.web3api.yml"
      );
      fs.writeFileSync(correctedFilePath, newComposeFile);
    });

    this._packagesInstalled = true;
  }

  public async generateBaseDockerCompose(): Promise<void> {
    const { project } = this._config;
    const manifest = await this._getManifest();
    const fileContent = YAML.dump(manifest.dockerCompose);

    fs.writeFileSync(
      path.join(project.getCachePath("infra"), "docker-compose.yml"),
      fileContent
    );
  }

  public async getCorrectedDockerComposePaths(): Promise<string[]> {
    const { project } = this._config;
    const manifest = await this._getManifest();

    if (manifest.packages && !this._packagesInstalled) {
      throw new Error("Infra packages have not been installed");
    }

    const packages = await this.getFilteredPackages();

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

  public async generateBaseComposedCommand(): Promise<string> {
    const { project } = this._config;
    const baseComposePath = path.join(
      project.getCachePath("infra"),
      "docker-compose.yml"
    );
    const manifest = await this._getManifest();
    const env = manifest.env || {};
    const packagePaths = await this.getCorrectedDockerComposePaths();
    const envKeys = Object.keys(env);

    return `${envKeys
      .map(
        (key, i) =>
          `export ${key}=${env[key]} ${i < envKeys.length ? "&& " : ""}`
      )
      .join("")} docker-compose -f ${baseComposePath} ${packagePaths
      .map((path) => ` -f ${path}`)
      .join("")}`;
  }

  private async _getManifest(): Promise<InfraManifest> {
    const manifest = await this._config.project.getInfraManifest();

    if (!manifest.packages && !manifest.dockerCompose) {
      throw new Error(
        `At least one is required in infra manifest: "dockerCompose", "packages"`
      );
    }

    return manifest;
  }
}
