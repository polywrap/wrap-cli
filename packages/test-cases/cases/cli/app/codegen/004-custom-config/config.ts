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
    "objectTypes": [],
    "enumTypes": [],
    "interfaceTypes": [],
    "importedObjectTypes": [],
    "importedModuleTypes": [],
    "importedEnumTypes": [],
    "importedEnvTypes": [],
    "moduleType": {
      "type": "Module",
      "name": null,
      "required": null,
      "kind": 128,
      "methods": [
        {
          "type": "Method",
          "name": "getData",
          "required": true,
          "kind": 64,
          "arguments": [],
          "return": {
            "type": "Int",
            "name": "getData",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "Int",
              "name": "getData",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
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
              "array": null,
              "map": null,
              "scalar": {
                "type": "Int",
                "name": "value",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Boolean",
            "name": "setData",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "Boolean",
              "name": "setData",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "deployContract",
          "required": true,
          "kind": 64,
          "arguments": [],
          "return": {
            "type": "String",
            "name": "deployContract",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "deployContract",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        }
      ],
      "imports": [],
      "interfaces": []
    }
  }
}
