# NOTE: This is an auto-generated file. All modifications will be overwritten.
# type: ignore
from __future__ import annotations

import json

from polywrap_manifest import WrapManifest

abi = json.loads("""
{
  "moduleType": {
    "kind": 128,
    "methods": [
      {
        "arguments": [
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
          }
        ],
        "kind": 64,
        "name": "sampleMethod",
        "required": true,
        "return": {
          "kind": 34,
          "name": "sampleMethod",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "sampleMethod",
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
""")

manifest = WrapManifest.parse_obj({
    "name": "Sample",
    "type": "plugin",
    "version": "0.1",
    "abi": abi,
})
