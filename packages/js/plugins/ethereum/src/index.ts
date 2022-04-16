// TIP: All user-defined code lives in the module folders (./query, ./mutation)

import * as Internal from "./w3-man";
import { EthereumConfig } from "./common/EthereumConfig";

import { PluginFactory } from "@web3api/core-js";

export {
  manifest,
  schema,
} from "./w3-man";

export interface EthereumPluginConfigs extends EthereumConfig { }

export class EthereumPlugin extends Internal.EthereumPlugin {
  constructor(
    config: EthereumPluginConfigs
  ) {
    super({
      query: config,
      mutation: config,
    });
  }
}

export const ethereumPlugin: PluginFactory<EthereumPluginConfigs> = (
  opts: EthereumPluginConfigs
) => Internal.ethereumPlugin({
  query: opts,
  mutation: opts,
});

export const plugin = ethereumPlugin;
