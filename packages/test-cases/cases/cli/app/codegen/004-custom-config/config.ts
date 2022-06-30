import { PolywrapClientConfig } from "@polywrap/client-js";
import { PluginModule } from "@polywrap/core-js";

interface Config extends Record<string, unknown> {
  val: number;
}

class MockPlugin extends PluginModule<Config> {

  getData(_: unknown): number { return this.config.val; }

  setData(args: { value: number }) {
    this.config.val = +args.value;
    return true;
  }

  deployContract(): string { return "0x100"; }
}

const mockPlugin = () => {
  return {
    factory: () => new MockPlugin({ val: 0 }),
    manifest: {
      schema: `
        type Module {
          getData: Int!
          setData(value: Int!): Boolean!
          deployContract: String!
        }
      `,
      implements: [],
    },
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
  return defaultConfigs;
}
