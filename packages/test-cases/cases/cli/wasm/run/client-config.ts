import { PolywrapClientConfig } from "@polywrap/client-js";
import { PluginModule } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

interface Config extends Record<string, unknown> {
  val: number;
}

class MockPlugin extends PluginModule<Config> {

  getData(_: unknown): number { return this.config.val; }

  setData(args: { options: { value: number } }) {
    this.config.val = +args.options.value;
    return { txReceipt: "0xdone", value: this.config.val };
  }

  deployContract(): string { return "0x100"; }
}

const mockPlugin = () => {
  return {
    factory: () => new MockPlugin({ val: 0 }),
    manifest: {} as WrapManifest,
  };
};

export function getClientConfig(defaultConfigs: Partial<PolywrapClientConfig>) {
  if (defaultConfigs.plugins) {
    defaultConfigs.plugins.push({
      uri: "wrap://ens/mock.eth",
      plugin: mockPlugin(),
    });
  } else {
    defaultConfigs.plugins = [
      {
        uri: "wrap://ens/mock.eth",
        plugin: mockPlugin(),
      },
    ];
  }
  defaultConfigs.redirects = [
    {
      from: "wrap://ens/testnet/simplestorage.eth",
      to: "wrap://ens/mock.eth",
    },
  ];
  return defaultConfigs;
}
