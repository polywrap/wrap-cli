/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const manifest: WrapManifest = {
  name: "Test",
  type: "plugin",
  version: "0.1",
  abi: {
  "envType": {
    "kind": 65536,
    "properties": [
      {
        "kind": 34,
        "name": "arg1",
        "required": true,
        "scalar": {
          "kind": 4,
          "name": "arg1",
          "required": true,
          "type": "String"
        },
        "type": "String"
      }
    ],
    "type": "Env"
  },
  "moduleType": {
    "kind": 128,
    "methods": [
      {
        "arguments": [
          {
            "kind": 34,
            "name": "str",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "str",
              "required": true,
              "type": "String"
            },
            "type": "String"
          }
        ],
        "kind": 64,
        "name": "method",
        "required": true,
        "return": {
          "kind": 34,
          "name": "method",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "method",
            "required": true,
            "type": "String"
          },
          "type": "String"
        },
        "type": "Method"
      }
    ],
    "type": "Module"
  },
  "version": "0.1"
}
}
