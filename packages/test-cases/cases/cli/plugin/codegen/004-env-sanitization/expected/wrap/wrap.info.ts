/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const wrapManifest: WrapManifest = {
  name: "Test",
  type: "plugin",
  version: "0.1",
  abi: {
  "version": "0.1",
  "envType": {
    "type": "Env",
    "kind": 65536,
    "properties": [
      {
        "type": "String",
        "name": "queryArg",
        "required": true,
        "kind": 34,
        "scalar": {
          "type": "String",
          "name": "queryArg",
          "required": true,
          "kind": 4
        }
      }
    ]
  },
  "moduleType": {
    "type": "Module",
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
            "scalar": {
              "type": "String",
              "name": "str",
              "required": true,
              "kind": 4
            }
          }
        ],
        "return": {
          "type": "String",
          "name": "method",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "method",
            "required": true,
            "kind": 4
          }
        }
      }
    ]
  }
}
}
