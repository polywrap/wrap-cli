export interface IFileReader {
  readFile(filePath: string): Promise<Uint8Array | undefined>;
}
