/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const wrapManifest: WrapManifest = {
  name: "Test",
  type: "plugin",
  version: "0.1",
  abi: {
  "objectTypes": [],
  "enumTypes": [],
  "interfaceTypes": [],
  "importedObjectTypes": [],
  "importedModuleTypes": [],
  "importedEnumTypes": [],
  "importedEnvTypes": [],
  "envType": {
    "type": "Env",
    "name": null,
    "required": null,
    "kind": 65536,
    "properties": [
      {
        "type": "String",
        "name": "arg1",
        "required": true,
        "kind": 34,
        "array": null,
        "map": null,
        "scalar": {
          "type": "String",
          "name": "arg1",
          "required": true,
          "kind": 4
        },
        "object": null,
        "enum": null,
        "unresolvedObjectOrEnum": null
      }
    ],
    "interfaces": []
  },
  "moduleType": {
    "type": "Module",
    "name": null,
    "required": null,
    "kind": 128,
    "methods": [
      {
        "type": "Method",
        "name": "method",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "String",
            "name": "str",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "str",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        ],
        "return": {
          "type": "String",
          "name": "method",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "method",
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
