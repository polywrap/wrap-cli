import { Web3ApiClientConfig } from "@web3api/client-js";
import { Plugin, PluginModule, PluginModules } from "@web3api/core-js";

interface Config extends Record<string, unknown> {
  val: number;
}

class Query extends PluginModule<Config> {
  getData(_: unknown): number { return this.config.val; }
}

class Mutation extends PluginModule<Config> {
  setData(input: { options: { value: number } }) {
    this.config.val = +input.options.value;
    return { txReceipt: "0xdone", value: this.config.val };
  }

  deployContract(): string { return "0x100"; }
}

class MockPlugin implements Plugin {
  private _config: Config = {
    val: 0,
  };

  getModules(): PluginModules {
    return {
      query: new Query(this._config),
      mutation: new Mutation(this._config),
    };
  }
}

const mockPlugin = () => {
  return {
    factory: () => new MockPlugin(),
    manifest: {
      schema: ``,
      implements: [],
    },
  };
};

export function getClientConfig(defaultConfigs: Partial<Web3ApiClientConfig>) {
  if (defaultConfigs.plugins) {
    defaultConfigs.plugins.push({
      uri: "w3://ens/mock.eth",
      plugin: mockPlugin(),
    });
  } else {
    defaultConfigs.plugins = [
      {
        uri: "w3://ens/mock.eth",
        plugin: mockPlugin(),
      },
    ];
  }
  defaultConfigs.redirects = [
    {
      from: "w3://ens/testnet/simplestorage.eth",
      to: "w3://ens/mock.eth",
    },
  ];
  return defaultConfigs;
}
