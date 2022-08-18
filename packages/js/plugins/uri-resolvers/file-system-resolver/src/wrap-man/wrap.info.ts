import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "FileSystemResolver",
  type: "plugin",
  version: "0.1",
  abi: {
    version: "0.1",
    importedObjectTypes: [
      {
        type: "UriResolver_MaybeUriOrManifest",
        kind: 1025,
        properties: [
          {
            type: "String",
            name: "uri",
            kind: 34,
            scalar: { type: "String", name: "uri", kind: 4 },
          },
          {
            type: "Bytes",
            name: "manifest",
            kind: 34,
            scalar: { type: "Bytes", name: "manifest", kind: 4 },
          },
        ],
        uri: "ens/uri-resolver.core.polywrap.eth",
        namespace: "UriResolver",
        nativeType: "MaybeUriOrManifest",
      },
    ],
    importedModuleTypes: [
      {
        type: "UriResolver_Module",
        kind: 256,
        methods: [
          {
            type: "Method",
            name: "tryResolveUri",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "authority",
                required: true,
                kind: 34,
                scalar: {
                  type: "String",
                  name: "authority",
                  required: true,
                  kind: 4,
                },
              },
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
            ],
            return: {
              type: "UriResolver_MaybeUriOrManifest",
              name: "tryResolveUri",
              kind: 34,
              object: {
                type: "UriResolver_MaybeUriOrManifest",
                name: "tryResolveUri",
                kind: 8192,
              },
            },
          },
          {
            type: "Method",
            name: "getFile",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
            ],
            return: {
              type: "Bytes",
              name: "getFile",
              kind: 34,
              scalar: { type: "Bytes", name: "getFile", kind: 4 },
            },
          },
        ],
        uri: "ens/uri-resolver.core.polywrap.eth",
        namespace: "UriResolver",
        nativeType: "Module",
        isInterface: false,
      },
      {
        type: "FileSystem_Module",
        kind: 256,
        methods: [
          {
            type: "Method",
            name: "readFile",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
            ],
            return: {
              type: "Bytes",
              name: "readFile",
              required: true,
              kind: 34,
              scalar: {
                type: "Bytes",
                name: "readFile",
                required: true,
                kind: 4,
              },
            },
          },
          {
            type: "Method",
            name: "readFileAsString",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
              {
                type: "FileSystem_Encoding",
                name: "encoding",
                kind: 34,
                enum: {
                  type: "FileSystem_Encoding",
                  name: "encoding",
                  kind: 16384,
                },
              },
            ],
            return: {
              type: "String",
              name: "readFileAsString",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "readFileAsString",
                required: true,
                kind: 4,
              },
            },
          },
          {
            type: "Method",
            name: "exists",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
            ],
            return: {
              type: "Boolean",
              name: "exists",
              required: true,
              kind: 34,
              scalar: {
                type: "Boolean",
                name: "exists",
                required: true,
                kind: 4,
              },
            },
          },
          {
            type: "Method",
            name: "writeFile",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
              {
                type: "Bytes",
                name: "data",
                required: true,
                kind: 34,
                scalar: { type: "Bytes", name: "data", required: true, kind: 4 },
              },
            ],
            return: {
              type: "Boolean",
              name: "writeFile",
              kind: 34,
              scalar: {
                type: "Boolean",
                name: "writeFile",
                kind: 4,
              },
            },
          },
          {
            type: "Method",
            name: "mkdir",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
              {
                type: "Boolean",
                name: "recursive",
                kind: 34,
                scalar: {
                  type: "Boolean",
                  name: "recursive",
                  kind: 4,
                },
              },
            ],
            return: {
              type: "Boolean",
              name: "mkdir",
              kind: 34,
              scalar: { type: "Boolean", name: "mkdir", kind: 4 },
            },
          },
          {
            type: "Method",
            name: "rm",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
              {
                type: "Boolean",
                name: "recursive",
                kind: 34,
                scalar: {
                  type: "Boolean",
                  name: "recursive",
                  kind: 4,
                },
              },
              {
                type: "Boolean",
                name: "force",
                kind: 34,
                scalar: {
                  type: "Boolean",
                  name: "force",
                  kind: 4,
                },
              },
            ],
            return: {
              type: "Boolean",
              name: "rm",
              kind: 34,
              scalar: { type: "Boolean", name: "rm", kind: 4 },
            },
          },
          {
            type: "Method",
            name: "rmdir",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "path",
                required: true,
                kind: 34,
                scalar: { type: "String", name: "path", required: true, kind: 4 },
              },
            ],
            return: {
              type: "Boolean",
              name: "rmdir",
              kind: 34,
              scalar: { type: "Boolean", name: "rmdir", kind: 4 },
            },
          },
        ],
        uri: "ens/fs.polywrap.eth",
        namespace: "FileSystem",
        nativeType: "Module",
        isInterface: false,
      },
    ],
    importedEnumTypes: [
      {
        type: "FileSystem_Encoding",
        kind: 520,
        constants: [
          "ASCII",
          "UTF8",
          "UTF16LE",
          "UCS2",
          "BASE64",
          "BASE64URL",
          "LATIN1",
          "BINARY",
          "HEX",
        ],
        uri: "ens/fs.polywrap.eth",
        namespace: "FileSystem",
        nativeType: "Encoding",
      },
    ],
    moduleType: {
      type: "Module",
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "tryResolveUri",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "authority",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "authority",
                required: true,
                kind: 4,
              },
            },
            {
              type: "String",
              name: "path",
              required: true,
              kind: 34,
              scalar: { type: "String", name: "path", required: true, kind: 4 },
            },
          ],
          return: {
            type: "UriResolver_MaybeUriOrManifest",
            name: "tryResolveUri",
            kind: 34,
            object: {
              type: "UriResolver_MaybeUriOrManifest",
              name: "tryResolveUri",
              kind: 8192,
            },
          },
        },
        {
          type: "Method",
          name: "getFile",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "path",
              required: true,
              kind: 34,
              scalar: { type: "String", name: "path", required: true, kind: 4 },
            },
          ],
          return: {
            type: "Bytes",
            name: "getFile",
            kind: 34,
            scalar: { type: "Bytes", name: "getFile", kind: 4 },
          },
        },
      ],
      imports: [
        { type: "UriResolver_Module" },
        { type: "UriResolver_MaybeUriOrManifest" },
        { type: "FileSystem_Module" },
        { type: "FileSystem_Encoding" },
      ],
      interfaces: [
        {
          type: "UriResolver_Module",
          kind: 2048,
        },
      ],
    }
  }
};
