import { Web3ApiProject } from "../project";

export interface InfraPackageArg {
  name: string;
  versionOrPath: string;
}

export interface InfraDependencyFetcherConfig {
  project: Web3ApiProject;
  installationDirectory: string;
}

export abstract class InfraDependencyFetcher {
  constructor(protected config: InfraDependencyFetcherConfig) {}

  abstract installPackages(packages: InfraPackageArg[]): Promise<void>;
  abstract getPackageDir(packageName: string): string;
}
