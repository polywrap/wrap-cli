import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "Uts46",
  type: "plugin",
  version: "0.1",
  abi: {
    objectTypes: [
      {
        type: "ConvertResult",
        name: null,
        required: null,
        kind: 1,
        properties: [
          {
            type: "String",
            name: "IDN",
            required: true,
            kind: 34,
            array: null,
            map: null,
            scalar: { type: "String", name: "IDN", required: true, kind: 4 },
            object: null,
            enum: null,
            unresolvedObjectOrEnum: null,
          },
          {
            type: "String",
            name: "PC",
            required: true,
            kind: 34,
            array: null,
            map: null,
            scalar: { type: "String", name: "PC", required: true, kind: 4 },
            object: null,
            enum: null,
            unresolvedObjectOrEnum: null,
          },
        ],
        interfaces: [],
      },
    ],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnumTypes: [],
    importedEnvTypes: [],
    moduleType: {
      type: "Module",
      name: null,
      required: null,
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "toAscii",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "value",
              required: true,
              kind: 34,
              array: null,
              map: null,
              scalar: { type: "String", name: "value", required: true, kind: 4 },
              object: null,
              enum: null,
              unresolvedObjectOrEnum: null,
            },
          ],
          return: {
            type: "String",
            name: "toAscii",
            required: true,
            kind: 34,
            array: null,
            map: null,
            scalar: { type: "String", name: "toAscii", required: true, kind: 4 },
            object: null,
            enum: null,
            unresolvedObjectOrEnum: null,
          },
        },
        {
          type: "Method",
          name: "toUnicode",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "value",
              required: true,
              kind: 34,
              array: null,
              map: null,
              scalar: { type: "String", name: "value", required: true, kind: 4 },
              object: null,
              enum: null,
              unresolvedObjectOrEnum: null,
            },
          ],
          return: {
            type: "String",
            name: "toUnicode",
            required: true,
            kind: 34,
            array: null,
            map: null,
            scalar: {
              type: "String",
              name: "toUnicode",
              required: true,
              kind: 4,
            },
            object: null,
            enum: null,
            unresolvedObjectOrEnum: null,
          },
        },
        {
          type: "Method",
          name: "convert",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "value",
              required: true,
              kind: 34,
              array: null,
              map: null,
              scalar: { type: "String", name: "value", required: true, kind: 4 },
              object: null,
              enum: null,
              unresolvedObjectOrEnum: null,
            },
          ],
          return: {
            type: "ConvertResult",
            name: "convert",
            required: true,
            kind: 34,
            array: null,
            map: null,
            scalar: null,
            object: {
              type: "ConvertResult",
              name: "convert",
              required: true,
              kind: 8192,
            },
            enum: null,
            unresolvedObjectOrEnum: null,
          },
        },
      ],
      imports: [],
      interfaces: [],
    }
  }
};
