/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const wrapManifest: WrapManifest = {
  name: "Test",
  type: "plugin",
  version: "0.1",
  abi: {
  "objectTypes": [
    {
      "type": "CustomType",
      "kind": 1,
      "properties": [
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
        },
        {
          "type": "String",
          "name": "optStr",
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "optStr",
            "kind": 4
          }
        },
        {
          "type": "UInt",
          "name": "u",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "UInt",
            "name": "u",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "UInt",
          "name": "optU",
          "kind": 34,
          "scalar": {
            "type": "UInt",
            "name": "optU",
            "kind": 4
          }
        },
        {
          "type": "UInt8",
          "name": "u8",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "UInt8",
            "name": "u8",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "UInt16",
          "name": "u16",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "UInt16",
            "name": "u16",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "UInt32",
          "name": "u32",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "UInt32",
            "name": "u32",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "Int",
          "name": "i",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Int",
            "name": "i",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "Int8",
          "name": "i8",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Int8",
            "name": "i8",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "Int16",
          "name": "i16",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Int16",
            "name": "i16",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "Int32",
          "name": "i32",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Int32",
            "name": "i32",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "BigInt",
          "name": "bigint",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "BigInt",
            "name": "bigint",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "BigInt",
          "name": "optBigint",
          "kind": 34,
          "scalar": {
            "type": "BigInt",
            "name": "optBigint",
            "kind": 4
          }
        },
        {
          "type": "BigNumber",
          "name": "bignumber",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "BigNumber",
            "name": "bignumber",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "BigNumber",
          "name": "optBignumber",
          "kind": 34,
          "scalar": {
            "type": "BigNumber",
            "name": "optBignumber",
            "kind": 4
          }
        },
        {
          "type": "JSON",
          "name": "json",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "JSON",
            "name": "json",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "JSON",
          "name": "optJson",
          "kind": 34,
          "scalar": {
            "type": "JSON",
            "name": "optJson",
            "kind": 4
          }
        },
        {
          "type": "Bytes",
          "name": "bytes",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Bytes",
            "name": "bytes",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "Bytes",
          "name": "optBytes",
          "kind": 34,
          "scalar": {
            "type": "Bytes",
            "name": "optBytes",
            "kind": 4
          }
        },
        {
          "type": "Boolean",
          "name": "boolean",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Boolean",
            "name": "boolean",
            "required": true,
            "kind": 4
          }
        },
        {
          "type": "Boolean",
          "name": "optBoolean",
          "kind": 34,
          "scalar": {
            "type": "Boolean",
            "name": "optBoolean",
            "kind": 4
          }
        },
        {
          "type": "[UInt]",
          "name": "uArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[UInt]",
            "name": "uArray",
            "required": true,
            "kind": 18,
            "scalar": {
              "type": "UInt",
              "name": "uArray",
              "required": true,
              "kind": 4
            },
            "item": {
              "type": "UInt",
              "name": "uArray",
              "required": true,
              "kind": 4
            }
          }
        },
        {
          "type": "[UInt]",
          "name": "uOptArray",
          "kind": 34,
          "array": {
            "type": "[UInt]",
            "name": "uOptArray",
            "kind": 18,
            "scalar": {
              "type": "UInt",
              "name": "uOptArray",
              "required": true,
              "kind": 4
            },
            "item": {
              "type": "UInt",
              "name": "uOptArray",
              "required": true,
              "kind": 4
            }
          }
        },
        {
          "type": "[UInt]",
          "name": "optUOptArray",
          "kind": 34,
          "array": {
            "type": "[UInt]",
            "name": "optUOptArray",
            "kind": 18,
            "scalar": {
              "type": "UInt",
              "name": "optUOptArray",
              "kind": 4
            },
            "item": {
              "type": "UInt",
              "name": "optUOptArray",
              "kind": 4
            }
          }
        },
        {
          "type": "[String]",
          "name": "optStrOptArray",
          "kind": 34,
          "array": {
            "type": "[String]",
            "name": "optStrOptArray",
            "kind": 18,
            "scalar": {
              "type": "String",
              "name": "optStrOptArray",
              "kind": 4
            },
            "item": {
              "type": "String",
              "name": "optStrOptArray",
              "kind": 4
            }
          }
        },
        {
          "type": "[[UInt]]",
          "name": "uArrayArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[[UInt]]",
            "name": "uArrayArray",
            "required": true,
            "kind": 18,
            "array": {
              "type": "[UInt]",
              "name": "uArrayArray",
              "required": true,
              "kind": 18,
              "scalar": {
                "type": "UInt",
                "name": "uArrayArray",
                "required": true,
                "kind": 4
              },
              "item": {
                "type": "UInt",
                "name": "uArrayArray",
                "required": true,
                "kind": 4
              }
            },
            "item": {
              "type": "[UInt]",
              "name": "uArrayArray",
              "required": true,
              "kind": 18,
              "scalar": {
                "type": "UInt",
                "name": "uArrayArray",
                "required": true,
                "kind": 4
              },
              "item": {
                "type": "UInt",
                "name": "uArrayArray",
                "required": true,
                "kind": 4
              }
            }
          }
        },
        {
          "type": "[[UInt32]]",
          "name": "uOptArrayOptArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[[UInt32]]",
            "name": "uOptArrayOptArray",
            "required": true,
            "kind": 18,
            "array": {
              "type": "[UInt32]",
              "name": "uOptArrayOptArray",
              "kind": 18,
              "scalar": {
                "type": "UInt32",
                "name": "uOptArrayOptArray",
                "kind": 4
              },
              "item": {
                "type": "UInt32",
                "name": "uOptArrayOptArray",
                "kind": 4
              }
            },
            "item": {
              "type": "[UInt32]",
              "name": "uOptArrayOptArray",
              "kind": 18,
              "scalar": {
                "type": "UInt32",
                "name": "uOptArrayOptArray",
                "kind": 4
              },
              "item": {
                "type": "UInt32",
                "name": "uOptArrayOptArray",
                "kind": 4
              }
            }
          }
        },
        {
          "type": "[[[UInt32]]]",
          "name": "uArrayOptArrayArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[[[UInt32]]]",
            "name": "uArrayOptArrayArray",
            "required": true,
            "kind": 18,
            "array": {
              "type": "[[UInt32]]",
              "name": "uArrayOptArrayArray",
              "kind": 18,
              "array": {
                "type": "[UInt32]",
                "name": "uArrayOptArrayArray",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                }
              },
              "item": {
                "type": "[UInt32]",
                "name": "uArrayOptArrayArray",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                }
              }
            },
            "item": {
              "type": "[[UInt32]]",
              "name": "uArrayOptArrayArray",
              "kind": 18,
              "array": {
                "type": "[UInt32]",
                "name": "uArrayOptArrayArray",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                }
              },
              "item": {
                "type": "[UInt32]",
                "name": "uArrayOptArrayArray",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "UInt32",
                  "name": "uArrayOptArrayArray",
                  "required": true,
                  "kind": 4
                }
              }
            }
          }
        },
        {
          "type": "[[[[UInt32]]]]",
          "name": "crazyArray",
          "kind": 34,
          "array": {
            "type": "[[[[UInt32]]]]",
            "name": "crazyArray",
            "kind": 18,
            "array": {
              "type": "[[[UInt32]]]",
              "name": "crazyArray",
              "kind": 18,
              "array": {
                "type": "[[UInt32]]",
                "name": "crazyArray",
                "required": true,
                "kind": 18,
                "array": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                },
                "item": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                }
              },
              "item": {
                "type": "[[UInt32]]",
                "name": "crazyArray",
                "required": true,
                "kind": 18,
                "array": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                },
                "item": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                }
              }
            },
            "item": {
              "type": "[[[UInt32]]]",
              "name": "crazyArray",
              "kind": 18,
              "array": {
                "type": "[[UInt32]]",
                "name": "crazyArray",
                "required": true,
                "kind": 18,
                "array": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                },
                "item": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                }
              },
              "item": {
                "type": "[[UInt32]]",
                "name": "crazyArray",
                "required": true,
                "kind": 18,
                "array": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                },
                "item": {
                  "type": "[UInt32]",
                  "name": "crazyArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt32",
                    "name": "crazyArray",
                    "required": true,
                    "kind": 4
                  }
                }
              }
            }
          }
        },
        {
          "type": "AnotherType",
          "name": "object",
          "required": true,
          "kind": 34,
          "object": {
            "type": "AnotherType",
            "name": "object",
            "required": true,
            "kind": 8192
          }
        },
        {
          "type": "AnotherType",
          "name": "optObject",
          "kind": 34,
          "object": {
            "type": "AnotherType",
            "name": "optObject",
            "kind": 8192
          }
        },
        {
          "type": "[AnotherType]",
          "name": "objectArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[AnotherType]",
            "name": "objectArray",
            "required": true,
            "kind": 18,
            "object": {
              "type": "AnotherType",
              "name": "objectArray",
              "required": true,
              "kind": 8192
            },
            "item": {
              "type": "AnotherType",
              "name": "objectArray",
              "required": true,
              "kind": 8192
            }
          }
        },
        {
          "type": "[AnotherType]",
          "name": "optObjectArray",
          "kind": 34,
          "array": {
            "type": "[AnotherType]",
            "name": "optObjectArray",
            "kind": 18,
            "object": {
              "type": "AnotherType",
              "name": "optObjectArray",
              "kind": 8192
            },
            "item": {
              "type": "AnotherType",
              "name": "optObjectArray",
              "kind": 8192
            }
          }
        },
        {
          "type": "CustomEnum",
          "name": "en",
          "required": true,
          "kind": 34,
          "enum": {
            "type": "CustomEnum",
            "name": "en",
            "required": true,
            "kind": 16384
          }
        },
        {
          "type": "CustomEnum",
          "name": "optEnum",
          "kind": 34,
          "enum": {
            "type": "CustomEnum",
            "name": "optEnum",
            "kind": 16384
          }
        },
        {
          "type": "[CustomEnum]",
          "name": "enumArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[CustomEnum]",
            "name": "enumArray",
            "required": true,
            "kind": 18,
            "enum": {
              "type": "CustomEnum",
              "name": "enumArray",
              "required": true,
              "kind": 16384
            },
            "item": {
              "type": "CustomEnum",
              "name": "enumArray",
              "required": true,
              "kind": 16384
            }
          }
        },
        {
          "type": "[CustomEnum]",
          "name": "optEnumArray",
          "kind": 34,
          "array": {
            "type": "[CustomEnum]",
            "name": "optEnumArray",
            "kind": 18,
            "enum": {
              "type": "CustomEnum",
              "name": "optEnumArray",
              "kind": 16384
            },
            "item": {
              "type": "CustomEnum",
              "name": "optEnumArray",
              "kind": 16384
            }
          }
        },
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
              "required": true,
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
              "required": true,
              "kind": 4
            }
          }
        },
        {
          "type": "Map<String, [Int]>",
          "name": "mapOfArr",
          "required": true,
          "kind": 34,
          "map": {
            "type": "Map<String, [Int]>",
            "name": "mapOfArr",
            "required": true,
            "kind": 262146,
            "array": {
              "type": "[Int]",
              "name": "mapOfArr",
              "required": true,
              "kind": 18,
              "scalar": {
                "type": "Int",
                "name": "mapOfArr",
                "required": true,
                "kind": 4
              },
              "item": {
                "type": "Int",
                "name": "mapOfArr",
                "required": true,
                "kind": 4
              }
            },
            "key": {
              "type": "String",
              "name": "mapOfArr",
              "required": true,
              "kind": 4
            },
            "value": {
              "type": "[Int]",
              "name": "mapOfArr",
              "required": true,
              "kind": 18,
              "scalar": {
                "type": "Int",
                "name": "mapOfArr",
                "required": true,
                "kind": 4
              },
              "item": {
                "type": "Int",
                "name": "mapOfArr",
                "required": true,
                "kind": 4
              }
            }
          }
        },
        {
          "type": "Map<String, AnotherType>",
          "name": "mapOfObj",
          "required": true,
          "kind": 34,
          "map": {
            "type": "Map<String, AnotherType>",
            "name": "mapOfObj",
            "required": true,
            "kind": 262146,
            "object": {
              "type": "AnotherType",
              "name": "mapOfObj",
              "required": true,
              "kind": 8192
            },
            "key": {
              "type": "String",
              "name": "mapOfObj",
              "required": true,
              "kind": 4
            },
            "value": {
              "type": "AnotherType",
              "name": "mapOfObj",
              "required": true,
              "kind": 8192
            }
          }
        },
        {
          "type": "Map<String, [AnotherType]>",
          "name": "mapOfArrOfObj",
          "required": true,
          "kind": 34,
          "map": {
            "type": "Map<String, [AnotherType]>",
            "name": "mapOfArrOfObj",
            "required": true,
            "kind": 262146,
            "array": {
              "type": "[AnotherType]",
              "name": "mapOfArrOfObj",
              "required": true,
              "kind": 18,
              "object": {
                "type": "AnotherType",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 8192
              },
              "item": {
                "type": "AnotherType",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 8192
              }
            },
            "key": {
              "type": "String",
              "name": "mapOfArrOfObj",
              "required": true,
              "kind": 4
            },
            "value": {
              "type": "[AnotherType]",
              "name": "mapOfArrOfObj",
              "required": true,
              "kind": 18,
              "object": {
                "type": "AnotherType",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 8192
              },
              "item": {
                "type": "AnotherType",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 8192
              }
            }
          }
        }
      ]
    },
    {
      "type": "AnotherType",
      "kind": 1,
      "properties": [
        {
          "type": "String",
          "name": "prop",
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "prop",
            "kind": 4
          }
        },
        {
          "type": "CustomType",
          "name": "circular",
          "kind": 34,
          "object": {
            "type": "CustomType",
            "name": "circular",
            "kind": 8192
          }
        },
        {
          "type": "String",
          "name": "const",
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "const",
            "kind": 4
          }
        }
      ]
    }
  ],
  "moduleType": {
    "type": "Module",
    "kind": 128,
    "methods": [
      {
        "type": "Method",
        "name": "moduleMethod",
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
          },
          {
            "type": "String",
            "name": "optStr",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "optStr",
              "kind": 4
            }
          },
          {
            "type": "CustomEnum",
            "name": "en",
            "required": true,
            "kind": 34,
            "enum": {
              "type": "CustomEnum",
              "name": "en",
              "required": true,
              "kind": 16384
            }
          },
          {
            "type": "CustomEnum",
            "name": "optEnum",
            "kind": 34,
            "enum": {
              "type": "CustomEnum",
              "name": "optEnum",
              "kind": 16384
            }
          },
          {
            "type": "[CustomEnum]",
            "name": "enumArray",
            "required": true,
            "kind": 34,
            "array": {
              "type": "[CustomEnum]",
              "name": "enumArray",
              "required": true,
              "kind": 18,
              "enum": {
                "type": "CustomEnum",
                "name": "enumArray",
                "required": true,
                "kind": 16384
              },
              "item": {
                "type": "CustomEnum",
                "name": "enumArray",
                "required": true,
                "kind": 16384
              }
            }
          },
          {
            "type": "[CustomEnum]",
            "name": "optEnumArray",
            "kind": 34,
            "array": {
              "type": "[CustomEnum]",
              "name": "optEnumArray",
              "kind": 18,
              "enum": {
                "type": "CustomEnum",
                "name": "optEnumArray",
                "kind": 16384
              },
              "item": {
                "type": "CustomEnum",
                "name": "optEnumArray",
                "kind": 16384
              }
            }
          },
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
                "required": true,
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
                "required": true,
                "kind": 4
              }
            }
          },
          {
            "type": "Map<String, [Int]>",
            "name": "mapOfArr",
            "required": true,
            "kind": 34,
            "map": {
              "type": "Map<String, [Int]>",
              "name": "mapOfArr",
              "required": true,
              "kind": 262146,
              "array": {
                "type": "[Int]",
                "name": "mapOfArr",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "Int",
                  "name": "mapOfArr",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "Int",
                  "name": "mapOfArr",
                  "required": true,
                  "kind": 4
                }
              },
              "key": {
                "type": "String",
                "name": "mapOfArr",
                "required": true,
                "kind": 4
              },
              "value": {
                "type": "[Int]",
                "name": "mapOfArr",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "Int",
                  "name": "mapOfArr",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "Int",
                  "name": "mapOfArr",
                  "required": true,
                  "kind": 4
                }
              }
            }
          },
          {
            "type": "Map<String, AnotherType>",
            "name": "mapOfObj",
            "required": true,
            "kind": 34,
            "map": {
              "type": "Map<String, AnotherType>",
              "name": "mapOfObj",
              "required": true,
              "kind": 262146,
              "object": {
                "type": "AnotherType",
                "name": "mapOfObj",
                "required": true,
                "kind": 8192
              },
              "key": {
                "type": "String",
                "name": "mapOfObj",
                "required": true,
                "kind": 4
              },
              "value": {
                "type": "AnotherType",
                "name": "mapOfObj",
                "required": true,
                "kind": 8192
              }
            }
          },
          {
            "type": "Map<String, [AnotherType]>",
            "name": "mapOfArrOfObj",
            "required": true,
            "kind": 34,
            "map": {
              "type": "Map<String, [AnotherType]>",
              "name": "mapOfArrOfObj",
              "required": true,
              "kind": 262146,
              "array": {
                "type": "[AnotherType]",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 18,
                "object": {
                  "type": "AnotherType",
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "kind": 8192
                },
                "item": {
                  "type": "AnotherType",
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "kind": 8192
                }
              },
              "key": {
                "type": "String",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 4
              },
              "value": {
                "type": "[AnotherType]",
                "name": "mapOfArrOfObj",
                "required": true,
                "kind": 18,
                "object": {
                  "type": "AnotherType",
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "kind": 8192
                },
                "item": {
                  "type": "AnotherType",
                  "name": "mapOfArrOfObj",
                  "required": true,
                  "kind": 8192
                }
              }
            }
          }
        ],
        "return": {
          "type": "Int",
          "name": "moduleMethod",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "Int",
            "name": "moduleMethod",
            "required": true,
            "kind": 4
          }
        }
      },
      {
        "type": "Method",
        "name": "objectMethod",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "AnotherType",
            "name": "object",
            "required": true,
            "kind": 34,
            "object": {
              "type": "AnotherType",
              "name": "object",
              "required": true,
              "kind": 8192
            }
          },
          {
            "type": "AnotherType",
            "name": "optObject",
            "kind": 34,
            "object": {
              "type": "AnotherType",
              "name": "optObject",
              "kind": 8192
            }
          },
          {
            "type": "[AnotherType]",
            "name": "objectArray",
            "required": true,
            "kind": 34,
            "array": {
              "type": "[AnotherType]",
              "name": "objectArray",
              "required": true,
              "kind": 18,
              "object": {
                "type": "AnotherType",
                "name": "objectArray",
                "required": true,
                "kind": 8192
              },
              "item": {
                "type": "AnotherType",
                "name": "objectArray",
                "required": true,
                "kind": 8192
              }
            }
          },
          {
            "type": "[AnotherType]",
            "name": "optObjectArray",
            "kind": 34,
            "array": {
              "type": "[AnotherType]",
              "name": "optObjectArray",
              "kind": 18,
              "object": {
                "type": "AnotherType",
                "name": "optObjectArray",
                "kind": 8192
              },
              "item": {
                "type": "AnotherType",
                "name": "optObjectArray",
                "kind": 8192
              }
            }
          }
        ],
        "return": {
          "type": "AnotherType",
          "name": "objectMethod",
          "kind": 34,
          "object": {
            "type": "AnotherType",
            "name": "objectMethod",
            "kind": 8192
          }
        },
        "env": {
          "required": true
        }
      },
      {
        "type": "Method",
        "name": "optionalEnvMethod",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "AnotherType",
            "name": "object",
            "required": true,
            "kind": 34,
            "object": {
              "type": "AnotherType",
              "name": "object",
              "required": true,
              "kind": 8192
            }
          },
          {
            "type": "AnotherType",
            "name": "optObject",
            "kind": 34,
            "object": {
              "type": "AnotherType",
              "name": "optObject",
              "kind": 8192
            }
          },
          {
            "type": "[AnotherType]",
            "name": "objectArray",
            "required": true,
            "kind": 34,
            "array": {
              "type": "[AnotherType]",
              "name": "objectArray",
              "required": true,
              "kind": 18,
              "object": {
                "type": "AnotherType",
                "name": "objectArray",
                "required": true,
                "kind": 8192
              },
              "item": {
                "type": "AnotherType",
                "name": "objectArray",
                "required": true,
                "kind": 8192
              }
            }
          },
          {
            "type": "[AnotherType]",
            "name": "optObjectArray",
            "kind": 34,
            "array": {
              "type": "[AnotherType]",
              "name": "optObjectArray",
              "kind": 18,
              "object": {
                "type": "AnotherType",
                "name": "optObjectArray",
                "kind": 8192
              },
              "item": {
                "type": "AnotherType",
                "name": "optObjectArray",
                "kind": 8192
              }
            }
          }
        ],
        "return": {
          "type": "AnotherType",
          "name": "optionalEnvMethod",
          "kind": 34,
          "object": {
            "type": "AnotherType",
            "name": "optionalEnvMethod",
            "kind": 8192
          }
        },
        "env": {
          "required": false
        }
      }
    ],
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
      }
    ]
  },
  "enumTypes": [
    {
      "type": "CustomEnum",
      "kind": 8,
      "constants": [
        "STRING",
        "BYTES"
      ]
    }
  ],
  "interfaceTypes": [
    {
      "type": "TestImport",
      "kind": 32768,
      "namespace": "TestImport",
      "uri": "testimport.uri.eth",
      "nativeType": "Interface",
      "capabilities": {
        "getImplementations": {
          "enabled": true
        }
      }
    }
  ],
  "importedObjectTypes": [
    {
      "type": "TestImport_Object",
      "kind": 1025,
      "properties": [
        {
          "type": "TestImport_AnotherObject",
          "name": "object",
          "required": true,
          "kind": 34,
          "object": {
            "type": "TestImport_AnotherObject",
            "name": "object",
            "required": true,
            "kind": 8192
          }
        },
        {
          "type": "TestImport_AnotherObject",
          "name": "optObject",
          "kind": 34,
          "object": {
            "type": "TestImport_AnotherObject",
            "name": "optObject",
            "kind": 8192
          }
        },
        {
          "type": "[TestImport_AnotherObject]",
          "name": "objectArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[TestImport_AnotherObject]",
            "name": "objectArray",
            "required": true,
            "kind": 18,
            "object": {
              "type": "TestImport_AnotherObject",
              "name": "objectArray",
              "required": true,
              "kind": 8192
            },
            "item": {
              "type": "TestImport_AnotherObject",
              "name": "objectArray",
              "required": true,
              "kind": 8192
            }
          }
        },
        {
          "type": "[TestImport_AnotherObject]",
          "name": "optObjectArray",
          "kind": 34,
          "array": {
            "type": "[TestImport_AnotherObject]",
            "name": "optObjectArray",
            "kind": 18,
            "object": {
              "type": "TestImport_AnotherObject",
              "name": "optObjectArray",
              "kind": 8192
            },
            "item": {
              "type": "TestImport_AnotherObject",
              "name": "optObjectArray",
              "kind": 8192
            }
          }
        },
        {
          "type": "TestImport_Enum",
          "name": "en",
          "required": true,
          "kind": 34,
          "enum": {
            "type": "TestImport_Enum",
            "name": "en",
            "required": true,
            "kind": 16384
          }
        },
        {
          "type": "TestImport_Enum",
          "name": "optEnum",
          "kind": 34,
          "enum": {
            "type": "TestImport_Enum",
            "name": "optEnum",
            "kind": 16384
          }
        },
        {
          "type": "[TestImport_Enum]",
          "name": "enumArray",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[TestImport_Enum]",
            "name": "enumArray",
            "required": true,
            "kind": 18,
            "enum": {
              "type": "TestImport_Enum",
              "name": "enumArray",
              "required": true,
              "kind": 16384
            },
            "item": {
              "type": "TestImport_Enum",
              "name": "enumArray",
              "required": true,
              "kind": 16384
            }
          }
        },
        {
          "type": "[TestImport_Enum]",
          "name": "optEnumArray",
          "kind": 34,
          "array": {
            "type": "[TestImport_Enum]",
            "name": "optEnumArray",
            "kind": 18,
            "enum": {
              "type": "TestImport_Enum",
              "name": "optEnumArray",
              "kind": 16384
            },
            "item": {
              "type": "TestImport_Enum",
              "name": "optEnumArray",
              "kind": 16384
            }
          }
        }
      ],
      "uri": "testimport.uri.eth",
      "namespace": "TestImport",
      "nativeType": "Object"
    },
    {
      "type": "TestImport_AnotherObject",
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "prop",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "prop",
            "required": true,
            "kind": 4
          }
        }
      ],
      "uri": "testimport.uri.eth",
      "namespace": "TestImport",
      "nativeType": "AnotherObject"
    }
  ],
  "importedModuleTypes": [
    {
      "type": "TestImport_Module",
      "kind": 256,
      "methods": [
        {
          "type": "Method",
          "name": "importedMethod",
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
            },
            {
              "type": "String",
              "name": "optStr",
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "optStr",
                "kind": 4
              }
            },
            {
              "type": "UInt",
              "name": "u",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "UInt",
                "name": "u",
                "required": true,
                "kind": 4
              }
            },
            {
              "type": "UInt",
              "name": "optU",
              "kind": 34,
              "scalar": {
                "type": "UInt",
                "name": "optU",
                "kind": 4
              }
            },
            {
              "type": "[[UInt]]",
              "name": "uArrayArray",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[[UInt]]",
                "name": "uArrayArray",
                "required": true,
                "kind": 18,
                "array": {
                  "type": "[UInt]",
                  "name": "uArrayArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt",
                    "name": "uArrayArray",
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt",
                    "name": "uArrayArray",
                    "kind": 4
                  }
                },
                "item": {
                  "type": "[UInt]",
                  "name": "uArrayArray",
                  "kind": 18,
                  "scalar": {
                    "type": "UInt",
                    "name": "uArrayArray",
                    "kind": 4
                  },
                  "item": {
                    "type": "UInt",
                    "name": "uArrayArray",
                    "kind": 4
                  }
                }
              }
            },
            {
              "type": "TestImport_Object",
              "name": "object",
              "required": true,
              "kind": 34,
              "object": {
                "type": "TestImport_Object",
                "name": "object",
                "required": true,
                "kind": 8192
              }
            },
            {
              "type": "TestImport_Object",
              "name": "optObject",
              "kind": 34,
              "object": {
                "type": "TestImport_Object",
                "name": "optObject",
                "kind": 8192
              }
            },
            {
              "type": "[TestImport_Object]",
              "name": "objectArray",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[TestImport_Object]",
                "name": "objectArray",
                "required": true,
                "kind": 18,
                "object": {
                  "type": "TestImport_Object",
                  "name": "objectArray",
                  "required": true,
                  "kind": 8192
                },
                "item": {
                  "type": "TestImport_Object",
                  "name": "objectArray",
                  "required": true,
                  "kind": 8192
                }
              }
            },
            {
              "type": "[TestImport_Object]",
              "name": "optObjectArray",
              "kind": 34,
              "array": {
                "type": "[TestImport_Object]",
                "name": "optObjectArray",
                "kind": 18,
                "object": {
                  "type": "TestImport_Object",
                  "name": "optObjectArray",
                  "kind": 8192
                },
                "item": {
                  "type": "TestImport_Object",
                  "name": "optObjectArray",
                  "kind": 8192
                }
              }
            },
            {
              "type": "TestImport_Enum",
              "name": "en",
              "required": true,
              "kind": 34,
              "enum": {
                "type": "TestImport_Enum",
                "name": "en",
                "required": true,
                "kind": 16384
              }
            },
            {
              "type": "TestImport_Enum",
              "name": "optEnum",
              "kind": 34,
              "enum": {
                "type": "TestImport_Enum",
                "name": "optEnum",
                "kind": 16384
              }
            },
            {
              "type": "[TestImport_Enum]",
              "name": "enumArray",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[TestImport_Enum]",
                "name": "enumArray",
                "required": true,
                "kind": 18,
                "enum": {
                  "type": "TestImport_Enum",
                  "name": "enumArray",
                  "required": true,
                  "kind": 16384
                },
                "item": {
                  "type": "TestImport_Enum",
                  "name": "enumArray",
                  "required": true,
                  "kind": 16384
                }
              }
            },
            {
              "type": "[TestImport_Enum]",
              "name": "optEnumArray",
              "kind": 34,
              "array": {
                "type": "[TestImport_Enum]",
                "name": "optEnumArray",
                "kind": 18,
                "enum": {
                  "type": "TestImport_Enum",
                  "name": "optEnumArray",
                  "kind": 16384
                },
                "item": {
                  "type": "TestImport_Enum",
                  "name": "optEnumArray",
                  "kind": 16384
                }
              }
            }
          ],
          "return": {
            "type": "TestImport_Object",
            "name": "importedMethod",
            "kind": 34,
            "object": {
              "type": "TestImport_Object",
              "name": "importedMethod",
              "kind": 8192
            }
          },
          "env": {
            "required": true
          }
        },
        {
          "type": "Method",
          "name": "anotherMethod",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "[String]",
              "name": "arg",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "arg",
                "required": true,
                "kind": 18,
                "scalar": {
                  "type": "String",
                  "name": "arg",
                  "required": true,
                  "kind": 4
                },
                "item": {
                  "type": "String",
                  "name": "arg",
                  "required": true,
                  "kind": 4
                }
              }
            }
          ],
          "return": {
            "type": "Int32",
            "name": "anotherMethod",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "Int32",
              "name": "anotherMethod",
              "required": true,
              "kind": 4
            }
          }
        }
      ],
      "uri": "testimport.uri.eth",
      "namespace": "TestImport",
      "nativeType": "Module",
      "isInterface": true
    }
  ],
  "importedEnumTypes": [
    {
      "type": "TestImport_Enum",
      "kind": 520,
      "constants": [
        "STRING",
        "BYTES"
      ],
      "uri": "testimport.uri.eth",
      "namespace": "TestImport",
      "nativeType": "Enum"
    }
  ],
  "importedEnvTypes": [
    {
      "type": "TestImport_Env",
      "kind": 524288,
      "properties": [
        {
          "type": "String",
          "name": "enviroProp",
          "required": true,
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "enviroProp",
            "required": true,
            "kind": 4
          }
        }
      ],
      "uri": "testimport.uri.eth",
      "namespace": "TestImport",
      "nativeType": "Env"
    }
  ],
  "envType": {
    "type": "Env",
    "kind": 65536,
    "properties": [
      {
        "type": "String",
        "name": "prop",
        "required": true,
        "kind": 34,
        "scalar": {
          "type": "String",
          "name": "prop",
          "required": true,
          "kind": 4
        }
      },
      {
        "type": "String",
        "name": "optProp",
        "kind": 34,
        "scalar": {
          "type": "String",
          "name": "optProp",
          "kind": 4
        }
      },
      {
        "type": "Map<String, Int>",
        "name": "optMap",
        "kind": 34,
        "map": {
          "type": "Map<String, Int>",
          "name": "optMap",
          "kind": 262146,
          "scalar": {
            "type": "Int",
            "name": "optMap",
            "kind": 4
          },
          "key": {
            "type": "String",
            "name": "optMap",
            "required": true,
            "kind": 4
          },
          "value": {
            "type": "Int",
            "name": "optMap",
            "kind": 4
          }
        }
      }
    ]
  }
}
}
