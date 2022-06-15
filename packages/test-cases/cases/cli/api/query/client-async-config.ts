import { Web3ApiClientConfig } from "@web3api/client-js";
import { PluginModule } from "@web3api/core-js";

interface Config extends Record<string, unknown> {
  val: number;
}

class MockPlugin extends PluginModule<Config> {
  getData(_: unknown): number { return this.config.val; }

  setData(input: { options: { value: number } }) {
    this.config.val = +input.options.value;
    return { txReceipt: "0xdone", value: this.config.val };
  }

  deployContract(): string { return "0x100"; }
}

const mockPlugin = () => {
  return {
    factory: () => new MockPlugin({ val: 0 }),
    manifest: {
      schema: ``,
      implements: [],
    },
  };
};

export async function getClientConfig(defaultConfigs: Partial<Web3ApiClientConfig>): Promise<Partial<Web3ApiClientConfig>> {
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
