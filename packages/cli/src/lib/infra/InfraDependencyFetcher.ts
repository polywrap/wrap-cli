import { CacheDirectory } from "../CacheDirectory";
import { Logger } from "../logging";

import path from "path";

export interface InfraPackageArg {
  name: string;
  versionOrPath: string;
}

export interface InfraDependencyFetcherConfig {
  cache: CacheDirectory;
  logger: Logger;
  installationDirectory: string;
  name: string;
}

export abstract class InfraDependencyFetcher {
  constructor(protected config: InfraDependencyFetcherConfig) {
    this.config.installationDirectory = path.join(
      config.installationDirectory,
      config.name
    );
  }

  abstract installPackages(packages: InfraPackageArg[]): Promise<void>;
  abstract getPackageDir(packageName: string): string;
}
