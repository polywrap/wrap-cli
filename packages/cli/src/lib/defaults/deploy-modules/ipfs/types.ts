export interface FileEntry {
  name: string;
  data: Uint8Array;
}

export interface DirectoryEntry {
  name: string;
  directories?: DirectoryEntry[];
  files?: FileEntry[];
}

export interface AddOptions {
  pin?: boolean;
  onlyHash?: boolean;
  wrapWithDirectory?: boolean;
}

export interface AddResult {
  name: string;
  hash: string;
  size: string;
}

export interface ArgsAddDir {
  data: DirectoryEntry;
  ipfsProvider: string;
  timeout?: number;
  addOptions?: AddOptions;
}
