import { Result } from "@polywrap/result";

export interface IFileReader {
  readFile(filePath: string): Promise<Result<Uint8Array, Error>>;
}
