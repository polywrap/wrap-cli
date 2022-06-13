import {
  Client,
  Input_mkdir,
  Input_rm,
  Input_rmdir,
  Input_writeFile,
  Module,
} from "./w3";

import fs from "fs";

export type MutationConfig = Record<string, unknown>;

export class Mutation extends Module<MutationConfig> {
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
