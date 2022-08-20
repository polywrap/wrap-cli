/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const manifest: WrapManifest = {
  name: "Ws",
  type: "plugin",
  version: "0.1",
  abi: {
  "moduleType": {
    "kind": 128,
    "methods": [
      {
        "arguments": [
          {
            "kind": 34,
            "name": "url",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "url",
              "required": true,
              "type": "String"
            },
            "type": "String"
          },
          {
            "kind": 34,
            "name": "timeout",
            "object": {
              "kind": 8192,
              "name": "timeout",
              "type": "Number"
            },
            "type": "Number"
          }
        ],
        "kind": 64,
        "name": "open",
        "required": true,
        "return": {
          "kind": 34,
          "name": "open",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "open",
            "required": true,
            "type": "Int"
          },
          "type": "Int"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          }
        ],
        "kind": 64,
        "name": "close",
        "required": true,
        "return": {
          "kind": 34,
          "name": "close",
          "scalar": {
            "kind": 4,
            "name": "close",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          },
          {
            "kind": 34,
            "name": "message",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "message",
              "required": true,
              "type": "String"
            },
            "type": "String"
          }
        ],
        "kind": 64,
        "name": "send",
        "required": true,
        "return": {
          "kind": 34,
          "name": "send",
          "scalar": {
            "kind": 4,
            "name": "send",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          },
          {
            "kind": 34,
            "name": "callback",
            "object": {
              "kind": 8192,
              "name": "callback",
              "required": true,
              "type": "Callback"
            },
            "required": true,
            "type": "Callback"
          }
        ],
        "kind": 64,
        "name": "addCallback",
        "required": true,
        "return": {
          "kind": 34,
          "name": "addCallback",
          "scalar": {
            "kind": 4,
            "name": "addCallback",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          },
          {
            "kind": 34,
            "name": "callback",
            "object": {
              "kind": 8192,
              "name": "callback",
              "required": true,
              "type": "Callback"
            },
            "required": true,
            "type": "Callback"
          }
        ],
        "kind": 64,
        "name": "removeCallback",
        "required": true,
        "return": {
          "kind": 34,
          "name": "removeCallback",
          "scalar": {
            "kind": 4,
            "name": "removeCallback",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          }
        ],
        "kind": 64,
        "name": "addCache",
        "required": true,
        "return": {
          "kind": 34,
          "name": "addCache",
          "scalar": {
            "kind": 4,
            "name": "addCache",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          }
        ],
        "kind": 64,
        "name": "removeCache",
        "required": true,
        "return": {
          "kind": 34,
          "name": "removeCache",
          "scalar": {
            "kind": 4,
            "name": "removeCache",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "id",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "id",
              "required": true,
              "type": "Int"
            },
            "type": "Int"
          },
          {
            "kind": 34,
            "name": "min",
            "object": {
              "kind": 8192,
              "name": "min",
              "type": "Number"
            },
            "type": "Number"
          },
          {
            "kind": 34,
            "name": "timeout",
            "object": {
              "kind": 8192,
              "name": "timeout",
              "type": "Number"
            },
            "type": "Number"
          }
        ],
        "kind": 64,
        "name": "receive",
        "required": true,
        "return": {
          "array": {
            "item": {
              "kind": 8192,
              "name": "receive",
              "required": true,
              "type": "Message"
            },
            "kind": 18,
            "name": "receive",
            "object": {
              "kind": 8192,
              "name": "receive",
              "required": true,
              "type": "Message"
            },
            "required": true,
            "type": "[Message]"
          },
          "kind": 34,
          "name": "receive",
          "required": true,
          "type": "[Message]"
        },
        "type": "Method"
      }
    ],
    "type": "Module"
  },
  "objectTypes": [
    {
      "kind": 1,
      "properties": [
        {
          "kind": 34,
          "name": "data",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "data",
            "required": true,
            "type": "String"
          },
          "type": "String"
        },
        {
          "kind": 34,
          "name": "origin",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "origin",
            "required": true,
            "type": "String"
          },
          "type": "String"
        },
        {
          "kind": 34,
          "name": "lastEventId",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "lastEventId",
            "required": true,
            "type": "String"
          },
          "type": "String"
        }
      ],
      "type": "Message"
    },
    {
      "kind": 1,
      "properties": [
        {
          "kind": 34,
          "name": "uri",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "uri",
            "required": true,
            "type": "String"
          },
          "type": "String"
        },
        {
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
        }
      ],
      "type": "Callback"
    },
    {
      "kind": 1,
      "properties": [
        {
          "kind": 34,
          "name": "value",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "value",
            "required": true,
            "type": "Int"
          },
          "type": "Int"
        }
      ],
      "type": "Number"
    }
  ],
  "version": "0.1"
}
}
