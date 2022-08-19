import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "Http",
  type: "plugin",
  version: "0.1",
  abi: {
    version: "0.1",
    objectTypes: [
      {
        type: "Response",
        kind: 1,
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
            type: "Map<String, String>",
            name: "headers",
            map: {
              type: "Map<String, String>",
              scalar: {
                name: "headers",
                type: "String",
                required: true,
                kind: 4
              },
              kind: 262146,
              name: "headers",
              key: {
                name: "headers",
                type: "String",
                required: true,
                kind: 4
              },
              value: {
                name: "headers",
                type: "String",
                required: true,
                kind: 4
              },
              required: true
            },
            required: false,
            kind: 34
          },
          {
            type: "String",
            name: "body",
            kind: 34,
            scalar: { type: "String", name: "body", kind: 4 },
          },
        ],
      },
      {
        type: "Request",
        kind: 1,
        properties: [
          {
            type: "Map<String, String>",
            name: "headers",
            map: {
              type: "Map<String, String>",
              scalar: {
                name: "headers",
                type: "String",
                required: true,
                kind: 4
              },
              kind: 262146,
              name: "headers",
              key: {
                name: "headers",
                type: "String",
                required: true,
                kind: 4
              },
              value: {
                name: "headers",
                type: "String",
                required: true,
                kind: 4
              },
              required: true
            },
            required: false,
            kind: 34
          },
          {
            type: "Map<String, String>",
            name: "urlParams",
            map: {
              type: "Map<String, String>",
              scalar: {
                name: "urlParams",
                type: "String",
                required: true,
                kind: 4
              },
              kind: 262146,
              name: "urlParams",
              key: {
                name: "urlParams",
                type: "String",
                required: true,
                kind: 4
              },
              value: {
                name: "urlParams",
                type: "String",
                required: true,
                kind: 4
              },
              required: true
            },
            required: false,
            kind: 34
          },
          {
            type: "ResponseType",
            name: "responseType",
            required: true,
            kind: 34,
            enum: {
              type: "ResponseType",
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
      },
    ],
    enumTypes: [
      {
        type: "ResponseType",
        kind: 8,
        constants: ["TEXT", "BINARY"],
      },
    ],
    moduleType: {
      type: "Module",
      kind: 128,
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
              scalar: { type: "String", name: "url", required: true, kind: 4 },
            },
            {
              type: "Request",
              name: "request",
              kind: 34,
              object: {
                type: "Request",
                name: "request",
                kind: 8192,
              },
            },
          ],
          return: {
            type: "Response",
            name: "get",
            kind: 34,
            object: {
              type: "Response",
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
              scalar: { type: "String", name: "url", required: true, kind: 4 },
            },
            {
              type: "Request",
              name: "request",
              kind: 34,
              object: {
                type: "Request",
                name: "request",
                kind: 8192,
              },
            },
          ],
          return: {
            type: "Response",
            name: "post",
            kind: 34,
            object: {
              type: "Response",
              name: "post",
              kind: 8192,
            },
          },
        },
      ],
    },
  },
};
