import { runCommand } from "../../system";
import {
  InfraDependencyFetcher,
  InfraPackageArg,
} from "../InfraDependencyFetcher";

import path from "path";
import fs from "fs";

export class NodeDependencyFetcher extends InfraDependencyFetcher {
  public async installPackages(packages: InfraPackageArg[]): Promise<void> {
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

  protected composePackageJson(packages: InfraPackageArg[]): void {
    const packageJson = {
      name: "web3api-infra",
      version: "1.0.0",
      private: true,
      dependencies: packages.reduce((acc, current) => {
        acc[current.name] = current.versionOrPath;
        return acc;
      }, {} as Record<string, string>),
    };

    if (!fs.existsSync(this.config.installationDirectory)) {
      fs.mkdirSync(this.config.installationDirectory, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.config.installationDirectory, "package.json"),
      JSON.stringify(packageJson)
    );
  }
}

export class YarnDependencyFetcher extends NodeDependencyFetcher {
  public async installPackages(packages: InfraPackageArg[]): Promise<void> {
    this.composePackageJson(packages);
    await runCommand(`cd ${this.config.installationDirectory} && yarn`);
  }
}
