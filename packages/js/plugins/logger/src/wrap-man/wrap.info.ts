import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "Logger",
  type: "plugin",
  version: "0.1",
  abi: {
    objectTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [
      {
        type: "Logger_Module",
        kind: 256,
        methods: [
          {
            type: "Method",
            name: "log",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "Logger_LogLevel",
                name: "level",
                required: true,
                kind: 34,
                enum: {
                  type: "Logger_LogLevel",
                  name: "level",
                  required: true,
                  kind: 16384,
                },
              },
              {
                type: "String",
                name: "message",
                required: true,
                kind: 34,
                scalar: {
                  type: "String",
                  name: "message",
                  required: true,
                  kind: 4,
                },
              },
            ],
            return: {
              type: "Boolean",
              name: "log",
              required: true,
              kind: 34,
              scalar: { type: "Boolean", name: "log", required: true, kind: 4 },
            },
          },
        ],
        uri: "ens/logger.core.polywrap.eth",
        namespace: "Logger",
        nativeType: "Module",
        isInterface: false,
      },
    ],
    importedEnumTypes: [
      {
        type: "Logger_LogLevel",
        kind: 520,
        constants: ["DEBUG", "INFO", "WARN", "ERROR"],
        uri: "ens/logger.core.polywrap.eth",
        namespace: "Logger",
        nativeType: "LogLevel",
      },
    ],
    importedEnvTypes: [],
    moduleType: {
      type: "Module",
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "log",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "Logger_LogLevel",
              name: "level",
              required: true,
              kind: 34,
              enum: {
                type: "Logger_LogLevel",
                name: "level",
                required: true,
                kind: 16384,
              },
            },
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "Boolean",
            name: "log",
            required: true,
            kind: 34,
            scalar: { type: "Boolean", name: "log", required: true, kind: 4 },
          },
        },
      ],
      imports: [{ type: "Logger_Module" }, { type: "Logger_LogLevel" }],
      interfaces: [
        {
          type: "Logger_Module",
          kind: 2048,
        },
      ],
    }
  }
};
