import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { latestWrapManifestVersion } from "@polywrap/wrap-manifest-types-js";
import { parseSchema } from "@polywrap/schema-parse";

interface Config extends Record<string, unknown> {
  val: number;
}

class MockPlugin extends PluginModule<Config> {
  getData(_: unknown): number {
    return this.config.val;
  }

  setData(args: { value: number }) {
    this.config.val = +args.value;
    return true;
  }

  deployContract(): string {
    return "0x100";
  }
}

const mockPlugin = () => {
  return PluginPackage.from(new MockPlugin({ val: 0 }), {
    name: "mock",
    type: "plugin",
    version: latestWrapManifestVersion,
    abi: parseSchema(`
      type Module {
        getData: Int!
        setData(value: Int!): Boolean!
        deployContract: String!
      }
    `),
  });
};

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  return builder.addPackage("wrap://ens/mock.eth", mockPlugin());
}
