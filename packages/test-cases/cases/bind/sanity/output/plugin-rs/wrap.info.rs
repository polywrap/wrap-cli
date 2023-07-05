/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
use polywrap_plugin::JSON::{from_value, json};
use wrap_manifest_schemas::versions::{WrapManifest, WrapManifestAbi};

pub fn get_manifest() -> WrapManifest {
  WrapManifest {
    name: "Test".to_string(),
    type_: "plugin".to_string(),
    version: "0.1".to_string(),
    abi: from_value::<WrapManifestAbi>(json!({
  "enumTypes": [
    {
      "constants": [
        "STRING",
        "BYTES"
      ],
      "kind": 8,
      "type": "CustomEnum"
    },
    {
      "constants": [
        "for",
        "in"
      ],
      "kind": 8,
      "type": "while"
    }
  ],
  "envType": {
    "kind": 65536,
    "properties": [
      {
        "kind": 34,
        "name": "prop",
        "required": true,
        "scalar": {
          "kind": 4,
          "name": "prop",
          "required": true,
          "type": "String"
        },
        "type": "String"
      },
      {
        "kind": 34,
        "name": "optProp",
        "scalar": {
          "kind": 4,
          "name": "optProp",
          "type": "String"
        },
        "type": "String"
      },
      {
        "kind": 34,
        "map": {
          "key": {
            "kind": 4,
            "name": "optMap",
            "required": true,
            "type": "String"
          },
          "kind": 262146,
          "name": "optMap",
          "scalar": {
            "kind": 4,
            "name": "optMap",
            "type": "Int"
          },
          "type": "Map<String, Int>",
          "value": {
            "kind": 4,
            "name": "optMap",
            "type": "Int"
          }
        },
        "name": "optMap",
        "type": "Map<String, Int>"
      }
    ],
    "type": "Env"
  },
  "importedEnumTypes": [
    {
      "constants": [
        "STRING",
        "BYTES"
      ],
      "kind": 520,
      "namespace": "TestImport",
      "nativeType": "Enum",
      "type": "TestImport_Enum",
      "uri": "testimport.uri.eth"
    },
    {
      "constants": [
        "STRING",
        "BYTES"
      ],
      "kind": 520,
      "namespace": "TestImport",
      "nativeType": "Enum",
      "type": "TestImport_Enum_Return",
      "uri": "testimport.uri.eth"
    }
  ],
  "importedEnvTypes": [
    {
      "kind": 524288,
      "namespace": "TestImport",
      "nativeType": "Env",
      "properties": [
        {
          "kind": 34,
          "name": "object",
          "object": {
            "kind": 8192,
            "name": "object",
            "required": true,
            "type": "TestImport_AnotherObject"
          },
          "required": true,
          "type": "TestImport_AnotherObject"
        },
        {
          "kind": 34,
          "name": "optObject",
          "object": {
            "kind": 8192,
            "name": "optObject",
            "type": "TestImport_AnotherObject"
          },
          "type": "TestImport_AnotherObject"
        },
        {
          "array": {
            "item": {
              "kind": 8192,
              "name": "objectArray",
              "required": true,
              "type": "TestImport_AnotherObject"
            },
            "kind": 18,
            "name": "objectArray",
            "object": {
              "kind": 8192,
              "name": "objectArray",
              "required": true,
              "type": "TestImport_AnotherObject"
            },
            "required": true,
            "type": "[TestImport_AnotherObject]"
          },
          "kind": 34,
          "name": "objectArray",
          "required": true,
          "type": "[TestImport_AnotherObject]"
        },
        {
          "array": {
            "item": {
              "kind": 8192,
              "name": "optObjectArray",
              "type": "TestImport_AnotherObject"
            },
            "kind": 18,
            "name": "optObjectArray",
            "object": {
              "kind": 8192,
              "name": "optObjectArray",
              "type": "TestImport_AnotherObject"
            },
            "type": "[TestImport_AnotherObject]"
          },
          "kind": 34,
          "name": "optObjectArray",
          "type": "[TestImport_AnotherObject]"
        },
        {
          "enum": {
            "kind": 16384,
            "name": "en",
            "required": true,
            "type": "TestImport_Enum"
          },
          "kind": 34,
          "name": "en",
          "required": true,
          "type": "TestImport_Enum"
        },
        {
          "enum": {
            "kind": 16384,
            "name": "optEnum",
            "type": "TestImport_Enum"
          },
          "kind": 34,
          "name": "optEnum",
          "type": "TestImport_Enum"
        },
        {
          "array": {
            "enum": {
              "kind": 16384,
              "name": "enumArray",
              "required": true,
              "type": "TestImport_Enum"
            },
            "item": {
              "kind": 16384,
              "name": "enumArray",
              "required": true,
              "type": "TestImport_Enum"
            },
            "kind": 18,
            "name": "enumArray",
            "required": true,
            "type": "[TestImport_Enum]"
          },
          "kind": 34,
          "name": "enumArray",
          "required": true,
          "type": "[TestImport_Enum]"
        },
        {
          "array": {
            "enum": {
              "kind": 16384,
              "name": "optEnumArray",
              "type": "TestImport_Enum"
            },
            "item": {
              "kind": 16384,
              "name": "optEnumArray",
              "type": "TestImport_Enum"
            },
            "kind": 18,
            "name": "optEnumArray",
            "type": "[TestImport_Enum]"
          },
          "kind": 34,
          "name": "optEnumArray",
          "type": "[TestImport_Enum]"
        }
      ],
      "type": "TestImport_Env",
      "uri": "testimport.uri.eth"
    }
  ],
  "importedModuleTypes": [
    {
      "isInterface": true,
      "kind": 256,
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
            },
            {
              "kind": 34,
              "name": "optStr",
              "scalar": {
                "kind": 4,
                "name": "optStr",
                "type": "String"
              },
              "type": "String"
            },
            {
              "kind": 34,
              "name": "u",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "u",
                "required": true,
                "type": "UInt"
              },
              "type": "UInt"
            },
            {
              "kind": 34,
              "name": "optU",
              "scalar": {
                "kind": 4,
                "name": "optU",
                "type": "UInt"
              },
              "type": "UInt"
            },
            {
              "array": {
                "array": {
                  "item": {
                    "kind": 4,
                    "name": "uArrayArray",
                    "type": "UInt"
                  },
                  "kind": 18,
                  "name": "uArrayArray",
                  "scalar": {
                    "kind": 4,
                    "name": "uArrayArray",
                    "type": "UInt"
                  },
                  "type": "[UInt]"
                },
                "item": {
                  "item": {
                    "kind": 4,
                    "name": "uArrayArray",
                    "type": "UInt"
                  },
                  "kind": 18,
                  "name": "uArrayArray",
                  "scalar": {
                    "kind": 4,
                    "name": "uArrayArray",
                    "type": "UInt"
                  },
                  "type": "[UInt]"
                },
                "kind": 18,
                "name": "uArrayArray",
                "required": true,
                "type": "[[UInt]]"
              },
              "kind": 34,
              "name": "uArrayArray",
              "required": true,
              "type": "[[UInt]]"
            },
            {
              "kind": 34,
              "name": "object",
              "object": {
                "kind": 8192,
                "name": "object",
                "required": true,
                "type": "TestImport_Object"
              },
              "required": true,
              "type": "TestImport_Object"
            },
            {
              "kind": 34,
              "name": "optObject",
              "object": {
                "kind": 8192,
                "name": "optObject",
                "type": "TestImport_Object"
              },
              "type": "TestImport_Object"
            },
            {
              "array": {
                "item": {
                  "kind": 8192,
                  "name": "objectArray",
                  "required": true,
                  "type": "TestImport_Object"
                },
                "kind": 18,
                "name": "objectArray",
                "object": {
                  "kind": 8192,
                  "name": "objectArray",
                  "required": true,
                  "type": "TestImport_Object"
                },
                "required": true,
                "type": "[TestImport_Object]"
              },
              "kind": 34,
              "name": "objectArray",
              "required": true,
              "type": "[TestImport_Object]"
            },
            {
              "array": {
                "item": {
                  "kind": 8192,
                  "name": "optObjectArray",
                  "type": "TestImport_Object"
                },
                "kind": 18,
                "name": "optObjectArray",
                "object": {
                  "kind": 8192,
                  "name": "optObjectArray",
                  "type": "TestImport_Object"
                },
                "type": "[TestImport_Object]"
              },
              "kind": 34,
              "name": "optObjectArray",
              "type": "[TestImport_Object]"
            },
            {
              "enum": {
                "kind": 16384,
                "name": "en",
                "required": true,
                "type": "TestImport_Enum"
              },
              "kind": 34,
              "name": "en",
              "required": true,
              "type": "TestImport_Enum"
            },
            {
              "enum": {
                "kind": 16384,
                "name": "optEnum",
                "type": "TestImport_Enum"
              },
              "kind": 34,
              "name": "optEnum",
              "type": "TestImport_Enum"
            },
            {
              "array": {
                "enum": {
                  "kind": 16384,
                  "name": "enumArray",
                  "required": true,
                  "type": "TestImport_Enum"
                },
                "item": {
                  "kind": 16384,
                  "name": "enumArray",
                  "required": true,
                  "type": "TestImport_Enum"
                },
                "kind": 18,
                "name": "enumArray",
                "required": true,
                "type": "[TestImport_Enum]"
              },
              "kind": 34,
              "name": "enumArray",
              "required": true,
              "type": "[TestImport_Enum]"
            },
            {
              "array": {
                "enum": {
                  "kind": 16384,
                  "name": "optEnumArray",
                  "type": "TestImport_Enum"
                },
                "item": {
                  "kind": 16384,
                  "name": "optEnumArray",
                  "type": "TestImport_Enum"
                },
                "kind": 18,
                "name": "optEnumArray",
                "type": "[TestImport_Enum]"
              },
              "kind": 34,
              "name": "optEnumArray",
              "type": "[TestImport_Enum]"
            }
          ],
          "env": {
            "required": true
          },
          "kind": 64,
          "name": "importedMethod",
          "required": true,
          "return": {
            "kind": 34,
            "name": "importedMethod",
            "object": {
              "kind": 8192,
              "name": "importedMethod",
              "type": "TestImport_Object"
            },
            "type": "TestImport_Object"
          },
          "type": "Method"
        },
        {
          "arguments": [
            {
              "array": {
                "item": {
                  "kind": 4,
                  "name": "arg",
                  "required": true,
                  "type": "String"
                },
                "kind": 18,
                "name": "arg",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "arg",
                  "required": true,
                  "type": "String"
                },
                "type": "[String]"
              },
              "kind": 34,
              "name": "arg",
              "required": true,
              "type": "[String]"
            }
          ],
          "kind": 64,
          "name": "anotherMethod",
          "required": true,
          "return": {
            "kind": 34,
            "name": "anotherMethod",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "anotherMethod",
              "required": true,
              "type": "Int32"
            },
            "type": "Int32"
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
                "type": "String"
              },
              "type": "String"
            }
          ],
          "kind": 64,
          "name": "returnsArrayOfEnums",
          "required": true,
          "return": {
            "array": {
              "enum": {
                "kind": 16384,
                "name": "returnsArrayOfEnums",
                "type": "TestImport_Enum_Return"
              },
              "item": {
                "kind": 16384,
                "name": "returnsArrayOfEnums",
                "type": "TestImport_Enum_Return"
              },
              "kind": 18,
              "name": "returnsArrayOfEnums",
              "required": true,
              "type": "[TestImport_Enum_Return]"
            },
            "kind": 34,
            "name": "returnsArrayOfEnums",
            "required": true,
            "type": "[TestImport_Enum_Return]"
          },
          "type": "Method"
        }
      ],
      "namespace": "TestImport",
      "nativeType": "Module",
      "type": "TestImport_Module",
      "uri": "testimport.uri.eth"
    }
  ],
  "importedObjectTypes": [
    {
      "kind": 1025,
      "namespace": "TestImport",
      "nativeType": "Object",
      "properties": [
        {
          "kind": 34,
          "name": "object",
          "object": {
            "kind": 8192,
            "name": "object",
            "required": true,
            "type": "TestImport_AnotherObject"
          },
          "required": true,
          "type": "TestImport_AnotherObject"
        },
        {
          "kind": 34,
          "name": "optObject",
          "object": {
            "kind": 8192,
            "name": "optObject",
            "type": "TestImport_AnotherObject"
          },
          "type": "TestImport_AnotherObject"
        },
        {
          "array": {
            "item": {
              "kind": 8192,
              "name": "objectArray",
              "required": true,
              "type": "TestImport_AnotherObject"
            },
            "kind": 18,
            "name": "objectArray",
            "object": {
              "kind": 8192,
              "name": "objectArray",
              "required": true,
              "type": "TestImport_AnotherObject"
            },
            "required": true,
            "type": "[TestImport_AnotherObject]"
          },
          "kind": 34,
          "name": "objectArray",
          "required": true,
          "type": "[TestImport_AnotherObject]"
        },
        {
          "array": {
            "item": {
              "kind": 8192,
              "name": "optObjectArray",
              "type": "TestImport_AnotherObject"
            },
            "kind": 18,
            "name": "optObjectArray",
            "object": {
              "kind": 8192,
              "name": "optObjectArray",
              "type": "TestImport_AnotherObject"
            },
            "type": "[TestImport_AnotherObject]"
          },
          "kind": 34,
          "name": "optObjectArray",
          "type": "[TestImport_AnotherObject]"
        },
        {
          "enum": {
            "kind": 16384,
            "name": "en",
            "required": true,
            "type": "TestImport_Enum"
          },
          "kind": 34,
          "name": "en",
          "required": true,
          "type": "TestImport_Enum"
        },
        {
          "enum": {
            "kind": 16384,
            "name": "optEnum",
            "type": "TestImport_Enum"
          },
          "kind": 34,
          "name": "optEnum",
          "type": "TestImport_Enum"
        },
        {
          "array": {
            "enum": {
              "kind": 16384,
              "name": "enumArray",
              "required": true,
              "type": "TestImport_Enum"
            },
            "item": {
              "kind": 16384,
              "name": "enumArray",
              "required": true,
              "type": "TestImport_Enum"
            },
            "kind": 18,
            "name": "enumArray",
            "required": true,
            "type": "[TestImport_Enum]"
          },
          "kind": 34,
          "name": "enumArray",
          "required": true,
          "type": "[TestImport_Enum]"
        },
        {
          "array": {
            "enum": {
              "kind": 16384,
              "name": "optEnumArray",
              "type": "TestImport_Enum"
            },
            "item": {
              "kind": 16384,
              "name": "optEnumArray",
              "type": "TestImport_Enum"
            },
            "kind": 18,
            "name": "optEnumArray",
            "type": "[TestImport_Enum]"
          },
          "kind": 34,
          "name": "optEnumArray",
          "type": "[TestImport_Enum]"
        }
      ],
      "type": "TestImport_Object",
      "uri": "testimport.uri.eth"
    },
    {
      "kind": 1025,
      "namespace": "TestImport",
      "nativeType": "AnotherObject",
      "properties": [
        {
          "kind": 34,
          "name": "prop",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "prop",
            "required": true,
            "type": "String"
          },
          "type": "String"
        }
      ],
      "type": "TestImport_AnotherObject",
      "uri": "testimport.uri.eth"
    }
  ],
  "interfaceTypes": [
    {
      "capabilities": {
        "getImplementations": {
          "enabled": true
        }
      },
      "kind": 32768,
      "namespace": "TestImport",
      "nativeType": "Interface",
      "type": "TestImport",
      "uri": "testimport.uri.eth"
    }
  ],
  "moduleType": {
    "imports": [
      {
        "type": "TestImport_Module"
      },
      {
        "type": "TestImport_Object"
      },
      {
        "type": "TestImport_AnotherObject"
      },
      {
        "type": "TestImport_Enum"
      },
      {
        "type": "TestImport_Enum_Return"
      }
    ],
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
          },
          {
            "kind": 34,
            "name": "optStr",
            "scalar": {
              "kind": 4,
              "name": "optStr",
              "type": "String"
            },
            "type": "String"
          },
          {
            "enum": {
              "kind": 16384,
              "name": "en",
              "required": true,
              "type": "CustomEnum"
            },
            "kind": 34,
            "name": "en",
            "required": true,
            "type": "CustomEnum"
          },
          {
            "enum": {
              "kind": 16384,
              "name": "optEnum",
              "type": "CustomEnum"
            },
            "kind": 34,
            "name": "optEnum",
            "type": "CustomEnum"
          },
          {
            "array": {
              "enum": {
                "kind": 16384,
                "name": "enumArray",
                "required": true,
                "type": "CustomEnum"
              },
              "item": {
                "kind": 16384,
                "name": "enumArray",
                "required": true,
                "type": "CustomEnum"
              },
              "kind": 18,
              "name": "enumArray",
              "required": true,
              "type": "[CustomEnum]"
            },
            "kind": 34,
            "name": "enumArray",
            "required": true,
            "type": "[CustomEnum]"
          },
          {
            "array": {
              "enum": {
                "kind": 16384,
                "name": "optEnumArray",
                "type": "CustomEnum"
              },
              "item": {
                "kind": 16384,
                "name": "optEnumArray",
                "type": "CustomEnum"
              },
              "kind": 18,
              "name": "optEnumArray",
              "type": "[CustomEnum]"
            },
            "kind": 34,
            "name": "optEnumArray",
            "type": "[CustomEnum]"
          },
          {
            "kind": 34,
            "map": {
              "key": {
                "kind": 4,
                "name": "map",
                "required": true,
                "type": "String"
              },
              "kind": 262146,
              "name": "map",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "map",
                "required": true,
                "type": "Int"
              },
              "type": "Map<String, Int>",
              "value": {
                "kind": 4,
                "name": "map",
                "required": true,
                "type": "Int"
              }
            },
            "name": "map",
            "required": true,
            "type": "Map<String, Int>"
          },
          {
            "kind": 34,
            "map": {
              "array": {
                "item": {
                  "kind": 4,
                  "name": "mapOfArr",
                  "required": true,
                  "type": "Int"
                },
                "kind": 18,
                "name": "mapOfArr",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "mapOfArr",
                  "required": true,
                  "type": "Int"
                },
                "type": "[Int]"
              },
              "key": {
                "kind": 4,
                "name": "mapOfArr",
                "required": true,
                "type": "String"
              },
              "kind": 262146,
              "name": "mapOfArr",
              "required": true,
              "type": "Map<String, [Int]>",
              "value": {
                "item": {
                  "kind": 4,
                  "name": "mapOfArr",
                  "required": true,
                  "type": "Int"
                },
                "kind": 18,
                "name": "mapOfArr",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "mapOfArr",
                  "required": true,
                  "type": "Int"
                },
                "type": "[Int]"
              }
            },
            "name": "mapOfArr",
            "required": true,
            "type": "Map<String, [Int]>"
          },
          {
            "kind": 34,
            "map": {
              "key": {
                "kind": 4,
                "name": "mapOfMap",
                "required": true,
                "type": "String"
              },
              "kind": 262146,
              "map": {
                "key": {
                  "kind": 4,
                  "name": "mapOfMap",
                  "required": true,
                  "type": "String"
                },
                "kind": 262146,
                "name": "mapOfMap",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "mapOfMap",
                  "required": true,
                  "type": "Int"
                },
                "type": "Map<String, Int>",
                "value": {
                  "kind": 4,
                  "name": "mapOfMap",
                  "required": true,
                  "type": "Int"
                }
              },
              "name": "mapOfMap",
              "required": true,
              "type": "Map<String, Map<String, Int>>",
              "value": {
                "key": {
                  "kind": 4,
                  "name": "mapOfMap",
                  "required": true,
                  "type": "String"
                },
                "kind": 262146,
                "name": "mapOfMap",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "mapOfMap",
                  "required": true,
                  "type": "Int"
                },
                "type": "Map<String, Int>",
                "value": {
                  "kind": 4,
                  "name": "mapOfMap",
                  "required": true,
                  "type": "Int"
                }
              }
            },
            "name": "mapOfMap",
            "required": true,
            "type": "Map<String, Map<String, Int>>"
          },
          {
            "kind": 34,
            "map": {
              "key": {
                "kind": 4,
                "name": "mapOfObj",
                "required": true,
                "type": "String"
              },
              "kind": 262146,
              "name": "mapOfObj",
              "object": {
                "kind": 8192,
                "name": "mapOfObj",
                "required": true,
                "type": "AnotherType"
              },
              "required": true,
              "type": "Map<String, AnotherType>",
              "value": {
                "kind": 8192,
                "name": "mapOfObj",
                "required": true,
                "type": "AnotherType"
              }
            },
            "name": "mapOfObj",
            "required": true,
            "type": "Map<String, AnotherType>"
          },
          {
            "kind": 34,
            "map": {
              "array": {
                "item": {
                  "kind": 8192,
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "type": "AnotherType"
                },
                "kind": 18,
                "name": "mapOfArrOfObj",
                "object": {
                  "kind": 8192,
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "type": "AnotherType"
                },
                "required": true,
                "type": "[AnotherType]"
              },
              "key": {
                "kind": 4,
                "name": "mapOfArrOfObj",
                "required": true,
                "type": "String"
              },
              "kind": 262146,
              "name": "mapOfArrOfObj",
              "required": true,
              "type": "Map<String, [AnotherType]>",
              "value": {
                "item": {
                  "kind": 8192,
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "type": "AnotherType"
                },
                "kind": 18,
                "name": "mapOfArrOfObj",
                "object": {
                  "kind": 8192,
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "type": "AnotherType"
                },
                "required": true,
                "type": "[AnotherType]"
              }
            },
            "name": "mapOfArrOfObj",
            "required": true,
            "type": "Map<String, [AnotherType]>"
          }
        ],
        "kind": 64,
        "name": "moduleMethod",
        "required": true,
        "return": {
          "kind": 34,
          "name": "moduleMethod",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "moduleMethod",
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
            "name": "object",
            "object": {
              "kind": 8192,
              "name": "object",
              "required": true,
              "type": "AnotherType"
            },
            "required": true,
            "type": "AnotherType"
          },
          {
            "kind": 34,
            "name": "optObject",
            "object": {
              "kind": 8192,
              "name": "optObject",
              "type": "AnotherType"
            },
            "type": "AnotherType"
          },
          {
            "array": {
              "item": {
                "kind": 8192,
                "name": "objectArray",
                "required": true,
                "type": "AnotherType"
              },
              "kind": 18,
              "name": "objectArray",
              "object": {
                "kind": 8192,
                "name": "objectArray",
                "required": true,
                "type": "AnotherType"
              },
              "required": true,
              "type": "[AnotherType]"
            },
            "kind": 34,
            "name": "objectArray",
            "required": true,
            "type": "[AnotherType]"
          },
          {
            "array": {
              "item": {
                "kind": 8192,
                "name": "optObjectArray",
                "type": "AnotherType"
              },
              "kind": 18,
              "name": "optObjectArray",
              "object": {
                "kind": 8192,
                "name": "optObjectArray",
                "type": "AnotherType"
              },
              "type": "[AnotherType]"
            },
            "kind": 34,
            "name": "optObjectArray",
            "type": "[AnotherType]"
          }
        ],
        "env": {
          "required": true
        },
        "kind": 64,
        "name": "objectMethod",
        "required": true,
        "return": {
          "kind": 34,
          "name": "objectMethod",
          "object": {
            "kind": 8192,
            "name": "objectMethod",
            "type": "AnotherType"
          },
          "type": "AnotherType"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "object",
            "object": {
              "kind": 8192,
              "name": "object",
              "required": true,
              "type": "AnotherType"
            },
            "required": true,
            "type": "AnotherType"
          },
          {
            "kind": 34,
            "name": "optObject",
            "object": {
              "kind": 8192,
              "name": "optObject",
              "type": "AnotherType"
            },
            "type": "AnotherType"
          },
          {
            "array": {
              "item": {
                "kind": 8192,
                "name": "objectArray",
                "required": true,
                "type": "AnotherType"
              },
              "kind": 18,
              "name": "objectArray",
              "object": {
                "kind": 8192,
                "name": "objectArray",
                "required": true,
                "type": "AnotherType"
              },
              "required": true,
              "type": "[AnotherType]"
            },
            "kind": 34,
            "name": "objectArray",
            "required": true,
            "type": "[AnotherType]"
          },
          {
            "array": {
              "item": {
                "kind": 8192,
                "name": "optObjectArray",
                "type": "AnotherType"
              },
              "kind": 18,
              "name": "optObjectArray",
              "object": {
                "kind": 8192,
                "name": "optObjectArray",
                "type": "AnotherType"
              },
              "type": "[AnotherType]"
            },
            "kind": 34,
            "name": "optObjectArray",
            "type": "[AnotherType]"
          }
        ],
        "env": {
          "required": false
        },
        "kind": 64,
        "name": "optionalEnvMethod",
        "required": true,
        "return": {
          "kind": 34,
          "name": "optionalEnvMethod",
          "object": {
            "kind": 8192,
            "name": "optionalEnvMethod",
            "type": "AnotherType"
          },
          "type": "AnotherType"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "if",
            "object": {
              "kind": 8192,
              "name": "if",
              "required": true,
              "type": "else"
            },
            "required": true,
            "type": "else"
          }
        ],
        "kind": 64,
        "name": "if",
        "required": true,
        "return": {
          "kind": 34,
          "name": "if",
          "object": {
            "kind": 8192,
            "name": "if",
            "required": true,
            "type": "else"
          },
          "required": true,
          "type": "else"
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
          "name": "str",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "str",
            "required": true,
            "type": "String"
          },
          "type": "String"
        },
        {
          "kind": 34,
          "name": "optStr",
          "scalar": {
            "kind": 4,
            "name": "optStr",
            "type": "String"
          },
          "type": "String"
        },
        {
          "kind": 34,
          "name": "u",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "u",
            "required": true,
            "type": "UInt"
          },
          "type": "UInt"
        },
        {
          "kind": 34,
          "name": "optU",
          "scalar": {
            "kind": 4,
            "name": "optU",
            "type": "UInt"
          },
          "type": "UInt"
        },
        {
          "kind": 34,
          "name": "u8",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "u8",
            "required": true,
            "type": "UInt8"
          },
          "type": "UInt8"
        },
        {
          "kind": 34,
          "name": "u16",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "u16",
            "required": true,
            "type": "UInt16"
          },
          "type": "UInt16"
        },
        {
          "kind": 34,
          "name": "u32",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "u32",
            "required": true,
            "type": "UInt32"
          },
          "type": "UInt32"
        },
        {
          "kind": 34,
          "name": "i",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "i",
            "required": true,
            "type": "Int"
          },
          "type": "Int"
        },
        {
          "kind": 34,
          "name": "i8",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "i8",
            "required": true,
            "type": "Int8"
          },
          "type": "Int8"
        },
        {
          "kind": 34,
          "name": "i16",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "i16",
            "required": true,
            "type": "Int16"
          },
          "type": "Int16"
        },
        {
          "kind": 34,
          "name": "i32",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "i32",
            "required": true,
            "type": "Int32"
          },
          "type": "Int32"
        },
        {
          "kind": 34,
          "name": "bigint",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "bigint",
            "required": true,
            "type": "BigInt"
          },
          "type": "BigInt"
        },
        {
          "kind": 34,
          "name": "optBigint",
          "scalar": {
            "kind": 4,
            "name": "optBigint",
            "type": "BigInt"
          },
          "type": "BigInt"
        },
        {
          "kind": 34,
          "name": "bignumber",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "bignumber",
            "required": true,
            "type": "BigNumber"
          },
          "type": "BigNumber"
        },
        {
          "kind": 34,
          "name": "optBignumber",
          "scalar": {
            "kind": 4,
            "name": "optBignumber",
            "type": "BigNumber"
          },
          "type": "BigNumber"
        },
        {
          "kind": 34,
          "name": "json",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "json",
            "required": true,
            "type": "JSON"
          },
          "type": "JSON"
        },
        {
          "kind": 34,
          "name": "optJson",
          "scalar": {
            "kind": 4,
            "name": "optJson",
            "type": "JSON"
          },
          "type": "JSON"
        },
        {
          "kind": 34,
          "name": "bytes",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "bytes",
            "required": true,
            "type": "Bytes"
          },
          "type": "Bytes"
        },
        {
          "kind": 34,
          "name": "optBytes",
          "scalar": {
            "kind": 4,
            "name": "optBytes",
            "type": "Bytes"
          },
          "type": "Bytes"
        },
        {
          "kind": 34,
          "name": "boolean",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "boolean",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        {
          "kind": 34,
          "name": "optBoolean",
          "scalar": {
            "kind": 4,
            "name": "optBoolean",
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        {
          "array": {
            "item": {
              "kind": 4,
              "name": "u_array",
              "required": true,
              "type": "UInt"
            },
            "kind": 18,
            "name": "u_array",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "u_array",
              "required": true,
              "type": "UInt"
            },
            "type": "[UInt]"
          },
          "kind": 34,
          "name": "u_array",
          "required": true,
          "type": "[UInt]"
        },
        {
          "array": {
            "item": {
              "kind": 4,
              "name": "uOpt_array",
              "required": true,
              "type": "UInt"
            },
            "kind": 18,
            "name": "uOpt_array",
            "scalar": {
              "kind": 4,
              "name": "uOpt_array",
              "required": true,
              "type": "UInt"
            },
            "type": "[UInt]"
          },
          "kind": 34,
          "name": "uOpt_array",
          "type": "[UInt]"
        },
        {
          "array": {
            "item": {
              "kind": 4,
              "name": "_opt_uOptArray",
              "type": "UInt"
            },
            "kind": 18,
            "name": "_opt_uOptArray",
            "scalar": {
              "kind": 4,
              "name": "_opt_uOptArray",
              "type": "UInt"
            },
            "type": "[UInt]"
          },
          "kind": 34,
          "name": "_opt_uOptArray",
          "type": "[UInt]"
        },
        {
          "array": {
            "item": {
              "kind": 4,
              "name": "optStrOptArray",
              "type": "String"
            },
            "kind": 18,
            "name": "optStrOptArray",
            "scalar": {
              "kind": 4,
              "name": "optStrOptArray",
              "type": "String"
            },
            "type": "[String]"
          },
          "kind": 34,
          "name": "optStrOptArray",
          "type": "[String]"
        },
        {
          "array": {
            "array": {
              "item": {
                "kind": 4,
                "name": "uArrayArray",
                "required": true,
                "type": "UInt"
              },
              "kind": 18,
              "name": "uArrayArray",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "uArrayArray",
                "required": true,
                "type": "UInt"
              },
              "type": "[UInt]"
            },
            "item": {
              "item": {
                "kind": 4,
                "name": "uArrayArray",
                "required": true,
                "type": "UInt"
              },
              "kind": 18,
              "name": "uArrayArray",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "uArrayArray",
                "required": true,
                "type": "UInt"
              },
              "type": "[UInt]"
            },
            "kind": 18,
            "name": "uArrayArray",
            "required": true,
            "type": "[[UInt]]"
          },
          "kind": 34,
          "name": "uArrayArray",
          "required": true,
          "type": "[[UInt]]"
        },
        {
          "array": {
            "array": {
              "item": {
                "kind": 4,
                "name": "uOptArrayOptArray",
                "type": "UInt32"
              },
              "kind": 18,
              "name": "uOptArrayOptArray",
              "scalar": {
                "kind": 4,
                "name": "uOptArrayOptArray",
                "type": "UInt32"
              },
              "type": "[UInt32]"
            },
            "item": {
              "item": {
                "kind": 4,
                "name": "uOptArrayOptArray",
                "type": "UInt32"
              },
              "kind": 18,
              "name": "uOptArrayOptArray",
              "scalar": {
                "kind": 4,
                "name": "uOptArrayOptArray",
                "type": "UInt32"
              },
              "type": "[UInt32]"
            },
            "kind": 18,
            "name": "uOptArrayOptArray",
            "required": true,
            "type": "[[UInt32]]"
          },
          "kind": 34,
          "name": "uOptArrayOptArray",
          "required": true,
          "type": "[[UInt32]]"
        },
        {
          "array": {
            "array": {
              "array": {
                "item": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "kind": 18,
                "name": "uArrayOptArrayArray",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "type": "[UInt32]"
              },
              "item": {
                "item": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "kind": 18,
                "name": "uArrayOptArrayArray",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "type": "[UInt32]"
              },
              "kind": 18,
              "name": "uArrayOptArrayArray",
              "type": "[[UInt32]]"
            },
            "item": {
              "array": {
                "item": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "kind": 18,
                "name": "uArrayOptArrayArray",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "type": "[UInt32]"
              },
              "item": {
                "item": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "kind": 18,
                "name": "uArrayOptArrayArray",
                "required": true,
                "scalar": {
                  "kind": 4,
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "type": "UInt32"
                },
                "type": "[UInt32]"
              },
              "kind": 18,
              "name": "uArrayOptArrayArray",
              "type": "[[UInt32]]"
            },
            "kind": 18,
            "name": "uArrayOptArrayArray",
            "required": true,
            "type": "[[[UInt32]]]"
          },
          "kind": 34,
          "name": "uArrayOptArrayArray",
          "required": true,
          "type": "[[[UInt32]]]"
        },
        {
          "array": {
            "array": {
              "array": {
                "array": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "item": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "kind": 18,
                "name": "crazyArray",
                "required": true,
                "type": "[[UInt32]]"
              },
              "item": {
                "array": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "item": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "kind": 18,
                "name": "crazyArray",
                "required": true,
                "type": "[[UInt32]]"
              },
              "kind": 18,
              "name": "crazyArray",
              "type": "[[[UInt32]]]"
            },
            "item": {
              "array": {
                "array": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "item": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "kind": 18,
                "name": "crazyArray",
                "required": true,
                "type": "[[UInt32]]"
              },
              "item": {
                "array": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "item": {
                  "item": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "kind": 18,
                  "name": "crazyArray",
                  "scalar": {
                    "kind": 4,
                    "name": "crazyArray",
                    "required": true,
                    "type": "UInt32"
                  },
                  "type": "[UInt32]"
                },
                "kind": 18,
                "name": "crazyArray",
                "required": true,
                "type": "[[UInt32]]"
              },
              "kind": 18,
              "name": "crazyArray",
              "type": "[[[UInt32]]]"
            },
            "kind": 18,
            "name": "crazyArray",
            "type": "[[[[UInt32]]]]"
          },
          "kind": 34,
          "name": "crazyArray",
          "type": "[[[[UInt32]]]]"
        },
        {
          "kind": 34,
          "name": "object",
          "object": {
            "kind": 8192,
            "name": "object",
            "required": true,
            "type": "AnotherType"
          },
          "required": true,
          "type": "AnotherType"
        },
        {
          "kind": 34,
          "name": "optObject",
          "object": {
            "kind": 8192,
            "name": "optObject",
            "type": "AnotherType"
          },
          "type": "AnotherType"
        },
        {
          "array": {
            "item": {
              "kind": 8192,
              "name": "objectArray",
              "required": true,
              "type": "AnotherType"
            },
            "kind": 18,
            "name": "objectArray",
            "object": {
              "kind": 8192,
              "name": "objectArray",
              "required": true,
              "type": "AnotherType"
            },
            "required": true,
            "type": "[AnotherType]"
          },
          "kind": 34,
          "name": "objectArray",
          "required": true,
          "type": "[AnotherType]"
        },
        {
          "array": {
            "item": {
              "kind": 8192,
              "name": "optObjectArray",
              "type": "AnotherType"
            },
            "kind": 18,
            "name": "optObjectArray",
            "object": {
              "kind": 8192,
              "name": "optObjectArray",
              "type": "AnotherType"
            },
            "type": "[AnotherType]"
          },
          "kind": 34,
          "name": "optObjectArray",
          "type": "[AnotherType]"
        },
        {
          "enum": {
            "kind": 16384,
            "name": "en",
            "required": true,
            "type": "CustomEnum"
          },
          "kind": 34,
          "name": "en",
          "required": true,
          "type": "CustomEnum"
        },
        {
          "enum": {
            "kind": 16384,
            "name": "optEnum",
            "type": "CustomEnum"
          },
          "kind": 34,
          "name": "optEnum",
          "type": "CustomEnum"
        },
        {
          "array": {
            "enum": {
              "kind": 16384,
              "name": "enumArray",
              "required": true,
              "type": "CustomEnum"
            },
            "item": {
              "kind": 16384,
              "name": "enumArray",
              "required": true,
              "type": "CustomEnum"
            },
            "kind": 18,
            "name": "enumArray",
            "required": true,
            "type": "[CustomEnum]"
          },
          "kind": 34,
          "name": "enumArray",
          "required": true,
          "type": "[CustomEnum]"
        },
        {
          "array": {
            "enum": {
              "kind": 16384,
              "name": "optEnumArray",
              "type": "CustomEnum"
            },
            "item": {
              "kind": 16384,
              "name": "optEnumArray",
              "type": "CustomEnum"
            },
            "kind": 18,
            "name": "optEnumArray",
            "type": "[CustomEnum]"
          },
          "kind": 34,
          "name": "optEnumArray",
          "type": "[CustomEnum]"
        },
        {
          "kind": 34,
          "map": {
            "key": {
              "kind": 4,
              "name": "map",
              "required": true,
              "type": "String"
            },
            "kind": 262146,
            "name": "map",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "map",
              "required": true,
              "type": "Int"
            },
            "type": "Map<String, Int>",
            "value": {
              "kind": 4,
              "name": "map",
              "required": true,
              "type": "Int"
            }
          },
          "name": "map",
          "required": true,
          "type": "Map<String, Int>"
        },
        {
          "kind": 34,
          "map": {
            "array": {
              "item": {
                "kind": 4,
                "name": "mapOfArr",
                "required": true,
                "type": "Int"
              },
              "kind": 18,
              "name": "mapOfArr",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "mapOfArr",
                "required": true,
                "type": "Int"
              },
              "type": "[Int]"
            },
            "key": {
              "kind": 4,
              "name": "mapOfArr",
              "required": true,
              "type": "String"
            },
            "kind": 262146,
            "name": "mapOfArr",
            "required": true,
            "type": "Map<String, [Int]>",
            "value": {
              "item": {
                "kind": 4,
                "name": "mapOfArr",
                "required": true,
                "type": "Int"
              },
              "kind": 18,
              "name": "mapOfArr",
              "required": true,
              "scalar": {
                "kind": 4,
                "name": "mapOfArr",
                "required": true,
                "type": "Int"
              },
              "type": "[Int]"
            }
          },
          "name": "mapOfArr",
          "required": true,
          "type": "Map<String, [Int]>"
        },
        {
          "kind": 34,
          "map": {
            "key": {
              "kind": 4,
              "name": "mapOfObj",
              "required": true,
              "type": "String"
            },
            "kind": 262146,
            "name": "mapOfObj",
            "object": {
              "kind": 8192,
              "name": "mapOfObj",
              "required": true,
              "type": "AnotherType"
            },
            "required": true,
            "type": "Map<String, AnotherType>",
            "value": {
              "kind": 8192,
              "name": "mapOfObj",
              "required": true,
              "type": "AnotherType"
            }
          },
          "name": "mapOfObj",
          "required": true,
          "type": "Map<String, AnotherType>"
        },
        {
          "kind": 34,
          "map": {
            "array": {
              "item": {
                "kind": 8192,
                "name": "mapOfArrOfObj",
                "required": true,
                "type": "AnotherType"
              },
              "kind": 18,
              "name": "mapOfArrOfObj",
              "object": {
                "kind": 8192,
                "name": "mapOfArrOfObj",
                "required": true,
                "type": "AnotherType"
              },
              "required": true,
              "type": "[AnotherType]"
            },
            "key": {
              "kind": 4,
              "name": "mapOfArrOfObj",
              "required": true,
              "type": "String"
            },
            "kind": 262146,
            "name": "mapOfArrOfObj",
            "required": true,
            "type": "Map<String, [AnotherType]>",
            "value": {
              "item": {
                "kind": 8192,
                "name": "mapOfArrOfObj",
                "required": true,
                "type": "AnotherType"
              },
              "kind": 18,
              "name": "mapOfArrOfObj",
              "object": {
                "kind": 8192,
                "name": "mapOfArrOfObj",
                "required": true,
                "type": "AnotherType"
              },
              "required": true,
              "type": "[AnotherType]"
            }
          },
          "name": "mapOfArrOfObj",
          "required": true,
          "type": "Map<String, [AnotherType]>"
        },
        {
          "kind": 34,
          "map": {
            "key": {
              "kind": 4,
              "name": "mapCustomValue",
              "required": true,
              "type": "String"
            },
            "kind": 262146,
            "name": "mapCustomValue",
            "object": {
              "kind": 8192,
              "name": "mapCustomValue",
              "type": "CustomMapValue"
            },
            "required": true,
            "type": "Map<String, CustomMapValue>",
            "value": {
              "kind": 8192,
              "name": "mapCustomValue",
              "type": "CustomMapValue"
            }
          },
          "name": "mapCustomValue",
          "required": true,
          "type": "Map<String, CustomMapValue>"
        }
      ],
      "type": "CustomType"
    },
    {
      "kind": 1,
      "properties": [
        {
          "kind": 34,
          "name": "prop",
          "scalar": {
            "kind": 4,
            "name": "prop",
            "type": "String"
          },
          "type": "String"
        },
        {
          "kind": 34,
          "name": "circular",
          "object": {
            "kind": 8192,
            "name": "circular",
            "type": "CustomType"
          },
          "type": "CustomType"
        },
        {
          "kind": 34,
          "name": "const",
          "scalar": {
            "kind": 4,
            "name": "const",
            "type": "String"
          },
          "type": "String"
        }
      ],
      "type": "AnotherType"
    },
    {
      "kind": 1,
      "properties": [
        {
          "kind": 34,
          "name": "foo",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "foo",
            "required": true,
            "type": "String"
          },
          "type": "String"
        }
      ],
      "type": "CustomMapValue"
    },
    {
      "kind": 1,
      "properties": [
        {
          "kind": 34,
          "name": "else",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "else",
            "required": true,
            "type": "String"
          },
          "type": "String"
        }
      ],
      "type": "else"
    }
  ],
  "version": "0.1"
})).unwrap()
  }
}
