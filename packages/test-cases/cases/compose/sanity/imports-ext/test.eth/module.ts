import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      type: "CustomType",
      kind: 1,
      properties: [
        {
          type: "String",
          name: "str",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "str",
            required: true,
            kind: 4
          }
        },
        {
          type: "String",
          name: "optStr",
          kind: 34,
          scalar: {
            type: "String",
            name: "optStr",
            kind: 4
          }
        },
        {
          type: "UInt",
          name: "u",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt",
            name: "u",
            required: true,
            kind: 4
          }
        },
        {
          type: "UInt",
          name: "optU",
          kind: 34,
          scalar: {
            type: "UInt",
            name: "optU",
            kind: 4
          }
        },
        {
          type: "UInt8",
          name: "u8",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt8",
            name: "u8",
            required: true,
            kind: 4
          }
        },
        {
          type: "UInt16",
          name: "u16",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt16",
            name: "u16",
            required: true,
            kind: 4
          }
        },
        {
          type: "UInt32",
          name: "u32",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt32",
            name: "u32",
            required: true,
            kind: 4
          }
        },
        {
          type: "Int",
          name: "i",
          required: true,
          kind: 34,
          scalar: {
            type: "Int",
            name: "i",
            required: true,
            kind: 4
          }
        },
        {
          type: "Int8",
          name: "i8",
          required: true,
          kind: 34,
          scalar: {
            type: "Int8",
            name: "i8",
            required: true,
            kind: 4
          }
        },
        {
          type: "Int16",
          name: "i16",
          required: true,
          kind: 34,
          scalar: {
            type: "Int16",
            name: "i16",
            required: true,
            kind: 4
          }
        },
        {
          type: "Int32",
          name: "i32",
          required: true,
          kind: 34,
          scalar: {
            type: "Int32",
            name: "i32",
            required: true,
            kind: 4
          }
        },
        {
          type: "Bytes",
          name: "bytes",
          required: true,
          kind: 34,
          scalar: {
            type: "Bytes",
            name: "bytes",
            required: true,
            kind: 4
          }
        },
        {
          type: "[UInt]",
          name: "uArray",
          required: true,
          kind: 34,
          array: {
            type: "[UInt]",
            name: "uArray",
            required: true,
            kind: 18,
            scalar: {
              type: "UInt",
              name: "uArray",
              required: true,
              kind: 4
            },
            item: {
              type: "UInt",
              name: "uArray",
              required: true,
              kind: 4
            }
          }
        },
        {
          type: "[UInt]",
          name: "uOptArray",
          kind: 34,
          array: {
            type: "[UInt]",
            name: "uOptArray",
            kind: 18,
            scalar: {
              type: "UInt",
              name: "uOptArray",
              required: true,
              kind: 4
            },
            item: {
              type: "UInt",
              name: "uOptArray",
              required: true,
              kind: 4
            }
          }
        },
        {
          type: "[UInt]",
          name: "optUOptArray",
          kind: 34,
          array: {
            type: "[UInt]",
            name: "optUOptArray",
            kind: 18,
            scalar: {
              type: "UInt",
              name: "optUOptArray",
              kind: 4
            },
            item: {
              type: "UInt",
              name: "optUOptArray",
              kind: 4
            }
          }
        },
        {
          type: "[String]",
          name: "optStrOptArray",
          kind: 34,
          array: {
            type: "[String]",
            name: "optStrOptArray",
            kind: 18,
            scalar: {
              type: "String",
              name: "optStrOptArray",
              kind: 4
            },
            item: {
              type: "String",
              name: "optStrOptArray",
              kind: 4
            }
          }
        },
        {
          type: "[[UInt]]",
          name: "uArrayArray",
          required: true,
          kind: 34,
          array: {
            type: "[[UInt]]",
            name: "uArrayArray",
            required: true,
            kind: 18,
            array: {
              type: "[UInt]",
              name: "uArrayArray",
              required: true,
              kind: 18,
              scalar: {
                type: "UInt",
                name: "uArrayArray",
                required: true,
                kind: 4
              },
              item: {
                type: "UInt",
                name: "uArrayArray",
                required: true,
                kind: 4
              }
            },
            item: {
              type: "[UInt]",
              name: "uArrayArray",
              required: true,
              kind: 18,
              scalar: {
                type: "UInt",
                name: "uArrayArray",
                required: true,
                kind: 4
              },
              item: {
                type: "UInt",
                name: "uArrayArray",
                required: true,
                kind: 4
              }
            }
          }
        },
        {
          type: "[[UInt32]]",
          name: "uOptArrayOptArray",
          required: true,
          kind: 34,
          array: {
            type: "[[UInt32]]",
            name: "uOptArrayOptArray",
            required: true,
            kind: 18,
            array: {
              type: "[UInt32]",
              name: "uOptArrayOptArray",
              kind: 18,
              scalar: {
                type: "UInt32",
                name: "uOptArrayOptArray",
                kind: 4
              },
              item: {
                type: "UInt32",
                name: "uOptArrayOptArray",
                kind: 4
              }
            },
            item: {
              type: "[UInt32]",
              name: "uOptArrayOptArray",
              kind: 18,
              scalar: {
                type: "UInt32",
                name: "uOptArrayOptArray",
                kind: 4
              },
              item: {
                type: "UInt32",
                name: "uOptArrayOptArray",
                kind: 4
              }
            }
          }
        },
        {
          type: "[[[UInt32]]]",
          name: "uArrayOptArrayArray",
          required: true,
          kind: 34,
          array: {
            type: "[[[UInt32]]]",
            name: "uArrayOptArrayArray",
            required: true,
            kind: 18,
            array: {
              type: "[[UInt32]]",
              name: "uArrayOptArrayArray",
              kind: 18,
              array: {
                type: "[UInt32]",
                name: "uArrayOptArrayArray",
                required: true,
                kind: 18,
                scalar: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                },
                item: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                }
              },
              item: {
                type: "[UInt32]",
                name: "uArrayOptArrayArray",
                required: true,
                kind: 18,
                scalar: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                },
                item: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                }
              }
            },
            item: {
              type: "[[UInt32]]",
              name: "uArrayOptArrayArray",
              kind: 18,
              array: {
                type: "[UInt32]",
                name: "uArrayOptArrayArray",
                required: true,
                kind: 18,
                scalar: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                },
                item: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                }
              },
              item: {
                type: "[UInt32]",
                name: "uArrayOptArrayArray",
                required: true,
                kind: 18,
                scalar: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                },
                item: {
                  type: "UInt32",
                  name: "uArrayOptArrayArray",
                  required: true,
                  kind: 4
                }
              }
            }
          }
        },
        {
          type: "[[[[UInt32]]]]",
          name: "crazyArray",
          kind: 34,
          array: {
            type: "[[[[UInt32]]]]",
            name: "crazyArray",
            kind: 18,
            array: {
              type: "[[[UInt32]]]",
              name: "crazyArray",
              kind: 18,
              array: {
                type: "[[UInt32]]",
                name: "crazyArray",
                required: true,
                kind: 18,
                array: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                },
                item: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                }
              },
              item: {
                type: "[[UInt32]]",
                name: "crazyArray",
                required: true,
                kind: 18,
                array: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                },
                item: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                }
              }
            },
            item: {
              type: "[[[UInt32]]]",
              name: "crazyArray",
              kind: 18,
              array: {
                type: "[[UInt32]]",
                name: "crazyArray",
                required: true,
                kind: 18,
                array: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                },
                item: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                }
              },
              item: {
                type: "[[UInt32]]",
                name: "crazyArray",
                required: true,
                kind: 18,
                array: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                },
                item: {
                  type: "[UInt32]",
                  name: "crazyArray",
                  kind: 18,
                  scalar: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  },
                  item: {
                    type: "UInt32",
                    name: "crazyArray",
                    required: true,
                    kind: 4
                  }
                }
              }
            }
          }
        },
        {
          type: "ObjectType",
          name: "object",
          required: true,
          kind: 34,
          object: {
            type: "ObjectType",
            name: "object",
            required: true,
            kind: 8192
          }
        },
        {
          type: "ObjectType",
          name: "optObject",
          kind: 34,
          object: {
            type: "ObjectType",
            name: "optObject",
            kind: 8192
          }
        },
        {
          type: "NestedObjectType",
          name: "nestedObject",
          required: true,
          kind: 34,
          object: {
            type: "NestedObjectType",
            name: "nestedObject",
            required: true,
            kind: 8192
          }
        },
        {
          type: "NestedObjectType",
          name: "optNestedObject",
          kind: 34,
          object: {
            type: "NestedObjectType",
            name: "optNestedObject",
            kind: 8192
          }
        },
        {
          type: "[NestedObjectType]",
          name: "optNestedObjectArray",
          required: true,
          kind: 34,
          array: {
            type: "[NestedObjectType]",
            name: "optNestedObjectArray",
            required: true,
            kind: 18,
            object: {
              type: "NestedObjectType",
              name: "optNestedObjectArray",
              kind: 8192
            },
            item: {
              type: "NestedObjectType",
              name: "optNestedObjectArray",
              kind: 8192
            }
          }
        },
        {
          type: "Imported_NestedObjectType",
          name: "importedNestedObject",
          required: true,
          kind: 34,
          object: {
            type: "Imported_NestedObjectType",
            name: "importedNestedObject",
            required: true,
            kind: 8192
          }
        },
        {
          type: "[Imported_NestedObjectType]",
          name: "optImportedNestedObjectArray",
          required: true,
          kind: 34,
          array: {
            type: "[Imported_NestedObjectType]",
            name: "optImportedNestedObjectArray",
            required: true,
            kind: 18,
            object: {
              type: "Imported_NestedObjectType",
              name: "optImportedNestedObjectArray",
              kind: 8192
            },
            item: {
              type: "Imported_NestedObjectType",
              name: "optImportedNestedObjectArray",
              kind: 8192
            }
          }
        },
        {
          type: "CustomEnum",
          name: "enum",
          required: true,
          kind: 34,
          enum: {
            type: "CustomEnum",
            name: "enum",
            required: true,
            kind: 16384
          }
        },
        {
          type: "CustomEnum",
          name: "optEnum",
          kind: 34,
          enum: {
            type: "CustomEnum",
            name: "optEnum",
            kind: 16384
          }
        },
        {
          type: "Imported_Enum",
          name: "importedEnum",
          required: true,
          kind: 34,
          enum: {
            type: "Imported_Enum",
            name: "importedEnum",
            required: true,
            kind: 16384
          }
        },
        {
          type: "Imported_Enum",
          name: "optImportedEnum",
          kind: 34,
          enum: {
            type: "Imported_Enum",
            name: "optImportedEnum",
            kind: 16384
          },
          comment: "optImportedEnum comment"
        }
      ],
      comment: "CustomType comment"
    },
    {
      type: "NestedObjectType",
      kind: 1,
      properties: [
        {
          type: "ObjectType",
          name: "nestedObject",
          required: true,
          kind: 34,
          object: {
            type: "ObjectType",
            name: "nestedObject",
            required: true,
            kind: 8192
          }
        }
      ]
    },
    {
      type: "ObjectType",
      kind: 1,
      properties: [
        {
          type: "String",
          name: "prop",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "prop",
            required: true,
            kind: 4
          }
        }
      ]
    }
  ],
  enumTypes: [
    {
      type: "CustomEnum",
      kind: 8,
      constants: [
        "STRING",
        "BYTES"
      ]
    }
  ],
  importedObjectTypes: [
    {
      type: "Imported_NestedObjectType",
      kind: 1025,
      properties: [
        {
          type: "Imported_ObjectType",
          name: "nestedObject",
          required: true,
          kind: 34,
          object: {
            type: "Imported_ObjectType",
            name: "nestedObject",
            required: true,
            kind: 8192
          }
        }
      ],
      comment: "Imported_NestedObjectType comment",
      uri: "imported.eth",
      namespace: "Imported",
      nativeType: "NestedObjectType"
    },
    {
      type: "Imported_ObjectType",
      kind: 1025,
      properties: [
        {
          type: "String",
          name: "prop",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "prop",
            required: true,
            kind: 4
          }
        }
      ],
      uri: "imported.eth",
      namespace: "Imported",
      nativeType: "ObjectType"
    }
  ],
  importedEnumTypes: [
    {
      type: "Imported_Enum",
      kind: 520,
      constants: [
        "STRING",
        "BYTES"
      ],
      comment: "Imported_Enum comment",
      uri: "imported.eth",
      namespace: "Imported",
      nativeType: "ImportedEnum"
    }
  ],
  moduleType: {
    type: "Module",
    kind: 128,
    methods: [
      {
        type: "Method",
        name: "method1",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "String",
            name: "str",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "str",
              required: true,
              kind: 4
            }
          },
          {
            type: "String",
            name: "optStr",
            kind: 34,
            scalar: {
              type: "String",
              name: "optStr",
              kind: 4
            }
          },
          {
            type: "UInt",
            name: "u",
            required: true,
            kind: 34,
            scalar: {
              type: "UInt",
              name: "u",
              required: true,
              kind: 4
            }
          },
          {
            type: "UInt",
            name: "optU",
            kind: 34,
            scalar: {
              type: "UInt",
              name: "optU",
              kind: 4
            }
          },
          {
            type: "[[UInt]]",
            name: "uArrayArray",
            required: true,
            kind: 34,
            array: {
              type: "[[UInt]]",
              name: "uArrayArray",
              required: true,
              kind: 18,
              array: {
                type: "[UInt]",
                name: "uArrayArray",
                kind: 18,
                scalar: {
                  type: "UInt",
                  name: "uArrayArray",
                  kind: 4
                },
                item: {
                  type: "UInt",
                  name: "uArrayArray",
                  kind: 4
                }
              },
              item: {
                type: "[UInt]",
                name: "uArrayArray",
                kind: 18,
                scalar: {
                  type: "UInt",
                  name: "uArrayArray",
                  kind: 4
                },
                item: {
                  type: "UInt",
                  name: "uArrayArray",
                  kind: 4
                }
              }
            }
          }
        ],
        return: {
          type: "String",
          name: "method1",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "method1",
            required: true,
            kind: 4
          }
        }
      },
      {
        type: "Method",
        name: "method2",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "[String]",
            name: "arg",
            required: true,
            kind: 34,
            array: {
              type: "[String]",
              name: "arg",
              required: true,
              kind: 18,
              scalar: {
                type: "String",
                name: "arg",
                required: true,
                kind: 4
              },
              item: {
                type: "String",
                name: "arg",
                required: true,
                kind: 4
              }
            },
            comment: "arg comment"
          }
        ],
        return: {
          type: "[Int32]",
          name: "method2",
          required: true,
          kind: 34,
          array: {
            type: "[Int32]",
            name: "method2",
            required: true,
            kind: 18,
            scalar: {
              type: "Int32",
              name: "method2",
              required: true,
              kind: 4
            },
            item: {
              type: "Int32",
              name: "method2",
              required: true,
              kind: 4
            }
          }
        },
        comment: "method2 comment"
      },
      {
        type: "Method",
        name: "localObjects",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "NestedObjectType",
            name: "nestedLocalObject",
            kind: 34,
            object: {
              type: "NestedObjectType",
              name: "nestedLocalObject",
              kind: 8192
            },
          },
          {
            type: "[NestedObjectType]",
            name: "localObjectArray",
            kind: 34,
            array: {
              type: "[NestedObjectType]",
              name: "localObjectArray",
              kind: 18,
              object: {
                type: "NestedObjectType",
                name: "localObjectArray",
                required: true,
                kind: 8192
              },
              item: {
                type: "NestedObjectType",
                name: "localObjectArray",
                required: true,
                kind: 8192
              }
            }
          }
        ],
        return: {
          type: "NestedObjectType",
          name: "localObjects",
          kind: 34,
          object: {
            type: "NestedObjectType",
            name: "localObjects",
            kind: 8192
          }
        }
      },
      {
        type: "Method",
        name: "importedObjects",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "Imported_NestedObjectType",
            name: "nestedLocalObject",
            kind: 34,
            object: {
              type: "Imported_NestedObjectType",
              name: "nestedLocalObject",
              kind: 8192
            }
          },
          {
            type: "[Imported_NestedObjectType]",
            name: "localObjectArray",
            kind: 34,
            array: {
              type: "[Imported_NestedObjectType]",
              name: "localObjectArray",
              kind: 18,
              object: {
                type: "Imported_NestedObjectType",
                name: "localObjectArray",
                required: true,
                kind: 8192
              },
              item: {
                type: "Imported_NestedObjectType",
                name: "localObjectArray",
                required: true,
                kind: 8192
              }
            }
          }
        ],
        return: {
          type: "Imported_NestedObjectType",
          name: "importedObjects",
          kind: 34,
          object: {
            type: "Imported_NestedObjectType",
            name: "importedObjects",
            kind: 8192
          }
        }
      }
    ],
    imports: [
      {
        type: "Imported_NestedObjectType"
      },
      {
        type: "Imported_ObjectType"
      }
    ],
    comment: "Module comment"
  }
};
