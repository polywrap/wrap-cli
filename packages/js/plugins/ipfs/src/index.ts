// TIP: All user-defined code lives in the module folders (./query, ./mutation)

import * as Internal from "./w3-man";
import { IpfsConfig } from "./common/IpfsConfig";

import { PluginFactory } from "@web3api/core-js";

export {
  manifest,
  schema,
} from "./w3-man";

export interface IpfsPluginConfigs extends IpfsConfig { }

export class IpfsPlugin extends Internal.IpfsPlugin {
  constructor(
    config: IpfsPluginConfigs
  ) {
    super({
      query: config,
      mutation: config,
    });
  }
}

export const ipfsPlugin: PluginFactory<IpfsPluginConfigs> = (
  opts: IpfsPluginConfigs
) => Internal.ipfsPlugin({
  query: opts,
  mutation: opts,
});

export const plugin = ipfsPlugin;
