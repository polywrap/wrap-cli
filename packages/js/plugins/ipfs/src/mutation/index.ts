import { Module, Input_addFile } from "./w3";
import { IpfsConfig } from "../common/IpfsConfig";
import { IpfsClient } from "../common/IpfsClient";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

export interface MutationConfig extends IpfsConfig, Record<string, unknown> {}

export class Mutation extends Module<MutationConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _ipfs: IpfsClient;

  constructor(config: MutationConfig) {
    super(config);
    this._ipfs = createIpfsClient(this.config.provider);
  }

  public async addFile(input: Input_addFile): Promise<string> {
    const result = await this._ipfs.add(new Uint8Array(input.data));

    if (result.length === 0) {
      throw Error(
        `IpfsPlugin:add failed to add contents. Result of length 0 returned.`
      );
    }

    return result[0].hash.toString();
  }
}
