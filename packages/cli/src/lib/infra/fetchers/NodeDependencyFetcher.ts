import { runCommand } from "../../system";
import {
  InfraDependencyFetcher,
  InfraPackageArg,
} from "../InfraDependencyFetcher";

import path from "path";

export class NodeDependencyFetcher extends InfraDependencyFetcher {
  public async installPackages(packages: InfraPackageArg[]): Promise<void> {
    this.composePackageJson(packages);
    await runCommand(
      "npm", ["i"],
      this.config.logger,
      undefined,
      this.config.installationDirectory
    );
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
      name: "polywrap-infra",
      version: "1.0.0",
      private: true,
      dependencies: packages.reduce((acc, current) => {
        acc[current.name] = current.versionOrPath;
        return acc;
      }, {} as Record<string, string>),
    };

    this.config.cache.writeCacheFile(
      path.relative(
        this.config.cache.getCacheDir(),
        path.join(this.config.installationDirectory, "package.json")
      ),
      JSON.stringify(packageJson)
    );
  }
}

export class YarnDependencyFetcher extends NodeDependencyFetcher {
  public async installPackages(packages: InfraPackageArg[]): Promise<void> {
    this.composePackageJson(packages);
    await runCommand(
      "yarn",
      [],
      this.config.logger,
      undefined,
      this.config.installationDirectory
    );
  }
}
