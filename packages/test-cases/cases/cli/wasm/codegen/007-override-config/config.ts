import {
  BaseClientConfigBuilder,
  getDefaultConfig,
  IClientConfigBuilder,
  CoreClientConfig,
  ExtendableUriResolver,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  StaticResolver,
  Uri,
  WrapperCache,
} from "@polywrap/client-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { latestWrapManifestVersion } from "@polywrap/schema-parse";

export class CustomConfigBuilder extends BaseClientConfigBuilder {
  addDefaults(): IClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  buildCoreConfig(): CoreClientConfig {
    const config = super.build();
    return {
      envs: config.envs,
      interfaces: config.interfaces,
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            StaticResolver.from([
              ...config.redirects,
              ...config.wrappers,
              ...config.packages,
            ]),
            ...this.config.resolvers,
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ),
    };
  }
}

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
      },
    }
  );
};

export function configure(_: IClientConfigBuilder): IClientConfigBuilder {
  return new CustomConfigBuilder()
    .addDefaults()
    .addPackage("wrap://ens/mock.eth", mockPlugin());
}
