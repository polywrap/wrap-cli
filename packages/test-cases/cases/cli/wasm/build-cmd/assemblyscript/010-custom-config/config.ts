import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { latestWrapManifestVersion } from "@polywrap/wrap-manifest-types-js";

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
  return PluginPackage.from(
    new MockPlugin({ val: 0 }) as PluginModule<Config>,
    {
      name: "mock",
      type: "plugin",
      version: latestWrapManifestVersion,
      abi: {
        objectTypes: [],
        enumTypes: [],
        interfaceTypes: [],
        importedObjectTypes: [],
        importedModuleTypes: [],
        importedEnumTypes: [],
        importedEnvTypes: [],
        moduleType: {
          type: "Module",
          kind: 128,
          methods: [
            {
              type: "Method",
              name: "getData",
              required: true,
              kind: 64,
              arguments: [],
              return: {
                type: "Int",
                name: "getData",
                required: true,
                kind: 34,
                scalar: {
                  type: "Int",
                  name: "getData",
                  required: true,
                  kind: 4,
                },
              },
            },
            {
              type: "Method",
              name: "setData",
              required: true,
              kind: 64,
              arguments: [
                {
                  type: "Int",
                  name: "value",
                  required: true,
                  kind: 34,
                  scalar: {
                    type: "Int",
                    name: "value",
                    required: true,
                    kind: 4,
                  },
                },
              ],
              return: {
                type: "Boolean",
                name: "setData",
                required: true,
                kind: 34,
                scalar: {
                  type: "Boolean",
                  name: "setData",
                  required: true,
                  kind: 4,
                },
              },
            },
            {
              type: "Method",
              name: "deployContract",
              required: true,
              kind: 64,
              arguments: [],
              return: {
                type: "String",
                name: "deployContract",
                required: true,
                kind: 34,
                scalar: {
                  type: "String",
                  name: "deployContract",
                  required: true,
                  kind: 4,
                },
              },
            },
          ],
          imports: [],
          interfaces: [],
        },
      }
    }
  );
};

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  return builder.addPackage("wrap://ens/mock.eth", mockPlugin());
}
