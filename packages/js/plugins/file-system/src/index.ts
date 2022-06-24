import {
  Client,
  Module,
  manifest,
  Input_readFile,
  Input_readFileAsString,
  Input_exists,
  Input_writeFile,
  Input_mkdir,
  Input_rm,
  Input_rmdir,
} from "./wrap";
import fileSystemEncodingToBufferEncoding from "./utils/fileSystemEncodingToBufferEncoding";

import fs from "fs";
import { PluginFactory } from "@polywrap/core-js";

type NoConfig = Record<string, never>;

export class FileSystemPlugin extends Module<NoConfig> {
  async readFile(input: Input_readFile, _client: Client): Promise<ArrayBuffer> {
    return fs.promises.readFile(input.path);
  }

  async readFileAsString(
    input: Input_readFileAsString,
    _client: Client
  ): Promise<string> {
    return fs.promises.readFile(input.path, {
      encoding: fileSystemEncodingToBufferEncoding(input.encoding),
    });
  }

  async exists(input: Input_exists, _client: Client): Promise<boolean> {
    return fs.existsSync(input.path);
  }

  async writeFile(
    input: Input_writeFile,
    _client: Client
  ): Promise<boolean | null> {
    await fs.promises.writeFile(input.path, Buffer.from(input.data));

    return true;
  }

  async mkdir(input: Input_mkdir, _client: Client): Promise<boolean | null> {
    await fs.promises.mkdir(input.path, {
      recursive: input.recursive ?? false,
    });

    return true;
  }

  async rm(input: Input_rm, _client: Client): Promise<boolean | null> {
    await fs.promises.rm(input.path, {
      recursive: input.recursive ?? false,
      force: input.force ?? false,
    });

    return true;
  }

  async rmdir(input: Input_rmdir, _client: Client): Promise<boolean | null> {
    await fs.promises.rmdir(input.path);

    return true;
  }
}
export const fileSystemPlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new FileSystemPlugin({}),
    manifest,
  };
};

export const plugin = fileSystemPlugin;
