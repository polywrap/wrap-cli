import { Web3ApiClientConfig } from "@web3api/client-js";
import { Plugin, Client, PluginModules } from "@web3api/core-js";

const mockPlugin = () => {
  class MockPlugin extends Plugin {
    private _val: number = 0;
    getModules(_client: Client): PluginModules {
      return {
        query: {
          getData: async (_: unknown) => this._val,
        },
        mutation: {
          setData: (input: { options: { value: number } }) => {
            this._val = +input.options.value;
            return { txReceipt: "0xdone", value: this._val };
          },
          deployContract: (_) => "0x100",
        },
      };
    }
  }

  return {
    factory: () => new MockPlugin(),
    manifest: {
      schema: ``,
      implements: [],
    },
  };
};

export function getConfigs(defaultConfigs: Partial<Web3ApiClientConfig>) {
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
