import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "GraphNode",
  type: "plugin",
  version: "0.1",
  abi: {
    version: "0.1",
    importedObjectTypes: [
      {
        type: "HTTP_Request",
        kind: 1025,
        properties: [
          {
            type: "[HTTP_Header]",
            name: "headers",
            kind: 34,
            array: {
              type: "[HTTP_Header]",
              name: "headers",
              kind: 18,
              object: {
                type: "HTTP_Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
              item: {
                type: "HTTP_Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
            },
          },
          {
            type: "[HTTP_UrlParam]",
            name: "urlParams",
            kind: 34,
            array: {
              type: "[HTTP_UrlParam]",
              name: "urlParams",
              kind: 18,
              object: {
                type: "HTTP_UrlParam",
                name: "urlParams",
                required: true,
                kind: 8192,
              },
              item: {
                type: "HTTP_UrlParam",
                name: "urlParams",
                required: true,
                kind: 8192,
              },
            },
          },
          {
            type: "HTTP_ResponseType",
            name: "responseType",
            required: true,
            kind: 34,
            enum: {
              type: "HTTP_ResponseType",
              name: "responseType",
              required: true,
              kind: 16384,
            },
          },
          {
            type: "String",
            name: "body",
            kind: 34,
            scalar: { type: "String", name: "body", kind: 4 },
          },
        ],
        uri: "ens/http.polywrap.eth",
        namespace: "HTTP",
        nativeType: "Request",
      },
      {
        type: "HTTP_Header",
        kind: 1025,
        properties: [
          {
            type: "String",
            name: "key",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "key", required: true, kind: 4 },
          },
          {
            type: "String",
            name: "value",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "value", required: true, kind: 4 },
          },
        ],
        uri: "ens/http.polywrap.eth",
        namespace: "HTTP",
        nativeType: "Header",
      },
      {
        type: "HTTP_UrlParam",
        kind: 1025,
        properties: [
          {
            type: "String",
            name: "key",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "key", required: true, kind: 4 },
          },
          {
            type: "String",
            name: "value",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "value", required: true, kind: 4 },
          },
        ],
        uri: "ens/http.polywrap.eth",
        namespace: "HTTP",
        nativeType: "UrlParam",
      },
      {
        type: "HTTP_Response",
        kind: 1025,
        properties: [
          {
            type: "Int",
            name: "status",
            required: true,
            kind: 34,
            scalar: { type: "Int", name: "status", required: true, kind: 4 },
          },
          {
            type: "String",
            name: "statusText",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "statusText",
              required: true,
              kind: 4,
            },
          },
          {
            type: "[HTTP_Header]",
            name: "headers",
            kind: 34,
            array: {
              type: "[HTTP_Header]",
              name: "headers",
              kind: 18,
              object: {
                type: "HTTP_Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
              item: {
                type: "HTTP_Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
            },
          },
          {
            type: "String",
            name: "body",
            kind: 34,
            scalar: { type: "String", name: "body", kind: 4 },
          },
        ],
        uri: "ens/http.polywrap.eth",
        namespace: "HTTP",
        nativeType: "Response",
      },
    ],
    importedModuleTypes: [
      {
        type: "HTTP_Module",
        kind: 256,
        methods: [
          {
            type: "Method",
            name: "get",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "url",
                required: true,
                kind: 34,
                scalar: {
                  type: "String",
                  name: "url",
                  required: true,
                  kind: 4,
                },
              },
              {
                type: "HTTP_Request",
                name: "request",
                kind: 34,
                object: {
                  type: "HTTP_Request",
                  name: "request",
                  kind: 8192,
                },
              },
            ],
            return: {
              type: "HTTP_Response",
              name: "get",
              kind: 34,
              object: {
                type: "HTTP_Response",
                name: "get",
                kind: 8192,
              },
            },
          },
          {
            type: "Method",
            name: "post",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "String",
                name: "url",
                required: true,
                kind: 34,
                scalar: {
                  type: "String",
                  name: "url",
                  required: true,
                  kind: 4,
                },
              },
              {
                type: "HTTP_Request",
                name: "request",
                kind: 34,
                object: {
                  type: "HTTP_Request",
                  name: "request",
                  kind: 8192,
                },
              },
            ],
            return: {
              type: "HTTP_Response",
              name: "post",
              kind: 34,
              object: {
                type: "HTTP_Response",
                name: "post",
                kind: 8192,
              },
            },
          },
        ],
        uri: "ens/http.polywrap.eth",
        namespace: "HTTP",
        nativeType: "Module",
        isInterface: false,
      },
    ],
    importedEnumTypes: [
      {
        type: "HTTP_ResponseType",
        kind: 520,
        constants: ["TEXT", "BINARY"],
        uri: "ens/http.polywrap.eth",
        namespace: "HTTP",
        nativeType: "ResponseType",
      },
    ],
    moduleType: {
      type: "Module",
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "querySubgraph",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "subgraphAuthor",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "subgraphAuthor",
                required: true,
                kind: 4,
              },
            },
            {
              type: "String",
              name: "subgraphName",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "subgraphName",
                required: true,
                kind: 4,
              },
            },
            {
              type: "String",
              name: "query",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "query",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "querySubgraph",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "querySubgraph",
              required: true,
              kind: 4,
            },
          },
        },
      ],
      imports: [
        { type: "HTTP_Module" },
        { type: "HTTP_Request" },
        { type: "HTTP_Header" },
        { type: "HTTP_UrlParam" },
        { type: "HTTP_ResponseType" },
        { type: "HTTP_Response" },
      ],
    },
  },
};
