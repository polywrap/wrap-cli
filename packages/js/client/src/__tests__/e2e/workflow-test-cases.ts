import { Workflow } from "@polywrap/core-js";

export const sanityWorkflow: Workflow = {
  name: "simple-storage",
  jobs: {
    cases: {
      steps: [
        {
          uri: "ens/testnet/simple-storage.eth",
          method: "deployContract",
          args: {
            connection: null,
          },
        },
      ],
      jobs: {
        case1: {
          steps: [
            {
              uri: "ens/testnet/simple-storage.eth",
              method: "setData",
              args: {
                address: "0xA57B8a5584442B467b4689F1144D269d096A3daF",
                value: 100,
                connection: null,
              },
            },
            {
              uri: "ens/testnet/simple-storage.eth",
              method: "getData",
              args: {
                address: "0xA57B8a5584442B467b4689F1144D269d096A3daF",
                connection: null,
              },
            },
          ],
        },
      },
    },
  },
};

export const outPropWorkflow: Workflow = {
  name: "simple-storage",
  jobs: {
    cases: {
      steps: [
        {
          uri: "ens/testnet/simple-storage.eth",
          method: "deployContract",
          args: {
            connection: null,
          },
        },
      ],
      jobs: {
        case1: {
          steps: [
            {
              uri: "ens/testnet/simple-storage.eth",
              method: "setData",
              args: {
                address: "$cases.0.data",
                value: 100,
                connection: null,
              },
            },
            {
              uri: "ens/testnet/simple-storage.eth",
              method: "getData",
              args: {
                address: "$cases.0.data",
                connection: null,
              },
            },
          ],
        },
      },
    },
  },
};