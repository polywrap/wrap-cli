import {
  Client,
  Module,
  Input_readFile,
  Input_readFileAsString,
  Input_exists,
} from "./w3";

import fs from "fs";

export type QueryConfig = Record<string, unknown>;

export class Query extends Module<QueryConfig> {
  async readFile(input: Input_readFile, _client: Client): Promise<ArrayBuffer> {
    return fs.promises.readFile(input.path);
  }

  async readFileAsString(
    input: Input_readFileAsString,
    _client: Client
  ): Promise<string> {
    // TODO: Maybe check if input.encoding is within supported encodings?

    return fs.promises.readFile(input.path, {
      encoding: input.encoding as BufferEncoding,
    });
  }

  async exists(input: Input_exists, _client: Client): Promise<boolean> {
    return fs.existsSync(input.path);
  }
}
