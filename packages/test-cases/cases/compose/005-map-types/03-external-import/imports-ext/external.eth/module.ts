import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  "moduleType": {
    "type": "Module",
    "kind": 128,
    "methods": [
      {
        "type": "Method",
        "name": "getMap",
        "required": true,
        "kind": 64,
        "return": {
          "type": "Map<String, Int>",
          "name": "getMap",
          "required": true,
          "kind": 34,
          "map": {
            "type": "Map<String, Int>",
            "name": "getMap",
            "required": true,
            "kind": 262146,
            "scalar": {
              "type": "Int",
              "name": "getMap",
              "kind": 4
            },
            "key": {
              "type": "String",
              "name": "getMap",
              "required": true,
              "kind": 4
            },
            "value": {
              "type": "Int",
              "name": "getMap",
              "kind": 4
            }
          }
        }
      },
      {
        "type": "Method",
        "name": "updateMap",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "Map<String, Int>",
            "name": "map",
            "required": true,
            "kind": 34,
            "map": {
              "type": "Map<String, Int>",
              "name": "map",
              "required": true,
              "kind": 262146,
              "scalar": {
                "type": "Int",
                "name": "map",
                "kind": 4
              },
              "key": {
                "type": "String",
                "name": "map",
                "required": true,
                "kind": 4
              },
              "value": {
                "type": "Int",
                "name": "map",
                "kind": 4
              }
            }
          }
        ],
        "return": {
          "type": "Map<String, Int>",
          "name": "updateMap",
          "required": true,
          "kind": 34,
          "map": {
            "type": "Map<String, Int>",
            "name": "updateMap",
            "required": true,
            "kind": 262146,
            "scalar": {
              "type": "Int",
              "name": "updateMap",
              "kind": 4
            },
            "key": {
              "type": "String",
              "name": "updateMap",
              "required": true,
              "kind": 4
            },
            "value": {
              "type": "Int",
              "name": "updateMap",
              "kind": 4
            }
          }
        }
      }
    ]
  }
};
