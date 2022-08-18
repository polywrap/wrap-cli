import {
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  moduleType: {
    type: "Module",
    kind: 128,
    methods: [
      {
        type: "Method",
        name: "cat",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "String",
            name: "cid",
            required: true,
            kind: 34,
            scalar: { type: "String", name: "cid", required: true, kind: 4 },
          },
          {
            type: "Ipfs_Ipfs_Options",
            name: "options",
            kind: 34,
            object: {
              type: "Ipfs_Ipfs_Options",
              name: "options",
              kind: 8192,
            },
          },
        ],
        return: {
          type: "Bytes",
          name: "cat",
          required: true,
          kind: 34,
          scalar: { type: "Bytes", name: "cat", required: true, kind: 4 },
        },
      },
    ],
    imports: [
      { type: "Ipfs_Module" },
      { type: "Ipfs_Ipfs_Options" }
    ],
    interfaces: [
      {
        type: "Ipfs_Module",
        kind: 2048,
      },
    ],
  },
  importedObjectTypes: [
    {
      type: "Ipfs_Ipfs_Options",
      kind: 1025,
      properties: [
        {
          type: "UInt32",
          name: "timeout",
          kind: 34,
          scalar: {
            type: "UInt32",
            name: "timeout",
            kind: 4,
          },
          comment:
            "      Timeout (in ms) for the operation.\nFallback providers are used if timeout is reached.",
        },
        {
          type: "String",
          name: "provider",
          kind: 34,
          scalar: {
            type: "String",
            name: "provider",
            kind: 4,
          },
          comment: "The IPFS provider to be used",
        },
        {
          type: "Boolean",
          name: "disableParallelRequests",
          kind: 34,
          scalar: {
            type: "Boolean",
            name: "disableParallelRequests",
            kind: 4,
          },
          comment:
            "Disable querying providers in parallel when resolving URIs",
        },
      ],
      uri: "external.eth",
      namespace: "Ipfs",
      nativeType: "Ipfs_Options",
    },
  ],
  importedModuleTypes: [
    {
      type: "Ipfs_Module",
      kind: 256,
      methods: [
        {
          type: "Method",
          name: "cat",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "cid",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "cid",
                required: true,
                kind: 4,
              },
            },
            {
              type: "Ipfs_Ipfs_Options",
              name: "options",
              kind: 34,
              object: {
                type: "Ipfs_Ipfs_Options",
                name: "options",
                kind: 8192,
              },
            },
          ],
          return: {
            type: "Bytes",
            name: "cat",
            required: true,
            kind: 34,
            scalar: { type: "Bytes", name: "cat", required: true, kind: 4 },
          },
        },
      ],
      uri: "external.eth",
      namespace: "Ipfs",
      nativeType: "Module",
      isInterface: false,
    },
  ]
};
