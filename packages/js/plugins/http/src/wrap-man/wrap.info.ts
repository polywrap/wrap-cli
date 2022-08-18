import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "Http",
  type: "plugin",
  version: "0.1",
  abi: {
    version: "0.1",
    objectTypes: [
      {
        type: "Header",
        kind: 1,
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
      },
      {
        type: "UrlParam",
        kind: 1,
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
      },
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
            type: "[Header]",
            name: "headers",
            kind: 34,
            array: {
              type: "[Header]",
              name: "headers",
              kind: 18,
              object: {
                type: "Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
              item: {
                type: "Header",
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
      },
      {
        type: "Request",
        kind: 1,
        properties: [
          {
            type: "[Header]",
            name: "headers",
            kind: 34,
            array: {
              type: "[Header]",
              name: "headers",
              kind: 18,
              object: {
                type: "Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
              item: {
                type: "Header",
                name: "headers",
                required: true,
                kind: 8192,
              },
            },
          },
          {
            type: "[UrlParam]",
            name: "urlParams",
            kind: 34,
            array: {
              type: "[UrlParam]",
              name: "urlParams",
              kind: 18,
              object: {
                type: "UrlParam",
                name: "urlParams",
                required: true,
                kind: 8192,
              },
              item: {
                type: "UrlParam",
                name: "urlParams",
                required: true,
                kind: 8192,
              },
            },
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
