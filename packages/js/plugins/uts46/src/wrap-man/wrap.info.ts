import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "Uts46",
  type: "plugin",
  version: "0.1",
  abi: {
    objectTypes: [
      {
        type: "ConvertResult",
        kind: 1,
        properties: [
          {
            type: "String",
            name: "IDN",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "IDN", required: true, kind: 4 }
          },
          {
            type: "String",
            name: "PC",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "PC", required: true, kind: 4 },
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
              scalar: { type: "String", name: "value", required: true, kind: 4 },
            },
          ],
          return: {
            type: "String",
            name: "toAscii",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "toAscii", required: true, kind: 4 },
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
              scalar: { type: "String", name: "value", required: true, kind: 4 },
            },
          ],
          return: {
            type: "String",
            name: "toUnicode",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "toUnicode",
              required: true,
              kind: 4,
            },
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
              scalar: { type: "String", name: "value", required: true, kind: 4 },
            },
          ],
          return: {
            type: "ConvertResult",
            name: "convert",
            required: true,
            kind: 34,
            object: {
              type: "ConvertResult",
              name: "convert",
              required: true,
              kind: 8192,
            },
          },
        },
      ],
      imports: [],
      interfaces: [],
    }
  }
};
