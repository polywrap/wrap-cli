import { Web3ApiProject } from "./project";
import { runCommand } from "./system";

import path from "path";

interface Package {
  package: string;
  versionOrPath: string;
}

interface Config {
  project: Web3ApiProject;
  installationDirectory: string;
}

abstract class InfraPackageManager {
  constructor(protected config: Config) {}

  abstract installPackages(packages: Package[]): Promise<void>;
  abstract getPackageDir(packageName: string): string;
}

export class NodePackageManager extends InfraPackageManager {
  constructor(protected config: Config) {
    super(config);
  }

  public async installPackages(packages: Package[]): Promise<void> {
    this.composePackageJson(packages);
    await runCommand(`cd ${this.config.installationDirectory} && npm i`);
  }

  public getPackageDir(packageName: string): string {
    return path.join(
      this.config.installationDirectory,
      "node_modules",
      packageName
    );
  }

  protected composePackageJson(packages: Package[]): void {
    const packageJson = {
      name: "web3api-infra",
      version: "1.0.0",
      private: true,
      dependencies: packages.reduce((acc, current) => {
        acc[current.package] = current.versionOrPath;
        return acc;
      }, {} as Record<string, string>),
    };

    this.config.project.writeFileIntoCache(
      this.config.installationDirectory,
      JSON.stringify(packageJson)
    );
  }
}

export class YarnPackageManager extends NodePackageManager {
  public async installPackages(packages: Package[]): Promise<void> {
    this.composePackageJson(packages);
    await runCommand(`cd ${this.config.installationDirectory} && yarn`);
  }
}

export const packageManagerClassMap = {
  npm: NodePackageManager,
  yarn: YarnPackageManager,
};
