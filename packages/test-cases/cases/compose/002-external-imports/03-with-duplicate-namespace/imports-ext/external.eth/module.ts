import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export const abi: WrapAbi = {
  version: "0.1",
  objectTypes: [],
  enumTypes: [],
  interfaceTypes: [],
  importedObjectTypes: [
    {
      type: "Ipfs_Options",
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
            "    Timeout (in ms) for the operation.\nFallback providers are used if timeout is reached.",
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
      interfaces: [],
      uri: "ens/ipfs.polywrap.eth",
      namespace: "Ipfs",
      nativeType: "Options",
    },
    {
      type: "Ipfs_ResolveResult",
      kind: 1025,
      properties: [
        {
          type: "String",
          name: "cid",
          required: true,
          kind: 34,
          scalar: { type: "String", name: "cid", required: true, kind: 4 },
        },
        {
          type: "String",
          name: "provider",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "provider",
            required: true,
            kind: 4,
          },
        },
      ],
      interfaces: [],
      uri: "ens/ipfs.polywrap.eth",
      namespace: "Ipfs",
      nativeType: "ResolveResult",
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
              type: "Ipfs_Options",
              name: "options",
              kind: 34,
              object: {
                type: "Ipfs_Options",
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
      uri: "ens/ipfs.polywrap.eth",
      namespace: "Ipfs",
      nativeType: "Module",
      isInterface: false,
    },
  ],
  importedEnumTypes: [],
  importedEnvTypes: [],
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
            type: "Ipfs_Options",
            name: "options",
            kind: 34,
            object: {
              type: "Ipfs_Options",
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
      { type: "Ipfs_Options" },
      { type: "Ipfs_ResolveResult" },
    ],
    interfaces: [
      {
        type: "Ipfs_Module",
        kind: 2048,
      },
    ],
  },
};
