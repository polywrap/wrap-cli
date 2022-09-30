import { CustomClientConfig } from "@polywrap/client-config-builder-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import {
  latestWrapManifestVersion,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";

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
    schema: `
        type Module {
          getData: Int!
          setData(value: Int!): Boolean!
          deployContract: String!
        }
      `,
    abi: [],
    implements: [],
  } as WrapManifest);
};

export function getCustomConfig(): Partial<CustomClientConfig<string>> {
  return {
    packages: [
      {
        uri: "wrap://ens/mock.eth",
        package: mockPlugin(),
      },
    ],
  };
}
