import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  "objectTypes": [
    {
      "type": "ExternalType",
      "kind": 1,
      "properties": [
        {
          "type": "String",
          "name": "str",
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "str",
            "kind": 4
          }
        }
      ]
    },
    {
      "type": "ExternalType2",
      "kind": 1,
      "properties": [
        {
          "type": "UInt32",
          "name": "foo",
          "kind": 34,
          "scalar": {
            "type": "UInt32",
            "name": "foo",
            "kind": 4
          }
        }
      ]
    }
  ],
  "envType": {
    "type": "Env",
    "kind": 65536,
    "properties": [
      {
        "type": "ExternalType",
        "name": "externalProp",
        "kind": 34,
        "object": {
          "type": "ExternalType",
          "name": "externalProp",
          "kind": 8192
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
        "name": "envMethod",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "String",
            "name": "arg",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "arg",
              "required": true,
              "kind": 4
            }
          }
        ],
        "return": {
          "type": "String",
          "name": "envMethod",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "envMethod",
            "required": true,
            "kind": 4
          }
        },
        "env": {
          "required": true
        }
      },
      {
        "type": "Method",
        "name": "optEnvMethod",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "String",
            "name": "arg",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "arg",
              "required": true,
              "kind": 4
            }
          }
        ],
        "return": {
          "type": "String",
          "name": "optEnvMethod",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "optEnvMethod",
            "required": true,
            "kind": 4
          }
        },
        "env": {
          "required": false
        }
      }
    ]
  }
};
