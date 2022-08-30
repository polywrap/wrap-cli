export interface IFileReader {
  getFile(filePath: string): Promise<Uint8Array | undefined>;
}
