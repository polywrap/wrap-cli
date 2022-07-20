export const abi = {
  "objectTypes": [
    {
      "type": "ModuleInterfaceArgument",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
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
        },
        {
          "type": "UInt8",
          "name": "uint8",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt8",
            "name": "uint8",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [
        {
          "type": "NestedModuleInterfaceArgument",
          "name": null,
          "required": null,
          "kind": 2048,
          "array": null,
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "comment": "ModuleInterfaceArgument comment"
    },
    {
      "type": "NestedModuleInterfaceArgument",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
        {
          "type": "UInt8",
          "name": "uint8",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt8",
            "name": "uint8",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "comment": "NestedModuleInterfaceArgument comment"
    },
    {
      "type": "InterfaceObject1",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
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
        },
        {
          "type": "UInt8",
          "name": "uint8",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt8",
            "name": "uint8",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null,
          "comment": "InterfaceObject1_uint8 comment"
        }
      ],
      "interfaces": [],
      "comment": "InterfaceObject1 comment"
    },
    {
      "type": "InterfaceObject2",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
        {
          "type": "String",
          "name": "str2",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "str2",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "Object",
          "name": "object",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": null,
          "object": {
            "type": "Object",
            "name": "object",
            "required": null,
            "kind": 8192
          },
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [
        {
          "type": "NestedInterfaceObject",
          "name": null,
          "required": null,
          "kind": 2048,
          "array": null,
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "comment": "InterfaceObject2 comment"
    },
    {
      "type": "NestedInterfaceObject",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
        {
          "type": "Object",
          "name": "object",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": null,
          "object": {
            "type": "Object",
            "name": "object",
            "required": null,
            "kind": 8192
          },
          "enum": null,
          "unresolvedObjectOrEnum": null,
          "comment": "object comment"
        }
      ],
      "interfaces": [],
      "comment": "NestedInterfaceObject comment"
    },
    {
      "type": "Object",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
        {
          "type": "UInt8",
          "name": "uint8",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt8",
            "name": "uint8",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "comment": "Object comment"
    }
  ],
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
        "name": "abstractModuleMethod",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "ModuleInterfaceArgument",
            "name": "arg",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "ModuleInterfaceArgument",
              "name": "arg",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null,
            "comment": "arg comment"
          }
        ],
        "return": {
          "type": "InterfaceObject2",
          "name": "abstractModuleMethod",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": null,
          "object": {
            "type": "InterfaceObject2",
            "name": "abstractModuleMethod",
            "required": true,
            "kind": 8192
          },
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        "comment": "abstractModuleMethod comment"
      }
    ],
    "imports": [],
    "interfaces": [],
    "comment": "Module comment"
  }
}
