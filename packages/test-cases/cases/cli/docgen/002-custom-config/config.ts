import { PolywrapClientConfig } from "@polywrap/client-js";
import { PluginModule } from "@polywrap/core-js";
import { latestWrapManifestVersion, WrapManifest } from "@polywrap/wrap-manifest-types-js";

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
    manifest: mockPluginManifest
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

export const mockPluginManifest: WrapManifest = {
  name: "mock",
  type: "plugin",
  version: latestWrapManifestVersion,
  abi: {
    "version": "0.1",
    "moduleType": {
      "type": "Module",
      "kind": 128,
      "methods": [
        {
          "type": "Method",
          "name": "getData",
          "required": true,
          "kind": 64,
          "return": {
            "type": "Int",
            "name": "getData",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "Int",
              "name": "getData",
              "required": true,
              "kind": 4
            }
          }
        },
        {
          "type": "Method",
          "name": "setData",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Int",
              "name": "value",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "Int",
                "name": "value",
                "required": true,
                "kind": 4
              }
            }
          ],
          "return": {
            "type": "Boolean",
            "name": "setData",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "Boolean",
              "name": "setData",
              "required": true,
              "kind": 4
            }
          }
        },
        {
          "type": "Method",
          "name": "deployContract",
          "required": true,
          "kind": 64,
          "return": {
            "type": "String",
            "name": "deployContract",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "deployContract",
              "required": true,
              "kind": 4
            }
          }
        }
      ]
    }
  }
}

