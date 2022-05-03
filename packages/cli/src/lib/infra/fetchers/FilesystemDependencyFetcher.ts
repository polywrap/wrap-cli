import {
  InfraDependencyFetcher,
  InfraPackageArg,
} from "../InfraDependencyFetcher";

import path from "path";

export class FilesystemDependencyFetcher extends InfraDependencyFetcher {
  getPackageDir(packageName: string): string {
    return path.join(this.config.installationDirectory, packageName);
  }
  public async installPackages(packages: InfraPackageArg[]): Promise<void> {
    for await (const p of packages) {
      await this.config.project.copyIntoCache(
        path.join(this.config.installationDirectory, p.name),
        path.join(p.versionOrPath, "*")
      );
    }
  }
}
