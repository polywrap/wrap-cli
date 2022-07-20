export const abi = {
  "objectTypes": [
    {
      "type": "ExternalType",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
        {
          "type": "String",
          "name": "str",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "str",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": []
    }
  ],
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
        "type": "ExternalType",
        "name": "externalProp",
        "required": null,
        "kind": 34,
        "array": null,
        "map": null,
        "scalar": null,
        "object": {
          "type": "ExternalType",
          "name": "externalProp",
          "required": null,
          "kind": 8192
        },
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
        "name": "envMethod",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "String",
            "name": "arg",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "arg",
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
          "name": "envMethod",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "envMethod",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
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
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "arg",
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
          "name": "optEnvMethod",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "optEnvMethod",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        "env": {
          "required": false
        }
      }
    ],
    "imports": [],
    "interfaces": []
  }
}