/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const manifest: WrapManifest = {
  name: "Test",
  type: "plugin",
  version: "0.1",
  abi: {
  "importedModuleTypes": [
    {
      "isInterface": false,
      "kind": 256,
      "methods": [
        {
          "arguments": [
            {
              "kind": 34,
              "name": "arg",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "arg",
                "required": true,
                "type": "String"
              },
              "type": "String"
            }
          ],
          "comment": "Attempt to resolve a wrapper from its URI.\n@param authority - URI authority (ex: \"file\")\n@param path - URI path (ex: \"/path/to/wrapper\")",
          "kind": 64,
          "name": "methodA",
          "required": true,
          "return": {
            "kind": 34,
            "name": "methodA",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "methodA",
              "required": true,
              "type": "String"
            },
            "type": "String"
          },
          "type": "Method"
        },
        {
          "arguments": [
            {
              "kind": 34,
              "name": "arg",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "arg",
                "required": true,
                "type": "Bytes"
              },
              "type": "Bytes"
            }
          ],
          "comment": "  Attempt to read a file. For example:\n{\n  path: \"/path/to/wrapper/wrap.wasm\"\n}",
          "kind": 64,
          "name": "methodB",
          "required": true,
          "return": {
            "kind": 34,
            "name": "methodB",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "methodB",
              "required": true,
              "type": "Boolean"
            },
            "type": "Boolean"
          },
          "type": "Method"
        }
      ],
      "namespace": "Interface",
      "nativeType": "Module",
      "type": "Interface_Module",
      "uri": "my/import"
    }
  ],
  "moduleType": {
    "imports": [
      {
        "type": "Interface_Module"
      }
    ],
    "interfaces": [
      {
        "kind": 2048,
        "type": "Interface_Module"
      }
    ],
    "kind": 128,
    "methods": [
      {
        "arguments": [
          {
            "kind": 34,
            "name": "arg",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "arg",
              "required": true,
              "type": "String"
            },
            "type": "String"
          }
        ],
        "kind": 64,
        "name": "methodA",
        "required": true,
        "return": {
          "kind": 34,
          "name": "methodA",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "methodA",
            "required": true,
            "type": "String"
          },
          "type": "String"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "arg",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "arg",
              "required": true,
              "type": "Bytes"
            },
            "type": "Bytes"
          }
        ],
        "kind": 64,
        "name": "methodB",
        "required": true,
        "return": {
          "kind": 34,
          "name": "methodB",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "methodB",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      }
    ],
    "type": "Module"
  },
  "version": "0.1"
}
}
