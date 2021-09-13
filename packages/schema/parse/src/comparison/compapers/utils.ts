export type ImportDefinition = { type: string };

export enum VersionRelease {
  PATCH,
  MINOR,
  MAJOR,
}

export interface CompareOptions {
  shortCircuit?: VersionRelease;
}

export interface CompareResult {
  versionRelease: VersionRelease;
  hasShortCircuit: boolean;
}
